'use client';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, CircleArrowRight, Sparkles, Trophy } from 'lucide-react';
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
    <div className="flex flex-col gap-5 items-center py-10 px-4 mt-10">
        <div className="flex flex-col space-y-6 p-8 bg-white rounded-4xl shadow-md max-w-4xl mx-auto my-0 w-700 h-10/12">
            <Button className="w-full h-16 flex items-center justify-between text-4xl bg-indigo-300 hover:bg-indigo-400 text-white rounded-2xl px-8 font-normal">
                <div className="flex items-center space-x-3">
                    <Sparkles className='size-9 mr-9' /> 
                    <span>Read a Story</span>
                </div>
                <div className="flex items-center justify-center ml-6 rounded-full p-1 bg-transparent">
                    <CircleArrowRight className="size-11 mr-2 p-0 bg-transparent rounded-3xl text-gray-500"  />
                </div>
            </Button>

            <Button className="w-full h-16 flex items-center justify-between text-4xl bg-indigo-300 hover:bg-indigo-400 text-white rounded-3xl px-8 font-normal">
                <div className="flex items-center space-x-3">
                    <Trophy className='size-9 mr-9' />
                    <span>Challenges</span>
                </div>
                <div className="flex items-center justify-center ml-6 rounded-full p-1 bg-transparent">
                    <CircleArrowRight className="size-11 mr-2 p-0 bg-transparent rounded-3xl text-gray-500"  />
                </div>
            </Button>
        </div>
    </div>
);
};

export default Dashboard;
