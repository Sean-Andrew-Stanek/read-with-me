'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';
import { createStory, fetchUserData } from '@/lib/actions';
import { useSession } from 'next-auth/react';

type CreateStoryPageProps = object;

const CreateStoryPage: React.FC<CreateStoryPageProps> = () => {
    const { data: session } = useSession();

    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [storyContent, setStoryContent] = useState<string>('');
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!session) {
                console.log('No session found.');
                return;
            }

            console.log('Session Object:', session);
            const uuid = (session?.user as any)?.uuid;

            if (!uuid) {
                console.log('No user ID found in session.');
                return;
            }

            try {
                const userData = await fetchUserData(uuid);
                console.log('User Data Retrieved From Backend:', userData);

                if (!userData) {
                    console.log('No user data found from backend.');
                    return;
                }

                setUserData(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, [session]);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!prompt.trim()) return;

        if (!userData) {
            console.error('User data is not yet loaded. Please try again.');
            alert('User data is not yet loaded. Please try again.');
            return;
        }
        console.log('User Data Retrieved Before Submission:', userData); // Add this log

        setIsLoading(true);
        setStoryContent('');

        try {
            // If the user is a parent, use their `uuid` as the `parentId`
            // const parentId = userData?.isParent ? userData?.uuid : null;

            // If the user is a child, use their `uuid` as `childId` and parent's `uuid` as `parentId`
            // const childId = !userData?.isParent ? userData?.uuid : null;

            const parentId = userData?.parentId || null; // Fetch parentId if it exists
            const childId =
                userData?.children?.length > 0 ? userData.uuid : null; // If the user has children, they are a parent
            console.log('Sending to backend in handlesubmit:', {
                parentId,
                childId,
                prompt,
                userData
            });
            const storyContent: string = await createStory(
                prompt,
                parentId,
                childId
            );
            setStoryContent(storyContent);
            setPrompt('');
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error creating story:', error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Create a Story
                    </CardTitle>
                    <CardDescription>
                        Tell the AI what kind of story you want to read
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="prompt">
                                    What kind of story would you like?
                                </Label>
                                <Textarea
                                    id="prompt"
                                    placeholder="For example: A story about a brave dragon who is afraid of heights"
                                    className="min-h-32"
                                    value={prompt}
                                    onChange={e => setPrompt(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <p>Some ideas to try:</p>
                                <ul className="list-disc pl-5 space-y-1 mt-2">
                                    <li>
                                        A story about a magical forest with
                                        talking animals
                                    </li>
                                    <li>
                                        An adventure with pirates searching for
                                        treasure
                                    </li>
                                    <li>
                                        A tale about a child who discovers they
                                        have superpowers
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="py-4">
                        <Button
                            type="submit"
                            className="w-full"
                            // disabled={isLoading || !prompt.trim()}
                            disabled={isLoading || !prompt.trim() || !userData}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating your story...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Create My Story
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            {storyContent && (
                <div className="mt-6 p-4 border border-gray-300 rounded w-full max-w-2xl bg-white">
                    <h2 className="text-xl font-bold mb-2">Generated Story:</h2>
                    <p>{storyContent}</p>
                </div>
            )}
        </div>
    );
};

export default CreateStoryPage;
