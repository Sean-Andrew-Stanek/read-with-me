'use client';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { CircleArrowDown, Flame, MoveRight, Sparkles } from 'lucide-react';
import { Check } from 'lucide-react';
import { Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Dashboard: FC = () => {
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

    return (
        <div className="flex flex-col gap-5 items-center py-10 px-4 mt-10 min-h-screen max-w-screen-xl mx-auto overflow-x-hidden">
            <div className="flex flex-col space-y-4 p-4 sm:p-8 md:p-16 bg-gray-100 rounded-[2rem] shadow-md w-full max-w-5xl mx-auto my-0">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-indigo-300 text-white rounded-2xl px-3 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-6">
                    <span className="flex items-center space-x-3 font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                        <Sparkles className="fill-white sm:size-6 md:size-8 lg:size-9 mr-4" />
                        <span>Read a Story</span>
                    </span>

                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                        <Link href="/story-board">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm sm:text-md md:text-lg lg:text-xl flex items-center h-15">
                                {"I'm ready!"} <span className="pl-3"><MoveRight /></span>
                            </Button>
                        </Link>

                        <span className="flex items-center rounded-full p-1 bg-transparent">
                            <CircleArrowDown className="size-12 sm:size-16 p-2 bg-transparent rounded-3xl text-white font-extralight" />
                        </span>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-indigo-300 text-white rounded-2xl px-3 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-6">
                    <span className="flex items-center space-x-3 font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                        <Flame className="fill-white sm:size-6 md:size-8 lg:size-9 mr-4" />
                        <span>Challenges</span>
                    </span>

                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                        <Link href="#">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm sm:text-md md:text-lg lg:text-xl flex items-center h-15">
                                {"I'm ready!"} <span className="pl-3"><MoveRight /></span>
                            </Button>
                        </Link>

                        <span className="flex items-center rounded-full p-1 bg-transparent">
                            <CircleArrowDown className="size-12 sm:size-16 p-2 bg-transparent rounded-3xl text-white font-extralight" />
                        </span>
                    </div>
                </div>
                {/* Weekly Test Card */}
                <div className="mt-6 flex flex-wrap justify-center gap-6 sm:gap-8">
                    <div className="relative flex flex-col flex-1 basis-[300px] max-w-sm bg-white rounded-xl shadow-md p-4 overflow-hidden">
                        <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-purple-700 text-center">
                            Weekly Test
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm sm:text-sm md:text-md lg:text-xl text-center">
                            Validate your improvements with these rewarding crafted sessions designed to help you increase your reading performances further!
                        </p>
                        <div className="mt-auto flex justify-center">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm sm:text-md md:text-lg lg:text-xl h-15 w-[50%] mt-4 mr-4">
                                {"I'm ready !"} <span className='pl-4'><MoveRight /></span>
                            </Button>
                        </div>
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
                    <div className="relative flex flex-col flex-1 basis-[300px] max-w-sm bg-white rounded-xl shadow-md p-4 overflow-hidden">
                        <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-purple-700 text-center">
                            Take on our survey
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm sm:text-sm md:text-md lg:text-xl text-center">
                            Give us your feedback and help us make our app better for you!
                        </p>
                        <div className="mt-auto flex justify-center">
                            <Button className="border border-purple-500 bg-gray-100 text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-lg text-sm sm:text-md md:text-lg lg:text-xl  h-15 w-[50%] mt-4 mr-4">
                                Survey  <span className='pl-6'><MoveRight /></span>
                            </Button>
                        </div>
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
        </div>
    );
};

export default Dashboard;
