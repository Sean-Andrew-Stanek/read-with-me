import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    const { userName, password } = await req.json();

    if (!userName || !password) {
        return NextResponse.json(
            { error: 'Missing username or password' },
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

        await db.collection('childUsers').insertOne({
            userName,
            password,
            createdAt: new Date()
        });

        return NextResponse.json({ userName }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
};
