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
import Link from 'next/link';
import { PlusIcon, CheckIcon } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { deleteStory } from '@/services/apiServices';
import { toast } from 'sonner';

type SessionUser = {
    uuid: string;
    isParent: boolean;
}

const StoryBoard: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const currentUserIsParent = session?.user?.isParent ?? false;

    useEffect(() => {
        const loadStories = async (): Promise<void> => {
            if (status !== 'authenticated' || !session || !session.user) {
                setError(
                    'You are not logged in. Please log in to view your stories.'
                );
                return;
            }
            const user = session.user as SessionUser;
            const uuid = user?.uuid;
            const isParent = user?.isParent;

            if (!uuid) {
                setError(
                    "No valid user ID found. Please make sure you are logged in properly."
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

    const truncateContent = (content: string, wordLimit: number): string => {
        const words = content.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return content;
    };

    const handleDelete = async (storyId: string): Promise<void> => {
        const confirmed = window.confirm('Are you sure you want to delete the story?');
        if (!confirmed) return;

        try {
            await deleteStory(storyId);
            toast.warning('Story deleted successfully.');
        } catch {
            toast.warning('Failed to delete story.');
        } finally {
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 max-w-5xl">
            <h1 className="text-2xl font-bold mb-8 text-center">
                Generated Stories
            </h1>
            {loading && <LoadingSpinner />}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {stories.length === 0 && !loading && !error && (
                <>
                    <p className="text-center mb-8">No stories found. Create a story.</p>
                    <div className="mb-5 p-6 bg-transparent border rounded-lg shadow-none flex items-center justify-center transition">
                        <Link href="/create-story">
                            <Button
                                variant="ghost"
                                title="Create a Story"
                                size="icon"
                                className="h-20 w-20 rounded-xl bg-white/30 hover:bg-white/40 backdrop-blur-md 
                     border border-white/30 shadow-lg flex items-center justify-center cursor-pointer"
                            >
                                <PlusIcon className="size-18 text-white" />
                            </Button>
                        </Link>
                    </div>
                </>
            )}
            {stories.length >= 1 && !loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map(story => (
                        <div
                            key={story.id}
                            className="mb-5 p-6 bg-white border rounded-lg shadow-md flex flex-col justify-between"
                        >
                            <div >
                                <div className="flex flex-col justify-center">
                                    {!currentUserIsParent && story.createdBy === 'parent' && (
                                        <span className="
                                            bg-violet-400
                                            text-white
                                            text-center
                                            py-1 px-2
                                            rounded
                                            text-sm
                                            whitespace-nowrap
                                            mb-4
                                        "
                                        >
                                            Assigned by Parent
                                            {story.scoresByParagraph && Object.keys(story.scoresByParagraph).length > 0 && (
                                                <CheckIcon className="h-4 w-4 ml-1 text-green-700" />
                                            )}
                                        </span>
                                    )}
                                    <h2 className="text-xl font-semibold line-clamp-2 pr-2">
                                        {convertToTitleCase(`${story.title}`)}
                                    </h2>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    {new Date(story.createdAt).toLocaleDateString()}
                                </p>
                                <div className="text-base text-gray-800 mb-4">
                                    {formatSentencesWithSpacing(
                                        truncateContent(story.content, 50)
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-center items-center mt-auto">
                                <Button
                                    className="mr-4 bg-violet-400 hover:bg-gray-200 hover:text-violet-500 hover:border hover:border-violet-500 cursor-pointer"
                                    onClick={() =>
                                        router.push(`/read-story/${story.id}`)
                                    }
                                >
                                    Read
                                </Button>
                                <Button
                                    onClick={() => handleDelete(story.id)}
                                    className="bg-violet-400 hover:bg-gray-200 hover:text-violet-500 hover:border hover:border-violet-500 cursor-pointer"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                    <div className="mb-5 p-6 bg-transparent border rounded-lg shadow-none flex items-center justify-center transition">
                        <Link href="/create-story">
                            <Button
                                variant="ghost"
                                title="Create a Story"
                                size="icon"
                                className="h-20 w-20 rounded-xl bg-white/30 hover:bg-white/40 backdrop-blur-md 
                     border border-white/30 shadow-lg flex items-center justify-center cursor-pointer"
                            >
                                <PlusIcon className="size-18 text-white" />
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>

    );
};

export default StoryBoard;
