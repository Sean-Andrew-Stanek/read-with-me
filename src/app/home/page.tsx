'use client';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { CircleArrowRight, Flame, Sparkles, LibraryBig } from 'lucide-react';
import { Check } from 'lucide-react';
import { Info } from 'lucide-react';
import Link from 'next/link';

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

    const buttonSet = 'w-full h-28 flex items-center justify-between text-lg sm:text-xl md:text-2xl lg:text-3xl bg-indigo-300 hover:bg-indigo-400 text-white rounded-2xl px-3 sm:px-5 md:px-6 lg:px-8 font-normal py-3'
    return (
        <div className="flex flex-col w-[100%] gap-5 items-center py-10 px-4 mt-10 min-h-screen sm:px-4 lg:px-8">
            <div className="flex flex-col space-y-4 p-16 bg-white rounded-[2rem] shadow-md w-[100%] mx-auto my-0 h-10/12">

                <Link href='/story-board'>
                    <Button className={buttonSet} >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <LibraryBig className='sm:size-6 md:size-8 lg:size-9 mr-9' />
                            <span>Read a Story</span>
                        </div>
                        <div className="flex items-center justify-center ml-6 rounded-full p-1 bg-transparent">
                            <CircleArrowRight className="sm:size-9 md:size-10 lg:size-11 mr-0 p-2 bg-transparent rounded-3xl text-gray-500" />
                        </div>
                    </Button>
                </Link>
                <Link href='#'>
                    <Button className={buttonSet} >
                        <div className="flex items-center space-x-3">
                            <Flame className='sm:size-6 md:size-8 mr-9' />
                            <span>Challenges</span>
                        </div>
                        <div className="flex items-center justify-center ml-6 rounded-full p-1 bg-transparent">
                            <CircleArrowRight className="sm:size-9 md:size-10 lg:size-11 mr-0 p-2 bg-transparent rounded-3xl text-gray-500" />
                        </div>
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
