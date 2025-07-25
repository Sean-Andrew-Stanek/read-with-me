import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { LinkRequestArraySchema } from '@/lib/linkRequest';

export const GET = async (): Promise<NextResponse> => {
    const session = await auth();
    if (!session?.user?.uuid || !session.user.isParent) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('read-with-me');

    const rawRequests = await db
        .collection('link_requests')
        .find({ parentId: session.user.uuid, status: 'pending' })
        .toArray(); // in case multiple children request at the same time

    // validate every field of request, filter out bad data
    const validatedRequests = LinkRequestArraySchema.parse(rawRequests);

    return NextResponse.json(validatedRequests);
};
