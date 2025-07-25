import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';

export const PATCH = async (
    req: Request,
    { params }: { params: { token: string } }
): Promise<NextResponse> => {
    const session = await auth();
    if (!session?.user?.uuid || !session?.user?.isParent) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = params;
    const body = await req.json();
    const { status } = body;

    if (!['rejected', 'approved'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('read-with-me');

    const result = await db
        .collection('link_requests')
        .findOneAndUpdate(
            { token, parentId: session?.user?.uuid },
            { $set: { status } },
            { returnDocument: 'after' }
        );

    if (!result || !result.value) {
        return NextResponse.json(
            { error: 'Request not found' },
            { status: 404 }
        );
    }

    return NextResponse.json({
        message: 'Status updated',
        request: result.value
    });
};
