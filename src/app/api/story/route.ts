import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { StorySchema, Story } from '@/lib/types/story';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!
});

// // Create a story
// export const POST = async (req: Request): Promise<Response> => {
//     try {
//         const session = await auth();
//         if (!session || !session.user?.uuid) {
//             return NextResponse.json(
//                 { error: 'Unauthorized' },
//                 { status: 401 }
//             );
//         }
//         const { prompt }: { prompt: string } = await req.json();

//         if (!prompt || prompt.trim().length === 0) {
//             return NextResponse.json(
//                 { error: 'Prompt is required' },
//                 { status: 400 }
//             );
//         }

//         // get the grade from database
//         const client = await clientPromise;
//         const db = client.db('read-with-me');
//         const userCollection = session.user.isParent ? 'users' : 'childUsers';
//         const userData = await db
//             .collection(userCollection)
//             .findOne({ uuid: session.user.uuid });

//         const grade = userData?.grade ?? '6'; // fallback to 6th grade only if null or undefined
//         const gradeLevel = `${grade} grade reading level`;

//         const response = await openai.chat.completions.create({
//             model: 'gpt-3.5-turbo',
//             messages: [
//                 {
//                     role: 'system',
//                     content: `You are a children's storyteller. Create a short, engaging story for a ${gradeLevel}`
//                 },
//                 { role: 'user', content: prompt }
//             ],
//             max_tokens: 500,
//             temperature: 0.7
//         });

//         const storyContent: string = response.choices[0].message?.content || '';

//         /* eslint-disable no-console */
//         console.log('Backend received grade:', grade);
//         console.log('System message:', gradeLevel);
//         /* eslint-enable no-console */

//         if (!storyContent) {
//             throw new Error('Failed to generate story');
//         }

//         const story: Story = {
//             id: new ObjectId().toString(),
//             title: prompt.slice(0, 50),
//             content: storyContent,
//             prompt,
//             createdAt: new Date().toISOString(),
//             parentId: session.user.isParent ? session.user.uuid : null,
//             childId: session.user.isParent ? null : session.user.uuid,
//             scoresByParagraph: {}
//         };

//         StorySchema.parse(story);

//         // Save the story to MongoDB

//         const storiesCollection = db.collection('stories');

//         // const result = await storiesCollection.insertOne(story);

//         // return NextResponse.json(
//         //     { story: storyContent, storyId: result.insertedId },
//         //     { status: 200 }
//         await storiesCollection.insertOne(story);

//         return NextResponse.json({ story }, { status: 200 });
//     } catch (error) {
//         if (error instanceof Error) {
//             return NextResponse.json({ error: error.message }, { status: 500 });
//         } else {
//             return NextResponse.json(
//                 { error: 'Unknown error' },
//                 { status: 500 }
//             );
//         }
//     }
// };

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
        const { prompt, genre }: { prompt?: string; genre?: string } =
            await req.json();

        if (!prompt && !genre) {
            return NextResponse.json(
                { error: 'Either prompt or genre is required' },
                { status: 400 }
            );
        }

        // get the grade from database
        const client = await clientPromise;
        const db = client.db('read-with-me');
        const userCollection = session.user.isParent ? 'users' : 'childUsers';
        const userData = await db
            .collection(userCollection)
            .findOne({ uuid: session.user.uuid });

        const grade = userData?.grade ?? '6'; // fallback to 6th grade only if null or undefined
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

        const character =
            characters[Math.floor(Math.random() * characters.length)];
        const setting = settings[Math.floor(Math.random() * settings.length)];
        const plot = plots[Math.floor(Math.random() * plots.length)];

        //         const generatedPrompt = `Write a unique, fun, and age-appropriate ${genre} story for a ${gradeLevel}.
        // The main character is ${character} who ${plot} in ${setting}. Make it imaginative and inspiring.`;

        const generatedPrompt =
            typeof prompt === 'string' && prompt.trim().length > 0
                ? prompt
                : `Write a unique, fun, and age-appropriate ${genre} story for a ${gradeLevel}. 
The main character is ${character} who ${plot} in ${setting}. Make it imaginative and inspiring.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are a children's storyteller. Create a short, engaging story for a ${gradeLevel}`
                },
                { role: 'user', content: generatedPrompt }
            ],
            max_tokens: 500,
            temperature: 0.85
        });

        const storyContent: string = response.choices[0].message?.content || '';

        /* eslint-disable no-console */
        console.log('Backend received grade:', grade);
        console.log('System message:', gradeLevel);
        /* eslint-enable no-console */

        if (!storyContent) {
            throw new Error('Failed to generate story');
        }

        const story: Story = {
            id: new ObjectId().toString(),
            // title: prompt.slice(0, 50),
            title: `${genre} - ${character}`.slice(0, 50),

            content: storyContent,
            prompt: generatedPrompt,
            createdAt: new Date().toISOString(),
            parentId: session.user.isParent ? session.user.uuid : null,
            childId: session.user.isParent ? null : session.user.uuid,
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
