import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { validatePassword } from '@/lib/utils/index';
import { auth } from '@/auth';

export const GET = async (req: Request): Promise<Response> => {
    try {
        const { searchParams } = new URL(req.url);
        const uuid = searchParams.get('uuid');

        if (!uuid) {
            return NextResponse.json(
                { error: 'UUID is required' },
                { status: 400 }
            );
        }
        const session = await auth();
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const client = await clientPromise;
        const db = client.db('read-with-me');

        // Find the user by their UUID
        const user =
            (await db.collection('users').findOne({ uuid })) ??
            (await db.collection('childUsers').findOne({ uuid }));

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }
        // user requesting their own data
        const isSelf = session.user.uuid === uuid;
        const isParentOfChild =
            !user.isParent && user.parentId === session.user.uuid;

        // if it's not their own data and not parent, deny access
        if (!isSelf && !isParentOfChild) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const parentId = user.isParent ? user.uuid : user.parentId || null;
        const children = user.children || null;

        return NextResponse.json(
            {
                uuid: user.uuid,
                parentId,
                children,
                userName: user.userName,
                grade: user.grade ?? null,
                googleId: user.googleId ?? null,
                email: user.email ?? null
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(
            { error: 'An unknown error occurred.' },
            { status: 500 }
        );
    }
};

// Sign up a new child user
export const POST = async (req: NextRequest): Promise<NextResponse> => {
    const { userName, password } = await req.json();

    const sanitizedUserName = userName?.trim().toLowerCase();

    if (!sanitizedUserName || !password) {
        return NextResponse.json(
            { error: 'Missing username or password' },
            { status: 400 }
        );
    }

    if (!validatePassword(password)) {
        return NextResponse.json(
            {
                error: 'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.'
            },
            { status: 400 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db();

        const existingChild = await db
            .collection('childUsers')
            .findOne({ userName: sanitizedUserName });

        if (existingChild) {
            return NextResponse.json(
                { error: 'Username already exists.' },
                { status: 409 }
            );
        }

        // hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.collection('childUsers').insertOne({
            userName: sanitizedUserName,
            password: hashedPassword,
            uuid: uuidv4(),
            isParent: false,
            createdAt: new Date()
        });

        return NextResponse.json(
            { userName: sanitizedUserName },
            { status: 201 }
        );
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
};

// This can be expanded later to include other user details
export const PUT = async (req: NextRequest): Promise<NextResponse> => {
    const { userName, grade } = await req.json();

    const sanitizedUserName = userName?.trim().toLowerCase();
    if (!sanitizedUserName || grade === undefined) {
        return NextResponse.json(
            { error: 'Missing child username or grade' },
            { status: 400 }
        );
    }

    const session = await auth();
    if (!session || !session.user.isParent) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parentUuid = session.user.uuid;

    try {
        const client = await clientPromise;
        const db = client.db();

        const child = await db
            .collection('childUsers')
            .findOne({ userName: sanitizedUserName });
        if (!child) {
            return NextResponse.json(
                { error: 'Child not found' },
                { status: 404 }
            );
        }
        // check if child already exists
        if (child.parentId === parentUuid) {
            return NextResponse.json(
                {
                    message: 'Child already linked to this parent.',
                    child: {
                        uuid: child.uuid,
                        userName: child.userName,
                        grade: child.grade ?? null
                    }
                },
                { status: 200 }
            );
        }

        // Prevent linking to a different parent
        if (child.parentId && child.parentId !== parentUuid) {
            return NextResponse.json(
                { error: 'Child is already linked to another parent' },
                { status: 403 }
            );
        }

        // Link child to parent and update grade
        await db.collection('childUsers').updateOne(
            { userName: sanitizedUserName },
            {
                $set: {
                    grade: Number(grade),
                    parentId: parentUuid
                }
            }
        );

        // Add child UUID to parent's children array
        await db
            .collection('users')
            .updateOne(
                { uuid: parentUuid },
                { $addToSet: { children: child.uuid } }
            );

        // return updated child info
        return NextResponse.json({
            success: true,
            child: {
                uuid: child.uuid,
                userName: child.userName,
                grade: Number(grade)
            }
        });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
};
