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
                childId: parsed.childId
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
