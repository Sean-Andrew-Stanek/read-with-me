import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { nanoid } from 'nanoid'; // generate unique id
import { LinkTokenSchema } from '@/lib/types/token';
import clientPromise from '@/lib/mongodb';

// parent creates a token
export const POST = async (_req: NextRequest): Promise<NextResponse> => {
    const session = await auth();

    if (!session?.user?.uuid || !session.user.isParent) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tokenData = {
        token: nanoid(6).toUpperCase(),
        parentId: session.user.uuid,
        isUsed: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours
    };

    try {
        const validated = LinkTokenSchema.parse(tokenData);
        const client = await clientPromise;
        const db = client.db('read-with-me');
        await db.collection('linkt_tokens').insertOne(validated);
        return NextResponse.json({ token: validated.token }, { status: 201 });
    } catch {
        return NextResponse.json(
            { error: 'Invalid token data' },
            { status: 400 }
        );
    }
};
