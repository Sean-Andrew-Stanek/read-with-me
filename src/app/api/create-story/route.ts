import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!
});

export const POST = async (req: Request) => {
    try {
        const { prompt } = await req.json();

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

        const storyContent = response.choices[0].message?.content || '';

        if (!storyContent) {
            throw new Error('Failed to generate story');
        }

        return NextResponse.json({ story: storyContent }, { status: 200 });
    } catch (error: any) {
        console.error('Error generating story:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
