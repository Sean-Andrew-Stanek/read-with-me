'use client';
import { useState, useEffect } from 'react';
import { fetchStories } from '@/lib/actions';
import { useSession } from 'next-auth/react';

type Story = {
    id: string;
    title: string;
    content: string;
    prompt: string;
    createdAt: string;
    parentId?: string | null;
    childId?: string | null;
};

type CreateStoryPageProps = {
    parentId?: string;
    childId?: string;
};

const MyStoriesPage: React.FC<CreateStoryPageProps> = () => {
    const { data: session } = useSession();
    console.log('Session Data:', session);

    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadStories = async () => {
            if (!session) return;

            const { parentId, childId } = session.user as {
                parentId?: string;
                childId?: string;
            };

            // Check if the user is a parent or child from session
            // const parentId = session?.user?.parentId;
            // const childId = session?.user?.childId;

            if (!parentId && !childId) {
                setError(
                    'No valid user ID found. Please make sure you are logged in properly.'
                );
                return;
            }

            try {
                setLoading(true);

                const fetchedStories = await fetchStories(
                    parentId || undefined,
                    childId || undefined
                );
                setStories(fetchedStories);
            } catch (error: any) {
                setError(error.message);
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
