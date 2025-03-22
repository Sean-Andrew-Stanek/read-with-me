import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI();

export const POST = async (): Promise<NextResponse> => {
    try {
        const myAssistant = await openai.beta.assistants.create({
            instructions:
                "You are a children's storybook assistant. When given a prompt, generate a fun, imaginative, and age-appropriate story with a clear structure. The story should be engaging and positive for children aged 3-10. Only return the story text.",
            name: 'Story Creator',
            tools: [],
            model: 'gpt-3.5-turbo'
        });
        return NextResponse.json(
            { assistant_id: myAssistant.id },
            { status: 200 }
        );
    } catch (error: unknown) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
