import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { LinkRequestArraySchema } from '@/lib/types/linkRequest';

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
            .find({
                parentId: session.user.uuid,
                status: 'pending',
                expiresAt: { $gt: new Date() }
            })
            .toArray();

        // add the child name to requests
        const enrichedRequests = await Promise.all(
            rawRequests.map(async req => {
                const child = await db
                    .collection('childUsers')
                    .findOne(
                        { uuid: req.childId },
                        { projection: { userName: 1 } }
                    );

                return {
                    ...req,
                    childName: child?.userName || 'Unnamed Child'
                };
            })
        );

        const validatedRequests =
            LinkRequestArraySchema.parse(enrichedRequests);

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
