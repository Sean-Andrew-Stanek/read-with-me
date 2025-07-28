import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
// import OpenAI from 'openai';
import { StorySchema, Story } from '@/lib/types/story';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';
import { ChildUser, User } from '@/lib/types/user';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!
});

//Create a story
export const POST = async (request: NextRequest): Promise<NextResponse> => {
    try {
        const session = await auth();
        if (!session || !session.user?.uuid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { prompt, genre,  parentId: requestParentId, childId: requestChildId    
        }: {
            prompt?: string;
            genre?: string;
            parentId?: string;
            childId?: string;
        } = await request.json(); // Use request.json()

        if (!prompt && !genre) {
            return NextResponse.json({ error: 'Either prompt or genre is required' }, { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('read-with-me')

        // get the grade from database
        let userData: User | ChildUser | null;
        if (session.user.isParent) {
            userData = await db
                .collection<User>('users') 
                .findOne({ uuid: session.user.uuid });
        } else {
            userData = await db
                .collection<ChildUser>('childUsers') 
                .findOne({ uuid: session.user.uuid });
        }

        const grade = userData?.grade ?? '6';
        const gradeLevel = `${grade} grade reading level`;


        // Generate randomized story idea based on genre
        const characters = [
            'a brave fox',
            'a curious girl',
            'a friendly robot'
        ];
        const settings = ['a magical forest', 'outer space', 'a deep ocean'];
        const plots = [
            'solves a mystery',
            'finds a treasure',
            'rescues a lost friend'
        ];

        const salts = [
            "Include a surprising plot twist.",
            "Introduce an unexpected sidekick.",
            "End the story with a powerful lesson.",
            "Add a magical object that changes everything.",
            "Include a challenge the character must solve using cleverness.",
            "Describe the setting using vivid sensory details.",
            "Add humor and playful language.",
            "Make the story unfold in reverse.",
            "Make the main character face a tough moral decision."
        ];
        const character = characters[Math.floor(Math.random() * characters.length)];
        const setting = settings[Math.floor(Math.random() * settings.length)];
        const plot = plots[Math.floor(Math.random() * plots.length)];
        const selectedSalts = salts
            .sort(() => 0.5 - Math.random())
            .slice(0, 2)
            .join(" ");
        
        const generatedPrompt =
            typeof prompt === 'string' && prompt.trim().length > 0
                ? `${prompt} ${selectedSalts}`
                : `Write a unique, fun, and age-appropriate ${genre} story for a ${gradeLevel}.
The main character is ${character} who ${plot} in ${setting}. Make it imaginative and inspiring. ${selectedSalts}`;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: generatedPrompt
                        }
                    ]
                }
            ]
        });

        const storyContent =
            response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

        /* eslint-disable no-console */
        // console.log('Backend received grade:', grade);
        // console.log('System message:', gradeLevel);

        // console.log('Backend received grade:', grade);
        // console.log('System message:', gradeLevel);
        // console.log('Backend received requestParentId:', requestParentId);
        // console.log('Backend received requestChildId:', requestChildId);

        if (!storyContent) {
            throw new Error('Failed to generate story');
        }

        let storyParentId: string | null = null;
        let storyChildId: string | null = null;
        let createdBy: 'parent' | 'child';        

        if (session.user.isParent) {
            // Parent user creating a story
            storyParentId = requestParentId || session.user.uuid;
            storyChildId = requestChildId || null; // Will be the selected child's UUID
            createdBy = 'parent';
            
            
        } else {
            // Child user creating their own story
            storyChildId = session.user.uuid; // Child's own UUID
            if (userData) {
                // Get parentId from the fetched ChildUser data
                storyParentId = (userData as ChildUser).parentId ?? null;
            } else {
                // Fallback if userData was unexpectedly null
                storyParentId = null;
            }
            createdBy = 'child';
        }

        const story: Story = {
            id: new ObjectId().toString(),
            title:
                typeof prompt === 'string' && prompt.trim().length > 0
                    ? prompt.slice(0, 50)
                    : `${genre ?? 'Story'} - ${character}`.slice(0, 50),
            content: storyContent,
            prompt: generatedPrompt,
            createdBy: createdBy,
            createdAt: new Date().toISOString(),
            parentId: storyParentId, // Use the determined parentId
            childId: storyChildId,   // Use the determined childId
            scoresByParagraph: {}
        };

        StorySchema.parse(story);

        // Save the story to MongoDB
        const storiesCollection = db.collection('stories');

        await storiesCollection.insertOne(story);

        return NextResponse.json({ story }, { status: 200 });
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

        let query: { parentId?: string; childId?: string; createdBy?: 'parent' | 'child'; };

        if (isParent) {
            query = {
                parentId: uuid,
                createdBy: 'parent',
            };
            //  console.log('GET /api/story: Query being executed:', query);
        } else {
            query = { childId: uuid };
            // console.log('GET /api/story: Query being executed (child):', query);
        }

        

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