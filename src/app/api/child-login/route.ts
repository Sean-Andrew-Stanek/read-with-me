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

        const user = await db
            .collection('childUsers')
            .findOne({ userName, password });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Optionally: store session/cookie logic here later

        return NextResponse.json(
            { message: 'Login successful' },
            { status: 200 }
        );
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
};
