/**
 * API Route: /api/assistant/generate-story
 *
 * This route uses the OpenAI Assistant API to generate a story based on the provided prompt.
 * The prompt is sent to the Assistant, which generates a response in the form of a story.
 * The story is then returned as a JSON response.
 *
 *
 * Example Request:
 *   curl -X POST \
 *     http://localhost:3000/api/assistant/generate-story \
 *     -H 'Content-Type: application/json' \
 *     -d '{"prompt": "A story about a cat"}'
 *
 * Example Response:
 *   {
 *     "story": [
 *       {
 *         "role": "assistant",
 *         "content": "Once upon a time there was a cat named Whiskers..."
 *       }
 *     ]
 *   }
 */

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const POST = async (req: Request): Promise<Response> => {
    try {
        const { prompt }: { prompt: string } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }
        console.log(' Starting OpenAI Thread for:', prompt);

        // Create a thread to store messages
        const thread = await openai.beta.threads.create();

        // Add user's message to the thread
        await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: prompt
        });
        await new Promise(resolve => setTimeout(resolve, 1000 / 10)); // 10 requests per second

        console.log(' Message added to thread:', thread.id);

        //Start the assistant in streaming mode
        const responseStream = await openai.beta.threads.runs.createAndStream(
            thread.id,
            {
                assistant_id: process.env.OPENAI_ASSISTANT_ID!,
                max_completion_tokens: 500
            }
        );

        console.log(' Streaming started...');

        // Stream response back to client
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(
                controller: ReadableStreamDefaultController
            ): Promise<void> {
                let receivedData = false; // Track if we receive any response

                for await (const event of responseStream) {
                    console.log(' Received event:', event);

                    // Only process events that contain text
                    if ('text' in event) {
                        receivedData = true;
                        controller.enqueue(encoder.encode(event.text + '\n'));
                    }
                }
                if (!receivedData) {
                    console.error(' No response received from OpenAI.');
                }
                controller.close();
            }
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain' }
        });
    } catch (error: unknown) {
        console.error(' Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

//Run the assistant on the thread and generate a response
//         const run = await openai.beta.threads.runs.create(thread.id, {
//             assistant_id: process.env.OPENAI_ASSISTANT_ID!,
//             max_completion_tokens: 1000
//             // stream: true
//         });

//         // Wait for the response
//         let response;
//         let attempts = 0;

//         while (attempts < 15) {
//             const runStatus = await openai.beta.threads.runs.retrieve(
//                 thread.id,
//                 run.id
//             );
//             if (runStatus.status === 'completed') {
//                 response = await openai.beta.threads.messages.list(thread.id);
//                 break;
//             }
//             attempts++;

//             await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before checking again
//         }

//         if (!response) {
//             console.error(' Assistant did not complete the response in time.');
//             return NextResponse.json(
//                 { error: 'Assistant is taking too long to respond.' },
//                 { status: 500 }
//             );
//         }

//         return NextResponse.json({ story: response.data }, { status: 200 });
//     } catch (error: any) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// };
