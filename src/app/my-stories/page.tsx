'use client';
import { useState, useEffect } from 'react';
import { getStories } from '@/services/apiServices';
import { useSession } from 'next-auth/react';
import { Story } from '@/lib/types/story';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { formatSentencesWithSpacing } from '@/lib/utils/formatters';

type CreateStoryPageProps = {
    parentId?: string;
    childId?: string;
};

const MyStoriesPage: React.FC<CreateStoryPageProps> = () => {
    const { data: session, status } = useSession();
    // console.log('Session Data:', session);
    const router = useRouter();

    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadStories = async (): Promise<void> => {
            if (status !== 'authenticated' || !session || !session.user) {
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
                setError(null); // Reset error state

                // Send the appropriate ID to the backend
                const parentId = isParent ? uuid : undefined;
                const childId = !isParent ? uuid : undefined;
                // console.log('Fetching stories with:', { parentId, childId });

                const fetchedStories = await getStories(parentId, childId);
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
    }, [session, status]);

    useEffect(() => {
        // Clean up any leftover overflow-hidden class to be able to scroll the page for child user
        document.body.classList.remove('overflow-hidden');
    }, []);

    if (!session) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-center text-xl text-red-500 font-bold">
                    Please log in to see your stories.
                </p>
            </div>
        );
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
                    <h2 className="text-xl font-semibold mb-2">
                        {story.title}
                    </h2>
                    {/* <div className='text-lg whitespace-pre-line'>
                            {formatSentencesWithSpacing(`${story.content}`)}
                     </div> */}
                    <div className="text-lg">
                        {story.content.split(/\n\n|\n/).map((para, idx) => (
                            <p key={idx} className="mb-4 leading-relaxed">
                                {para.trim()}
                            </p>
                        ))}
                    </div>

                    <p className="text-sm text-gray-500">
                        Created At: {new Date(story.createdAt).toLocaleString()}
                    </p>
                    <div className="col flex justify-end items-center">
                        <Button
                            className="mt-6 mr-6 hover:bg-gray-300 hover:text-black"
                            onClick={() =>
                                router.push(`/read-story/${story.id}`)
                            }
                        >
                            Read
                        </Button>
                        <Button className="mt-6 hover:bg-gray-300 hover:text-black">
                            Delete
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyStoriesPage;
