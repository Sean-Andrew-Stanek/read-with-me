import { z } from 'zod';

export const LinkRequestSchema = z.object({
    token: z.string(),
    childId: z.string(),
    parentId: z.string(),
    childName: z.string(),
    createdAt: z.date().optional(),
    status: z.enum(['pending', 'approved', 'rejected'])
});

export const LinkRequestArraySchema = z.array(LinkRequestSchema);
export type LinkRequest = z.infer<typeof LinkRequestSchema>;
export type LinkRequestArray = z.infer<typeof LinkRequestArraySchema>;
