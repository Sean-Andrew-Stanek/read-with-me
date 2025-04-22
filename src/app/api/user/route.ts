import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { validatePassword } from '@/lib/utils/index';

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

        const parentId = user.isParent ? user.uuid : user.parentId || null;
        const children = user.children || null;

        return NextResponse.json(
            {
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

    if (!userName || !password) {
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
            .findOne({ userName });

        if (existingChild) {
            return NextResponse.json(
                { error: 'Username already exists.' },
                { status: 409 }
            );
        }
        // hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.collection('childUsers').insertOne({
            userName,
            password: hashedPassword,
            uuid: uuidv4(),
            isParent: false,
            createdAt: new Date()
        });

        return NextResponse.json({ userName }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
};

// This can be expanded later to include other user details
export const PUT = async (req: NextRequest): Promise<NextResponse> => {
    const { uuid, grade } = await req.json();

    if (!uuid || grade === undefined) {
        return NextResponse.json(
            { error: 'Missing uuid or grade' },
            { status: 400 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db();

        const result = await db
            .collection('childUsers')
            .updateOne({ uuid }, { $set: { grade: Number(grade) } });

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { error: 'User not found or grade not updated' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
};
