import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';

export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
    const session = await auth();
    if (!session?.user?.isParent) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { childUuid } = await req.json();

    const client = await clientPromise;
    const db = client.db('read-with-me');

    // remove child uuid from parent's child array
    await db
        .collection('users')
        .updateOne(
            { uuid: session.user.uuid },
            { $pull: { children: childUuid } }
        );

    // remove parent id from child
    await db
        .collection('childUsers')
        .updateOne({ uuid: childUuid }, { $unset: { parentId: '' } });

    return NextResponse.json({ success: true });
};
