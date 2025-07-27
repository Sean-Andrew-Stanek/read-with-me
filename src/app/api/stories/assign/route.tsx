/* eslint-disable no-console */

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { Story } from '@/lib/types/story';

export const POST = async (req: Request): Promise<NextResponse> => {
    try {
        //body
        const { storyId, childId } = await req.json();

        const session = await auth();
        const parentId = (session?.user as { uuid?: string })?.uuid;

        if (!session || !session.user || !parentId || !childId || !storyId) {
            return NextResponse.json(
                { error: "Unauthorized or missing required fields." }, { status: 401 }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        const originalStory = await db
            .collection('stories')
            .findOne({ id: storyId });

        if (!originalStory) {
            return NextResponse.json(
                { error: "Original story not found." }, { status: 404 }
            );
        }

        const newStory: Story = {
            id: uuidv4(),
            title: originalStory.title,
            content: originalStory.content,
            prompt: originalStory.prompt,
            createdAt: new Date().toISOString(),
            parentId: parentId || null,
            childId: childId || null,
            isParentAssigned: !!childId,
            scoresByParagraph: originalStory.scoresByParagraph || {},
        };

        await db.collection('stories').insertOne(newStory);
        return NextResponse.json({ message: "Story assigned to a child." }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
