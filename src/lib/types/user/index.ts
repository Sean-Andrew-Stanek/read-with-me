import { z } from 'zod';

const BaseUserSchema = z.object({
    googleId: z.string().email(),
    uuid: z.string().uuid(),
    isParent: z.boolean(),
    parentId: z.string().uuid().optional(),
    children: z.array(z.string().uuid()).optional()
});

export const ParentUserSchema = BaseUserSchema.extend({
    isParent: z.literal(true),
    children: z.array(z.string().uuid())
});

export const ChildUserSchema = BaseUserSchema.extend({
    isParent: z.literal(false),
    parentId: z.string().uuid()
});

export type User = z.infer<typeof BaseUserSchema>;
export type ParentUser = z.infer<typeof ParentUserSchema>;
export type ChildUser = z.infer<typeof ChildUserSchema>;
