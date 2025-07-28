import { z } from 'zod';

export const restrictionSchema = z.object({
    blackListedWords: z.array(z.string().min(1)).optional(),
    restrictedGenres: z.array(z.string().min(1)).optional(),
    notes: z.string().optional()
});

export type restrictionData = z.infer<typeof restrictionSchema>;
