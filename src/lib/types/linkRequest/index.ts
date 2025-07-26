import { z } from 'zod';

export const LinkRequestSchema = z.object({
    token: z.string().optional(),
    childId: z.string(),
    parentId: z.string(),
    childName: z.string().optional(),
    createdAt: z.date().optional(),
    status: z.enum(['pending', 'approved', 'rejected'])
});

export const LinkStatusSchema = z.object({
    isWaitingApproval: z.boolean()
});

export type LinkStatus = z.infer<typeof LinkStatusSchema>;
export const LinkRequestArraySchema = z.array(LinkRequestSchema);
export type LinkRequest = z.infer<typeof LinkRequestSchema>;
export type LinkRequestArray = z.infer<typeof LinkRequestArraySchema>;
