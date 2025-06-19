'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { CircleArrowDown, CircleArrowUp, Flame, MoveRight, Sparkles } from 'lucide-react';
import { Check } from 'lucide-react';
import { Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getRandomStoryId } from '@/services/apiServices';
import LoadingSpinner from '@/components/LoadingSpinner';

const Dashboard: FC = () => {
    const [readOpen, setReadOpen] = useState(false);
    useEffect(() => {
        const toastType = localStorage.getItem('toast');
        localStorage.removeItem('toast');

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

    const [randomStoryId, setRandomStoryId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRandomId = async (): Promise<void> => {
            try {
                const id = await getRandomStoryId();
                setRandomStoryId(id);
            } catch {
                toast.error(
                    'You have not created any story yet. Try creating one!'
                );
            } finally {
                setLoading(false);
            }
        };
        fetchRandomId();
    }, []);

    if (loading) return <LoadingSpinner />

    return (
        <div className="relative flex flex-col gap-5 items-center mt-10 min-h-screen max-w-screen-2xl mx-auto overflow-x-hidden w-[85%]">

            {readOpen && (
                // Fullscreen Panel Overlay
                <div className="absolute inset-0 z-50 bg-indigo-300 text-white rounded-[2rem] p-6 sm:p-10 shadow-xl h-[60%]">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl sm:text-4xl font-light flex items-center gap-3">
                            <Sparkles className="w-8 h-8 fill-white" />
                            Read a Story
                        </h2>
                        <Button
                            variant="ghost"
                            onClick={() => setReadOpen(false)}
                            className="p-0 bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                            <CircleArrowUp className="size-12 hover:size-14 stroke-white bg-transparent" />
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                        <div className="bg-white text-gray-800 rounded-xl p-6 text-center shadow-md flex-1 max-w-xl">
                            <p className="text-base sm:text-lg leading-relaxed mb-4">
                                Challenge and monitor your reading skills with our innovative reading interface.
                                Match your interests with your favorite literary genres - we&#39;ll do the rest!
                            </p>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-lg flex items-center">
                                I&#39;m ready! <MoveRight className="ml-2" />
                            </Button>
                        </div>
                        <div className="w-[300px] sm:w-[400px] h-[500px] relative flex-shrink-0">
                            <Image
                                src="/girl-with-book.png"
                                alt="Girl reading a book"
                                layout="responsive"
                                priority={true}
                                width={400}
                                height={500}
                                className="object-contain transform -scale-x-100"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Normal Page Content (only visible when readOpen is false) */}
            {!readOpen && (
                <div className="flex flex-col space-y-4 p-4 sm:p-8 md:p-16 bg-gray-100 rounded-[2rem] shadow-md w-full my-0">
                    {/* Read a Story Header with Button */}
                    <div className="flex flex-col bg-indigo-300 text-white rounded-2xl p-6 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center space-x-3 font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                                <Flame className="fill-white sm:size-6 md:size-8 lg:size-9 mr-4" />
                                <span>Read a Story</span>
                            </span>
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={
                                        randomStoryId
                                            ? `/read-story/${randomStoryId}`
                                            : '/create-story'
                                    }
                                >
                                    <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm sm:text-md md:text-lg lg:text-xl flex items-center h-15">
                                        I&#39;m ready! <MoveRight className="ml-2" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="text-white hover:bg-indigo-300 p-2"
                                    onClick={() => setReadOpen(true)}
                                >
                                    <span className="flex items-center rounded-full p-1 bg-transparent">
                                        <CircleArrowDown className="size-12 sm:size-18 p-2 bg-transparent rounded-3xl text-white font-extralight hover:size-20" />
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Challenges Section */}
                    <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-indigo-300 text-white rounded-2xl px-3 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-6">
                        <span className="flex items-center space-x-3 font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                            <Flame className="fill-white sm:size-6 md:size-8 lg:size-9 mr-4" />
                            <span>Challenges</span>
                        </span>

                        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                            <Link href="#">
                                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm sm:text-md md:text-lg lg:text-xl flex items-center h-15">
                                    {"I'm ready!"}
                                    <span className="pl-3">
                                        <MoveRight />
                                    </span>
                                </Button>
                            </Link>

                            <span className="flex items-center rounded-full p-1 bg-transparent">
                                <CircleArrowDown className="size-12 sm:size-18 p-2 bg-transparent rounded-3xl text-white font-extralight hover:size-20" />
                            </span>
                        </div>
                    </div>

                    {/* Weekly Test & Survey Cards */}
                    <div className="mt-6 flex flex-wrap justify-center gap-6 sm:gap-8 p-0">
                        {/* Weekly Test Card */}
                        <div className="relative flex flex-col flex-1 basis-[300px] max-w-lg bg-white rounded-xl shadow-md p-4 overflow-hidden">
                            <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-purple-700 text-center">
                                Weekly Test
                            </h3>
                            <p className="text-gray-600 mt-2 text-xsm sm:text-sm md:text-md lg:text-xl text-center leading-loose">
                                Validate your improvements with these rewarding crafted sessions designed to help you increase your reading performances further!
                            </p>
                            <Link href="#" className="mt-auto flex justify-center">
                                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm sm:text-md md:text-lg lg:text-xl flex items-center h-15">
                                    {"I'm ready!"}
                                    <span className="pl-3">
                                        <MoveRight />
                                    </span>
                                </Button>
                            </Link>
                            <div className="absolute bottom-0 right-0 w-[60px] sm:w-[80px] md:w-[100px] lg:w-[120px] h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px]">
                                <Image
                                    src="/child-reading.png"
                                    alt="Child reading"
                                    priority={true}
                                    fill
                                    sizes="(max-width: 640px) 60px, (max-width: 768px) 80px, (max-width: 1024px) 100px, 120px"
                                    className="object-contain z-10"
                                />
                            </div>
                        </div>

                        {/* Survey Card */}
                        <div className="relative flex flex-col flex-1 basis-[300px] max-w-lg bg-white rounded-xl shadow-md p-4 overflow-hidden">
                            <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-purple-700 text-center">
                                Take on our survey
                            </h3>
                            <p className="text-gray-600 mt-4 text-sm sm:text-md md:text-lg lg:text-2xl text-center leading-loose">
                                Give us your feedback and help us make our app better for you!
                            </p>
                            <Link href="#" className="mt-auto flex justify-center">
                                <Button className="border border-purple-500 bg-gray-100 text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-lg text-sm sm:text-md md:text-lg lg:text-xl flex items-center h-15">
                                    Survey
                                    <span className="pl-4">
                                        <MoveRight />
                                    </span>
                                </Button>
                            </Link>
                            <div className="absolute bottom-0 right-0 w-[60px] sm:w-[80px] md:w-[100px] lg:w-[120px] h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px]">
                                <Image
                                    src="/child-survey.png"
                                    alt="Child with tablet"
                                    priority={true}
                                    fill
                                    sizes="(max-width: 640px) 60px, (max-width: 768px) 80px, (max-width: 1024px) 100px, 120px"
                                    className="object-contain z-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default Dashboard;
