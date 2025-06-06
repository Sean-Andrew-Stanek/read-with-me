import { NextResponse } from 'next/server';
import { scoreSchema } from '@/lib/types/score';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const body = await req.json();
        const parsed = scoreSchema.parse(body);

        // connect to db
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('readingScores');

        // create scoreData object to store in db
        const scoreData = {
            storyId: parsed.storyId,
            expectedText: parsed.expectedText,
            userTranscript: parsed.userTranscript,
            score: parsed.score,
            childId: parsed.childId,
            parentId: parsed.parentId,
            createdAt: parsed.timestamp
                ? new Date(parsed.timestamp)
                : new Date()
        };

        // insert scoreData to mongoDB
        // const result = await collection.insertOne(scoreData);
        // update to override the last score
        const result = await collection.updateOne(
            {
                storyId: parsed.storyId,
                expectedText: parsed.expectedText,
                ...(parsed.childId ? { childId: parsed.childId } : {}),
                ...(parsed.parentId ? { parentId: parsed.parentId } : {})
            },
            { $set: scoreData },
            { upsert: true }
        );

        // Send response that score was saved
        return NextResponse.json({
            success: true,
            upsertedId: result.upsertedId
        });
    } catch (err) {
        // console.error('[API: /score] Failed to save score:', err);
        if (err instanceof Error) {
            return NextResponse.json(
                { error: err.message || 'Failed to save score' },
                { status: 400 }
            );
        } else {
            return NextResponse.json(
                { error: 'Unknown Error' },
                { status: 400 }
            );
        }
    }
}

export async function GET(req: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const storyId = searchParams.get('storyId');
        const expectedText = searchParams.get('expectedText');
        const childId = searchParams.get('childId');
        const parentId = searchParams.get('parentId');

        if (!storyId || !expectedText || (!childId && !parentId)) {
            return NextResponse.json(
                { error: 'Missing query parameters' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('readingScores');

        const query: Record<string, string> = {
            storyId,
            expectedText
        };

        if (childId) {
            query.childId = childId;
        } else if (parentId) {
            query.parentId = parentId;
        }

        const existingScore = await collection.findOne(query);

        return NextResponse.json({ score: existingScore?.score ?? null });
    } catch (err) {
        return NextResponse.json(
            { error: 'Failed to fetch score' },
            { status: 500 }
        );
    }
}
