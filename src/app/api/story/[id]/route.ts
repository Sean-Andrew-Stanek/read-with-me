import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';

export const GET = async (
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
    try {
        // const { id } = params;
        const id = (await params).id;
        const session = await auth();
        if (!session || !session.user?.uuid) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

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

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { newScore, paragraphIndex } = await req.json();
        const storyId = (await params).id;

        const client = await clientPromise;
        const db = client.db('read-with-me');
        const collection = db.collection('stories');

        // Fetch current story
        const story = await collection.findOne({ id: storyId });

        if (!story) {
            return NextResponse.json(
                { error: 'Story not found' },
                { status: 404 }
            );
        }

        // Merge new score
        const existingScores = story.scoresByParagraph || {};
        const updatedScores = {
            ...existingScores,
            [String(paragraphIndex)]: newScore
        };

        // Update story with merged scores
        await collection.updateOne(
            { id: storyId },
            { $set: { scoresByParagraph: updatedScores } }
        );

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const id = (await params).id;
        const session = await auth();

        if (!session || !session.user?.uuid) {
            return NextResponse.json({error: 'Unauthorized' }, {status: 401 });
        }

        const client = await clientPromise;
        const db = client.db('read-with-me');
        const result = await db.collection('stories').deleteOne({ id });

        if (result.deletedCount === 0) {
            return NextResponse.json({error: "Story not found."}, { status: 404 });
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500}
        );
    }
}