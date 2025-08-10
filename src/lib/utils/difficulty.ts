import type { Db } from 'mongodb';
import type { Story } from '@/lib/types/story';

export const difficultyLookback = 1; // last story
export const lowerThreshold = 60;
export const raiseThreshold = 80;

export const clamp = (n: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, n));

export const getRecentAvgScoreFromStories = async (
    db: Db,
    childUuid: string,
    lookbackStories: number = difficultyLookback
): Promise<number | null> => {
    const recent = await db
        .collection<Story>('stories')
        .find({ childId: childUuid })
        .sort({ createdAt: -1 })
        .limit(lookbackStories)
        .toArray();

    const scores: number[] = [];
    for (const s of recent) {
        const byPara = s?.scoresByParagraph ?? {};
        for (const key of Object.keys(byPara)) {
            const val = byPara[key as keyof typeof byPara];
            if (typeof val === 'number' && Number.isFinite(val))
                scores.push(val);
        }
    }

    if (scores.length === 0) return null;
    const avg: number = scores.reduce((a, b) => a + b, 0) / scores.length;
    return avg;
};

/**
 * Rule:
 * - avg < lowerThreshold → grade - 1
 * - avg ≥ raiseThreshold → grade + 1
 * - otherwise → unchanged
 */
export const adjustGradeFromAvgScore = (
    baseGrade: number,
    avgScore: number | null,
    minGrade: number = 1,
    maxGrade: number = 12
): number => {
    if (avgScore === null) return baseGrade;
    if (avgScore < lowerThreshold)
        return clamp(baseGrade - 1, minGrade, maxGrade);
    if (avgScore >= raiseThreshold)
        return clamp(baseGrade + 1, minGrade, maxGrade);
    return baseGrade;
};
