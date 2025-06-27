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

const ProgressPage = async () => {
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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Progress Overview</h1>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-1">
                    Total Stories Read
                </h2>
                <Progress value={globalProgress} />
                <p className="text-sm text-muted-foreground mt-1">
                    {globalProgress}% of stories read
                </p>
            </section>

            <section className="space-y-6">
                {stories.map(story => {
                    const progress = getStoryProgress(story);
                    const avg = getAverageScore(story);

                    return (
                        <div key={story.id} className="p-4 border rounded-lg">
                            <h3 className="text-md font-semibold mb-1">
                                {story.title}
                            </h3>
                            <Progress value={progress} />
                            <p className="text-sm text-muted-foreground">
                                {progress}% read
                            </p>
                            {avg !== null && (
                                <p className="text-sm text-green-700">
                                    Avg Score: {avg}%
                                </p>
                            )}
                        </div>
                    );
                })}
            </section>
        </div>
    );
};

export default ProgressPage;
