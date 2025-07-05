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
        // validating  tokenData before inserting
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

// Child submit the token to link to the parent
export const PUT = async (req: NextRequest): Promise<NextResponse> => {
    const session = await auth();

    if (!session?.user?.uuid || session.user.isParent) {
        return NextResponse.json({ erro: 'Unathorized' }, { status: 401 });
    }

    const { token } = await req.json();
    const client = await clientPromise;
    const db = client.db('read-with-me');

    const rawToken = await db.collection('link-tokens').findOne({ token });
    if (!rawToken) {
        return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }
    try {
        // validating raw token
        const linkToken = LinkTokenSchema.parse(rawToken);
        if (linkToken.isUsed || linkToken.expiresAt < new Date()) {
            return NextResponse.json(
                { error: 'Token is invalid or expired' },
                { status: 400 }
            );
        }

        // find the child's uuid and set their parent to the one with token
        await db
            .collection('childUsers')
            .updateOne(
                { uuid: session.user.uuid },
                { $set: { parentId: linkToken.parentId } }
            );

        await db
            .collection('link_tokens')
            .updateOne({ token }, { $set: { isUsed: true } });
        return NextResponse.json({ message: 'Linked successfully' });
    } catch {
        return NextResponse.json(
            { error: 'Invalid token data' },
            { status: 400 }
        );
    }
};
