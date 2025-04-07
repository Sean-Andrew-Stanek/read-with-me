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

const Dashboard: FC = () => (
    <div className=" flex flex-col justify-center items-center py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
            Welcome to Reading Assistant!
        </h1>

        <div className=" flex flex-col gap-6 lg:w-[80%] xl:w-[60%]">
            <Card className="w-full bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        👶 Create Child Profile
                    </CardTitle>
                    <CardDescription>
                        Set up a login code (UUID) and password for your child.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>
                        Your child will be able to log in using the code you
                        create here.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/create-child">Create Child Account</Link>
                    </Button>
                </CardFooter>
            </Card>

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
                        Tell the AI what kind of story you want to read, and it
                        will create one just for you!
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
                        Read your stories out loud and get helpful feedback to
                        improve your reading!
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

export default Dashboard;
