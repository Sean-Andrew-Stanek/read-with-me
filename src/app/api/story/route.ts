import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { StorySchema, Story } from '@/lib/types/story';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!
});

// Create a story
export const POST = async (req: Request): Promise<Response> => {
    try {
        const session = await auth();
        if (!session || !session.user?.uuid) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        const { prompt }: { prompt: string } = await req.json();

        if (!prompt || prompt.trim().length === 0) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                        "You are a children's storyteller. Create a short, engaging story for kids ages 6-10."
                },
                { role: 'user', content: prompt }
            ],
            max_tokens: 500,
            temperature: 0.7
        });

        const storyContent: string = response.choices[0].message?.content || '';

        if (!storyContent) {
            throw new Error('Failed to generate story');
        }

        const story: Story = {
            id: new ObjectId().toString(),
            title: prompt.slice(0, 20),
            content: storyContent,
            prompt,
            createdAt: new Date().toISOString(),
            parentId: session.user.isParent ? session.user.uuid : null,
            childId: session.user.isParent ? null : session.user.uuid
        };

        StorySchema.parse(story);

        // Save the story to MongoDB
        const client = await clientPromise;
        const db = client.db('read-with-me');
        const storiesCollection = db.collection('stories');

        const result = await storiesCollection.insertOne(story);

        return NextResponse.json(
            { story: storyContent, storyId: result.insertedId },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json(
                { error: 'Unknown error' },
                { status: 500 }
            );
        }
    }
};

// Get stories
export const GET = async (): Promise<Response> => {
    try {
        const session = await auth();
        if (!session || !session.user?.uuid) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const uuid = session.user.uuid;
        const isParent = session.user.isParent;

        const query = isParent ? { parentId: uuid } : { childId: uuid };

        const client = await clientPromise;
        const db = client.db('read-with-me');
        const stories = await db.collection('stories').find(query).toArray();

        return NextResponse.json({ stories }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
};
