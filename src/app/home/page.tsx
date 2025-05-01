'use client';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'; // npx shadcn add card
import Link from 'next/link';
import { BookOpen, Sparkles } from 'lucide-react';
import { Check } from 'lucide-react';
import { Info } from 'lucide-react';

const Dashboard: FC = () => {
    useEffect(() => {
        const toastType = localStorage.getItem('toast');
        localStorage.removeItem('toast');
        console.log('Toast flag:', toastType);

        setTimeout(() => {
            if (toastType === 'grade-saved') {
                toast.success('Grade level saved successfully!', {
                    icon: <Check className="h-5 w-5 text-green-500" />,
                    style: {
                        color: 'rgb(22 163 74)',
                        borderColor: 'rgb(134 239 172)'
                    }
                });
            } else if (toastType === 'grade-skipped') {
                toast.info(
                    'For better experience, please select your grade level!',
                    {
                        icon: <Info className="h-5 w-5 text-blue-500" />,
                        style: {
                            color: 'rgb(50 130 246)',
                            borderColor: 'rgb(101 219 254)'
                        }
                    }
                );
            } else if (toastType === 'google-signin') {
                toast.success('Signed in successfully!', {
                    icon: <Check className="h-5 w-5 text-green-500" />,
                    style: {
                        color: 'rgb(22 163 74)',
                        borderColor: 'rgb(134 239 172)'
                    }
                });
            }
        }, 600); // Delay to allow the toast to be displayed after the page load
    }, []);

    return (
        <div className=" flex flex-col gap-5 items-center py-10 px-4 mt-10">
            <h1 className="font-literata text-4xl font-semibold text-primary-500 text-center mb-8">
                Welcome to Reading Assistant!
            </h1>

            <div className=" flex flex-col gap-6 lg:w-[80%] xl:w-[60%]">
                <Card className="w-full bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-blue-500" />
                            Create a Story
                        </CardTitle>
                        <CardDescription>
                            Ask AI to create a story just for you
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>
                            Tell the AI what kind of story you want to read, and
                            it will create one just for you!
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href="/create-story">Create a Story</Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card className=" w-full bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-green-500" />
                            Read a Story
                        </CardTitle>
                        <CardDescription>
                            Practice your reading skills
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>
                            Read your stories out loud and get helpful feedback
                            to improve your reading!
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/my-stories">My Stories</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
