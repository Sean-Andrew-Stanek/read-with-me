'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { CircleArrowUp, Flame, MoveRight, Sparkles } from 'lucide-react';
import { Check } from 'lucide-react';
import { Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getRandomStoryId } from '@/services/apiServices';
import LoadingSpinner from '@/components/LoadingSpinner';
import DefaultHomePanels from '@/components/DefaultHomePanels';

const Dashboard: FC = () => {
    const [readOpen, setReadOpen] = useState(false);
    const [challengesOpen, setChallengesOpen] = useState(false);

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
            {/* Read Story Expanded Panel */}
            {readOpen && (
                <div className="absolute inset-0 z-50 bg-gray-100 flex items-center justify-center rounded-[2rem] shadow-md w-full h-[61%]">
                    <div className="w-[95%] h-[80%] max-w-screen-2xl p-6 sm:p-10 bg-indigo-300 text-white rounded-2xl shadow-xl m-[4.5%] mt-[7%] mb-[8%]">
                        <div className="flex justify-between items-start h-15">
                            <h2 className="flex items-center space-x-3 font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                                <Sparkles className="fill-white sm:size-6 md:size-8 lg:size-9 mr-4" />
                                <span className="ml-2">Read a Story</span>
                            </h2>
                            <Button
                                variant="ghost"
                                onClick={() => setReadOpen(false)}
                                className="p-0 bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                            >
                                <CircleArrowUp className="size-12 sm:size-18 p-2 rounded-3xl font-extraligh text-white bg-transparent hover:size-20" />
                            </Button>
                        </div>

                        <div className="flex flex-row items-center justify-between gap-5 ml-10 w-full">
                            <div className="bg-white text-gray-800 rounded-xl p-6 text-center shadow-md flex-1 max-w-2xl translate-x-4 -translate-y-3 sm:translate-x-6 sm:-translate-y-5">
                                <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-4">
                                    Challenge and monitor your reading skills with our innovative reading interface.
                                    Match your interests with your favorite literary genres — we&#39;ll do the rest!
                                </p>
                                <div className="flex w-full justify-center">
                                    <Link href={randomStoryId ? `/read-story/${randomStoryId}` : '/create-story'} className="cursor-auto">
                                        <Button className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-base sm:text-md md:text-lg lg:text-xl text-white rounded-lg flex items-center mx-auto">
                                            I&#39;m ready! <MoveRight className="ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="w-[300px] sm:w-[450px] h-[562px] relative flex-shrink-0">
                                <Image
                                    src="/girl-with-book.png"
                                    alt="Girl reading a book"
                                    layout="responsive"
                                    priority
                                    width={450}
                                    height={562}
                                    className="object-contain transform -scale-x-100"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Challenges Expanded Panel */}
            {challengesOpen && (
                <div className="absolute inset-0 z-50 bg-gray-100 flex items-center justify-center rounded-[2rem] shadow-md w-full h-[61%]">
                    <div className="w-[95%] h-[80%] max-w-screen-2xl p-6 sm:p-10 bg-indigo-300 text-white rounded-2xl shadow-xl m-[4.5%] mt-[7%] mb-[8%]">
                        <div className="flex justify-between items-start h-15">
                            <h2 className="flex items-center space-x-3 font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                                <Flame className="fill-white sm:size-6 md:size-8 lg:size-9 mr-4" />
                                <span className="ml-2">Challenges</span>
                            </h2>
                            <Button
                                variant="ghost"
                                onClick={() => setChallengesOpen(false)}
                                className="p-0 bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                            >
                                <CircleArrowUp className="size-12 sm:size-18 p-2 rounded-3xl font-extraligh text-white bg-transparent hover:size-20" />
                            </Button>
                        </div>

                        <div className="flex flex-row items-center justify-between gap-5 ml-10 w-full">
                            <div className="bg-white text-gray-800 rounded-xl p-6 text-center shadow-md flex-1 max-w-2xl translate-x-4 -translate-y-3 sm:translate-x-6 sm:-translate-y-5">
                                <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-4">
                                    Validate your improvements with these rewarding sessions and help us improve by sharing feedback.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <Button className="bg-purple-600 hover:bg-purple-700 text-white text-base sm:text-lg">
                                        I&#39;m ready!
                                    </Button>
                                    <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-100">
                                        Take our Survey
                                    </Button>
                                </div>
                            </div>
                            <div className="w-[300px] sm:w-[450px] h-[562px] relative flex-shrink-0">
                                <Image
                                    src="/boy-with-backpack.png"
                                    alt="Boy with backpack"
                                    layout="responsive"
                                    priority
                                    width={450}
                                    height={562}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Default Collapsed Panels */}
            {!readOpen && !challengesOpen && (
                <DefaultHomePanels
                    randomStoryId={randomStoryId}
                    setReadOpen={setReadOpen}
                    setChallengesOpen={setChallengesOpen}
                />
            )}
        </div>
    );
};

export default Dashboard;
