import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';

export const PATCH = async (
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
): Promise<NextResponse> => {
    try {
        const session = await auth();
        if (!session?.user?.uuid || !session?.user?.isParent) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = (await params).token;
        const body = await req.json();
        const { status } = body;

        if (!['rejected', 'approved'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('read-with-me');

        const existingRequest = await db.collection('link_requests').findOne({
            token,
            parentId: session.user.uuid,
            status: 'pending'
        });

        // console.log('Parent ID from session:', session.user.uuid);
        // console.log('Incoming token:', token);
        // console.log('Trying to update where:', {
        //     token,
        //     parentId: session.user.uuid,
        //     status: 'pending'
        // });

        if (!existingRequest) {
            return NextResponse.json(
                { error: 'Request not found' },
                { status: 404 }
            );
        }

        if (existingRequest.status !== 'pending') {
            return NextResponse.json(
                { error: `Request is already ${existingRequest.status}` },
                { status: 409 }
            );
        }

        await db
            .collection('link_requests')
            .updateOne(
                { token, parentId: session?.user?.uuid },
                { $set: { status } }
            );

        const updatedResult = await db.collection('link_requests').findOne({
            token,
            parentId: session?.user?.uuid
        });

        if (!updatedResult) {
            return NextResponse.json(
                { error: 'Request not found' },
                { status: 404 }
            );
        }
        // If approved, update both child and parent documents
        if (status === 'approved') {
            await db.collection('childUsers').updateOne(
                { uuid: updatedResult.childId },
                {
                    $set: {
                        parentId: updatedResult.parentId,
                        parentLinkExpiresAt: updatedResult.expiresAt
                    }
                }
            );
            await db
                .collection('users')
                .updateOne(
                    { uuid: updatedResult.parentId },
                    { $addToSet: { children: updatedResult.childId } }
                );
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error', detail: String(error) },
            { status: 500 }
        );
    }
};
