import { z } from 'zod';

// Story Schema
export const StorySchema = z.object({
    id: z.string().or(z.string().uuid()),
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    prompt: z.string().min(1, 'Prompt is required'),
    createdAt: z.string().datetime(),
    parentId: z.string().or(z.string().uuid()).optional().nullable(), // Accepts both ObjectId and UUID
    childId: z.string().or(z.string().uuid()).optional().nullable(),
    scoresByParagraph: z.record(z.string(), z.number()).optional()
});

export type Story = z.infer<typeof StorySchema>;
