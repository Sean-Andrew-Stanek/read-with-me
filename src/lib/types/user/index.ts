import { z } from 'zod';

const BaseUserSchema = z.object({
    googleId: z.string().email(),
    uuid: z.string().uuid(),
    isParent: z.boolean(),
    parentId: z.string().or(z.string().uuid()).optional(),
    children: z.array(z.string().or(z.string().uuid())).optional(),
    grade: z.string().or(z.number()).optional().nullable() // step 1-branch
});

export const ParentUserSchema = BaseUserSchema.omit({ parentId: true }).extend({
    isParent: z.literal(true),
    children: z.array(z.string().uuid())
});

export const ChildUserSchema = BaseUserSchema.omit({ children: true }).extend({
    isParent: z.literal(false),
    parentId: z.string().uuid()
});

export type User = z.infer<typeof BaseUserSchema>;
export type ParentUser = z.infer<typeof ParentUserSchema>;
export type ChildUser = z.infer<typeof ChildUserSchema>;
