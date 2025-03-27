import { z } from 'zod';

// Story Schema
export const StorySchema = z.object({
    id: z.string().or(z.string().uuid()),
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    prompt: z.string().min(1, 'Prompt is required'),
    createdAt: z.string().datetime(),
    parentId: z.string().uuid().optional().nullable(),
    childId: z.string().uuid().optional().nullable()
});

export type Story = z.infer<typeof StorySchema>;
