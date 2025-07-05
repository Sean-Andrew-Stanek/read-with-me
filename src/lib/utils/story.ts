import { Story } from '@/lib/types/story';

// get the number of paragraphs in a story
export const getTotalParagraphs = (content: string): number =>
    content.trim().split(/\n{2,}/).length;

// How much of the story was read
export const getStoryProgress = (story: Story): number => {
    const total = getTotalParagraphs(story.content);
    const read = Object.keys(story.scoresByParagraph || {}).length;
    return total === 0 ? 0 : Math.round((read / total) * 100);
};

// Avg score of read paragraphs
export const getAverageScore = (story: Story): number | null => {
    const scores = Object.values(story.scoresByParagraph || {});
    if (!scores.length) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};

// percent total stories read
export const getGlobalProgress = (stories: Story[]): number => {
    if (stories.length === 0) return 0;

    const totalProgress = stories.reduce(
        (sum, story) => sum + getStoryProgress(story),
        0
    );

    return Math.round(totalProgress / stories.length);
};
