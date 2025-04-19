import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    const { uuid, grade } = await req.json();

    if (!uuid || grade === undefined) {
        return NextResponse.json(
            { error: 'Missing uuid or grade' },
            { status: 400 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db();

        const result = await db
            .collection('childUsers')
            .updateOne({ uuid }, { $set: { grade: Number(grade) } });

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { error: 'User not found or grade not updated' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
};
