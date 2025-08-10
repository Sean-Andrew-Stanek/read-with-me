import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
// import OpenAI from 'openai';
import { StorySchema, Story } from '@/lib/types/story';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';
import { ChildUser, User } from '@/lib/types/user';
import { restrictionSchema, Restriction } from '@/lib/types/restrictions';
import { getNumericGrade } from '@/lib/utils/grade';

import {
    getRecentAvgScoreFromStories,
    adjustGradeFromAvgScore
} from '@/lib/utils/difficulty';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!
});

//Create a story
export const POST = async (request: NextRequest): Promise<NextResponse> => {
    try {
        const session = await auth();
        if (!session || !session.user?.uuid) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        const {
            prompt,
            genre,
            parentId: requestParentId,
            childId: requestChildId
        }: {
            prompt?: string;
            genre?: string;
            parentId?: string;
            childId?: string;
        } = await request.json();

        if (!prompt && !genre) {
            return NextResponse.json(
                { error: 'Either prompt or genre is required' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('read-with-me');

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

        // type OptionalGrade = { grade?: unknown };

        // /**
        //  * Converts a user's grade (from DB) to a valid number.
        //  * Defaults to 6 if missing or invalid.
        //  */
        // const getNumericGrade = (
        //     userRecord: User | ChildUser | null
        // ): number => {
        //     if (!userRecord) return 6;

        //     const gradeValue = (userRecord as OptionalGrade).grade;

        //     if (typeof gradeValue === 'number' && Number.isFinite(gradeValue)) {
        //         return gradeValue;
        //     }

        //     if (typeof gradeValue === 'string') {
        //         const parsedGrade = Number.parseInt(gradeValue, 10);
        //         if (Number.isFinite(parsedGrade)) {
        //             return parsedGrade;
        //         }
        //     }

        //     return 6;
        // };

        //  Determine base grade
        const baseGradeFromDB = getNumericGrade(userData);
        let adjustedGrade = baseGradeFromDB;

        /* eslint-disable no-console */
        const debugLast = await db
            .collection('stories')
            .find({ childId: session.user.uuid })
            .project({
                id: 1,
                scoresByParagraph: 1,
                updatedAt: 1,
                createdAt: 1
            })
            .sort({ updatedAt: -1, createdAt: -1 })
            .limit(3)
            .toArray();

        console.log('DEBUG last stories:', JSON.stringify(debugLast, null, 2));
        /* eslint-enable no-console */

        // If child, adjust based on recent average score
        if (!session.user.isParent) {
            const recentAverageScore = await getRecentAvgScoreFromStories(
                db,
                session.user.uuid,
                1
            );

            // console.log('Recent average score:', recentAverageScore);

            adjustedGrade = adjustGradeFromAvgScore(
                baseGradeFromDB,
                recentAverageScore,
                1,
                12
            );

            // Save adjusted grade to DB
            const collectionName = session.user.isParent
                ? 'users'
                : 'childUsers';
            await db
                .collection(collectionName)
                .updateOne(
                    { uuid: session.user.uuid },
                    { $set: { difficultyGrade: adjustedGrade } }
                );

            // console.log('Persisted adjusted grade:', adjustedGrade);
        }

        // Step 3: Build a string for AI prompt
        const gradeLevel = `${adjustedGrade}th grade`;

        // console.log('Auto-adjust grade:', {
        //     baseGradeFromDB,
        //     adjustedGrade
        // });
        // console.log('grade Level', gradeLevel);

        // apply restriction if exists for the child creating the story
        let restrictions: Restriction | null = null;

        if (!session.user.isParent) {
            // query the restriction collection where child id matches the logged in childs
            const raw = await db
                .collection('restrictions')
                .findOne({ childUuid: session.user.uuid });

            // validate the data to match schema
            if (raw) {
                const parsed = restrictionSchema.safeParse(raw);
                if (parsed.success) {
                    restrictions = parsed.data;
                } else {
                    return NextResponse.json(
                        {
                            error: 'Invalid restriction data',
                            details: parsed.error.flatten()
                        },
                        { status: 400 }
                    );
                }
            }
        }

        // const grade = userData?.grade ?? '6';
        // const gradeLevel = `${grade} grade reading level`;

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
            'Include a surprising plot twist.',
            'Introduce an unexpected sidekick.',
            'End the story with a powerful lesson.',
            'Add a magical object that changes everything.',
            'Include a challenge the character must solve using cleverness.',
            'Describe the setting using vivid sensory details.',
            'Add humor and playful language.',
            'Make the story unfold in reverse.',
            'Make the main character face a tough moral decision.'
        ];
        const character =
            characters[Math.floor(Math.random() * characters.length)];
        const setting = settings[Math.floor(Math.random() * settings.length)];
        const plot = plots[Math.floor(Math.random() * plots.length)];
        const length_in_minutes = 2;
        const selectedSalts = salts
            .sort(() => 0.5 - Math.random())
            .slice(0, 2)
            .join(' ');

        const getRandomLetter = (): string => {
            const letters = 'abcdefghijklmnopqrstuvwxyz';
            const index = Math.floor(Math.random() * letters.length);
            return letters[index];
        };

        const restrictionNote = `
Please strictly avoid using the following in the story:
${restrictions?.blacklistedWords?.length ? `- Prohibited words: ${restrictions.blacklistedWords.join(', ')}` : ''}
${restrictions?.restrictedGenres?.length ? `- Forbidden genres: ${restrictions.restrictedGenres.join(', ')}` : ''}
`.trim();

        if (
            !session.user.isParent &&
            prompt &&
            restrictions?.restrictedGenres?.some(rg =>
                prompt.toLowerCase().includes(rg.toLowerCase())
            )
        ) {
            return NextResponse.json(
                { error: `Your prompt contains a restricted genre.` },
                { status: 403 }
            );
        }

        if (
            !session.user.isParent &&
            prompt &&
            restrictions?.blacklistedWords?.some(word =>
                prompt.toLowerCase().includes(word.toLowerCase())
            )
        ) {
            return NextResponse.json(
                { error: `Your prompt contains restricted words.` },
                { status: 403 }
            );
        }

        const getRandomNumber = (): number => {
            return Math.floor(Math.random() * (8 - 4 + 1)) + 4;
        };

        const generatedPrompt =
            `This is from an app that generates stories for children. ` +
            `Please use their prompt heavily.  Here is their prompt: ${prompt}` +
            `The parent has requested the following restrictions: ${restrictionNote}` +
            `Please return a story that would take a ${gradeLevel} reader ${length_in_minutes} minutes to read. ` +
            `Use the following genre: ${genre}. Setting: ${setting}. Plot: ${plot} Main character's name should start with ${getRandomLetter()} and be ${getRandomNumber()} letters long` +
            `We are adding the following additions: ${selectedSalts}`;

        // eslint-disable-next-line no-console
        console.log('Generated prompt:', generatedPrompt);

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

        // /* eslint-disable no-console */
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
            childId: storyChildId, // Use the determined childId
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

        let query: {
            parentId?:
                | string
                | { $in?: (string | null | undefined)[]; $exists?: boolean };
            childId?:
                | string
                | { $in?: (string | null | undefined)[]; $exists?: boolean };
            createdBy?: 'parent' | 'child';
        };

        if (isParent) {
            query = {
                parentId: uuid,
                createdBy: 'parent',
                childId: { $in: [null, undefined] }
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
