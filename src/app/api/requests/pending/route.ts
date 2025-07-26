import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';

export const GET = async () => {
    const session = await auth();

    if (!session?.user?.uuid || session.user.isParent) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('read-with-me');

    const request = await db.collection('link_requests').findOne({
        childId: session.user.uuid,
        status: 'pending',
        expiresAt: { $gt: new Date() }
    });

    return NextResponse.json({ pending: !!request });
};
