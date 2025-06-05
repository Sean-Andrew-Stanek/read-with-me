import { NextResponse } from 'next/server';
import { scoreSchema } from '@/lib/types/score';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
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
            createdAt: parsed.timestamp
                ? new Date(parsed.timestamp)
                : new Date()
        };

        // insert scoreData to mongoDB
        const result = await collection.insertOne(scoreData);

        // Send response that score was saved
        return NextResponse.json({
            success: true,
            insertedId: result.insertedId
        });
    } catch (err: any) {
        console.error('[API: /score] Failed to save score:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to save score' },
            { status: 400 }
        );
    }
}
