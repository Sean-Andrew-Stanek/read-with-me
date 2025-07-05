import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import { Story, StorySchema } from '@/lib/types/story';
import {
    getStoryProgress,
    getAverageScore,
    getGlobalProgress
} from '@/lib/utils/story';
import { Progress } from '@/components/ui/progress';
import { redirect } from 'next/navigation';
import { BookOpen, BarChart } from 'lucide-react';

const ProgressPage: React.FC = async () => {
    const session = await auth();
    if (!session || !session.user?.uuid) {
        redirect('/login');
    }

    const client = await clientPromise;
    const db = client.db('read-with-me');
    const query = session.user.isParent
        ? { parentId: session.user.uuid }
        : { childId: session.user.uuid };

    const rawStories = await db.collection('stories').find(query).toArray();

    const stories: Story[] = rawStories
        .map(s => {
            try {
                return StorySchema.parse(s);
            } catch {
                return null;
            }
        })
        .filter(Boolean) as Story[];

    const globalProgress = getGlobalProgress(stories);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">
                📚 Progress Overview
            </h1>

            <section className="mb-10 bg-muted p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-3 mb-2">
                    <BarChart className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">
                        Total Stories Read
                    </h2>
                </div>
                <Progress value={globalProgress} className="h-4 rounded-full" />
                <p className="text-sm text-muted-foreground mt-2">
                    {globalProgress}% of stories completed
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Story Details
                </h2>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {stories.map(story => {
                        const progress = getStoryProgress(story);
                        const avg = getAverageScore(story);

                        return (
                            <div
                                key={story.id}
                                className="p-5 border rounded-2xl shadow-sm hover:shadow-md transition"
                            >
                                <h3 className="text-lg font-bold mb-2">
                                    {story.title}
                                </h3>

                                <Progress
                                    value={progress}
                                    className="h-3 rounded-full"
                                />
                                <p className="text-sm text-muted-foreground mt-1 mb-2">
                                    {progress}% read
                                </p>

                                {avg !== null && (
                                    <p className="text-sm font-medium text-emerald-600">
                                        Avg Score: {avg}%
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default ProgressPage;
