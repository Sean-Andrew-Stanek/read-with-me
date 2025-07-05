import { z } from 'zod';

export const LinkTokenSchema = z.object({
    token: z.string().length(6, 'Token must be 6 characters'),
    parentId: z.string().uuid(),
    isUsed: z.boolean(),
    createdAt: z.date(),
    expiresAt: z
        .date()
        .refine(date => date > new Date(), {
            message: 'Expiration must be in the future'
        })
});

export type LinkToken = z.infer<typeof LinkTokenSchema>;
