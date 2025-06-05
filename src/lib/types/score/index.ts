import { z } from 'zod';

export const scoreSchema = z.object({
    storyId: z.string().or(z.string().uuid()),
    expectedText: z.string().min(1, 'Expected text is required'),
    userTranscript: z.string().min(1, 'Transcript is required'),
    score: z.number().min(0).max(100),
    timestamp: z.string().datetime().optional()
});

export type Score = z.infer<typeof scoreSchema>;
