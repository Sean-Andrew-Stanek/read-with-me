'use client';
import { useState, useEffect } from 'react';
import { fetchStories } from '@/lib/actions';
import { useSession } from 'next-auth/react';
import { Story } from '@/lib/types/story';

type CreateStoryPageProps = {
    parentId?: string;
    childId?: string;
};

const MyStoriesPage: React.FC<CreateStoryPageProps> = () => {
    const { data: session } = useSession();
    // console.log('Session Data:', session);

    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadStories = async (): Promise<void> => {
            if (!session || !session.user) {
                setError(
                    'You are not logged in. Please log in to view your stories.'
                );
                return;
            }
            const uuid = (session?.user as { uuid: string })?.uuid;
            const isParent = (session?.user as { isParent: boolean })?.isParent;

            if (!uuid) {
                setError(
                    'No valid user ID found. Please make sure you are logged in properly.'
                );
                return;
            }

            try {
                setLoading(true);

                // Send the appropriate ID to the backend
                const parentId = isParent ? uuid : undefined;
                const childId = !isParent ? uuid : undefined;
                // console.log('Fetching stories with:', { parentId, childId });

                const fetchedStories = await fetchStories(parentId, childId);
                setStories(fetchedStories);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        loadStories();
    }, [session]);

    if (!session) {
        return <p>Please log in to see your stories.</p>;
    }

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Generated Stories</h1>

            {loading && <p>Loading stories...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {stories.length === 0 && !loading && !error && (
                <p>No stories found.</p>
            )}

            {stories.map(story => (
                <div key={story.id} className="mb-4 p-4 border rounded">
                    <h2 className="text-xl font-semibold">{story.title}</h2>
                    <p>{story.content}</p>
                    <p className="text-sm text-gray-500">
                        Created At: {new Date(story.createdAt).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default MyStoriesPage;
