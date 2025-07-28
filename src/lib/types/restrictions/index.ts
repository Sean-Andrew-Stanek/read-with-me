import { z } from 'zod';

export const restrictionSchema = z.object({
    blacklistedWords: z.array(z.string().min(1)).optional(),
    restrictedGenres: z.array(z.string().min(1)).optional(),
    notes: z.string().optional()
});

export type Restriction = z.infer<typeof restrictionSchema>;
