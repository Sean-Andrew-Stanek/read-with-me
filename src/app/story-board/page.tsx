'use client';
import { useState, useEffect } from 'react';
import { getStories } from '@/services/apiServices';
import { useSession } from 'next-auth/react';
import { Story } from '@/lib/types/story';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
    convertToTitleCase,
    formatSentencesWithSpacing
} from '@/lib/utils/formatters';

type CreateStoryPageProps = {
    parentId?: string;
    childId?: string;
};

const StoryBoard: React.FC<CreateStoryPageProps> = () => {
    const { data: session, status } = useSession();
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
                setError(null);

                const parentId = isParent ? uuid : undefined;
                const childId = !isParent ? uuid : undefined;

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

    const truncateContent = (content: string, wordLimit: number) => {
        const words = content.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return content;
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 max-w-5xl">
            <h1 className="text-2xl font-bold mb-8 text-center">
                Generated Stories
            </h1>

            {loading && <p className="text-center">Loading stories...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {stories.length === 0 && !loading && !error && (
                <p className="text-center">No stories found.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map(story => (
                    <div
                        key={story.id}
                        className="mb-5 p-6 border rounded-lg shadow-md flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                                {convertToTitleCase(`${story.title}`)}
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                {new Date(story.createdAt).toLocaleDateString()}
                            </p>
                            <div className="text-base text-gray-800 mb-4">
                                {formatSentencesWithSpacing(
                                    truncateContent(story.content, 50)
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end items-center mt-auto">
                            <Button
                                className="mr-4 hover:bg-gray-300 hover:text-black"
                                onClick={() =>
                                    router.push(`/read-story/${story.id}`)
                                }
                            >
                                Read
                            </Button>
                            <Button className="hover:bg-red-700 hover:text-white bg-red-500">
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoryBoard;
