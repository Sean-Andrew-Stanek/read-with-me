import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
    try {
        const session = await auth();
        if (!session || !session.user?.uuid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(request.url);
        const parentId = url.searchParams.get('parentId');
        const childId = url.searchParams.get('childId');

        if (parentId && childId) {
            return NextResponse.json(
                { error: 'Only one of parentIdor childId must be provided.' }, { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('read-with-me');

        const query: Record<string, string> = {};
        if (parentId) query.parentId = parentId;
        if (childId) query.childId = childId;

        const stories = await db
            .collection('stories')
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();
        return NextResponse.json({ stories }, {status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error.' },
            { status: 500 }
        );
    }
};