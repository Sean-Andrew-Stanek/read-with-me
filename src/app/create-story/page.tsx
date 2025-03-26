'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { createStory } from '@/lib/actions';

export default function CreateStoryPage() {
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [storyContent, setStoryContent] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        setStoryContent('');
        try {
            const storyContent = await createStory(prompt);
            console.log('Generated Story:', storyContent);

            setStoryContent(storyContent);
            setPrompt('');
            setIsLoading(false);
        } catch (error) {
            console.error('Error creating story:', error);
            setIsLoading(false);
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
                            disabled={isLoading || !prompt.trim()}
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
}
