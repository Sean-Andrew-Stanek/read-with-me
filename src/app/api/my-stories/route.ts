import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Get stories
export const GET = async (req: Request): Promise<Response> => {
    try {
        // Get parentId and childId from query params
        const url = new URL(req.url);
        const parentId = url.searchParams.get('parentId');
        const childId = url.searchParams.get('childId');

        if (!parentId && !childId) {
            return NextResponse.json(
                { error: 'Either parentId or childId must be provided' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('read-with-me');
        const storiesCollection = db.collection('stories');

        // Build query object to filter stories
        const query: Record<string, any> = {};
        if (parentId) query.parentId = parentId;
        if (childId) query.childId = childId;

        // Fetch stories from the database based on query
        const stories = await storiesCollection.find(query).toArray();
        if (!stories.length) {
            return NextResponse.json({ stories: [] }, { status: 200 });
        }

        // send stories back as JSON
        return NextResponse.json({ stories: stories || [] }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching stories:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
