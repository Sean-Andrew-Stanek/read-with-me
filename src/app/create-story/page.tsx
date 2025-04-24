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
import { postNewStory, getUserData } from '@/services/apiServices';
import { useSession } from 'next-auth/react';
import { ParentUser, ChildUser } from '@/lib/types/user';

type CreateStoryPageProps = object;

type UserData = (ParentUser | ChildUser) & { grade?: string | number | null };

const CreateStoryPage: React.FC<CreateStoryPageProps> = () => {
    const { data: session } = useSession();

    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [storyContent, setStoryContent] = useState<string>('');
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const fetchUser = async (): Promise<void> => {
            if (!session || !session.user) {
                // throw new Error('User not logged in.');
                return;
            }

            // const uuid = (session?.user as { uuid: string })?.uuid;

            // if (!uuid) {
            //     return;
            // }

            try {
                const userData = await getUserData();

                if (!userData) {
                    return;
                }

                setUserData(userData);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw new Error(
                        `Error fetching user data: ${error.message}`
                    );
                }
            }
        };

        fetchUser();
    }, [session]);

    useEffect(() => {
        // Clean up any leftover overflow-hidden class to be able to scroll the page for child user
        document.body.classList.remove('overflow-hidden');
    }, []);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!prompt.trim()) return;

        if (!userData) {
            alert('User data is not yet loaded. Please try again.');
            return;
        }

        // warn user if grade is not picked
        if (!userData.grade) {
            const proceed = confirm(
                'You have not selected a grade. The story will be written for a 6th grade level. Do you want to proceed?'
            );
            if (!proceed) {
                window.location.reload();
                return;
            }
        }

        setIsLoading(true);
        setStoryContent('');

        try {
            // const parentId = userData.isParent
            //     ? userData.uuid
            //     : userData.parentId;
            // const childId = userData.isParent ? null : userData.uuid;
            const grade = userData.grade || '6';

            const storyContent: string = await postNewStory(
                prompt,
                // parentId,
                // childId as string | null,
                grade
            );

            setStoryContent(storyContent);
            setPrompt('');
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error creating story: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // if (!session || !session.user) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center text-center">
    //             <p className="text-xl font-bold text-red-500">
    //                 You must be logged in to create a story.
    //             </p>
    //         </div>
    //     );
    // }

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
