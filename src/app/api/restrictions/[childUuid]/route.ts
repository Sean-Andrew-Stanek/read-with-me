import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { restrictionSchema } from '@/lib/types/restrictions';

// get restrictions
export const GET = async (
    _req: NextRequest,
    { params }: { params: { childUuid: string } }
): Promise<NextResponse> => {
    const client = await clientPromise;
    const db = client.db('read-with-me');

    const restriction = await db
        .collection('restrictions')
        .findOne({ childUuid: params.childUuid });

    return NextResponse.json(restriction || {}, { status: 200 });
};

// add restrictions
export const PUT = async (
    req: NextRequest,
    { params }: { params: Promise<{ childUuid: string }> }
): Promise<NextResponse> => {
    const client = await clientPromise;
    const db = client.db('read-with-me');

    const body = await req.json();
    const parsed = restrictionSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten() },
            { status: 400 }
        );
    }

    const { blacklistedWords, restrictedGenres, notes } = parsed.data;

    await db.collection('restrictions').updateOne(
        { childUuid: (await params).childUuid },
        {
            $set: {
                blacklistedWords,
                restrictedGenres,
                notes,
                updatedAt: new Date()
            },
            $setOnInsert: {
                childUuid: (await params).childUuid,
                createdAt: new Date()
            }
        },
        { upsert: true }
    );

    return NextResponse.json({ success: true }, { status: 200 });
};
