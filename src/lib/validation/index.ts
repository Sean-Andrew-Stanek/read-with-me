import { z } from 'zod';

export const signupSchema = z.object({
    userName: z.string().min(1, 'Username is required'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
            /[!@#$%^&*(),.?";:{}|<>]/,
            'Password must contain at least one special character'
        )
});

export type signupInput = z.infer<typeof signupSchema>;
