import { z } from 'zod';

export const LinkRequestSchema = z.object({
    token: z.string(),
    childId: z.string(),
    parentId: z.string(),
    childName: z.string(),
    requestedAt: z.date(),
    status: z.enum(['pending', 'approved', 'rejected'])
});

export type LinkRequest = z.infer<typeof LinkRequestSchema>;
