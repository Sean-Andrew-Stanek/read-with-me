import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { LinkRequestArraySchema } from '@/lib/linkRequest';

export const GET = async (): Promise<NextResponse> => {
    const session = await auth();
    if (!session?.user?.uuid || !session.user.isParent) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('read-with-me');

        const rawRequests = await db
            .collection('link_requests')
            .find({ parentId: session.user.uuid, status: 'pending' })
            .toArray();

        const validatedRequests = LinkRequestArraySchema.parse(rawRequests);

        return NextResponse.json(validatedRequests);
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Server error while fetching requests',
                detail: String(error)
            },
            { status: 500 }
        );
    }
};
