import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';

export const GET = async (
    _request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse> => {
    try {
        const session = await auth();
        if (!session || !session.user?.uuid) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = params;
        const client = await clientPromise;
        const db = client.db('read-with-me');

        const story = await db.collection('stories').findOne({ id });

        if (!story) {
            return NextResponse.json(
                { error: 'Story not found in db.' },
                { status: 404 }
            );
        }

        return NextResponse.json(story, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Unknown error.'
            },
            { status: 500 }
        );
    }
};
