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
import { ArrowRightIcon, BookOpen, Sparkles } from 'lucide-react';
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
            <div className="flex-1 p-8 bg-white rounded-4xl shadow-md max-w-4xl mx-auto my-0 w-600">
                <div className="flex flex-col space-y-4">
        {/* Read a Story Button */}
        <Button className="w-full h-16 flex items-center justify-between text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6">
          <div className="flex items-center space-x-3">
            {/* Replace with your desired icon for "Read a Story" */}
            <span className="text-2xl">✨</span> {/* Example icon */}
            <span>Read a Story</span>
          </div>
          <ArrowRightIcon className="h-6 w-6" />
        </Button>

        {/* Challenges Button */}
        <Button className="w-full h-16 flex items-center justify-between text-lg bg-purple-200 hover:bg-purple-300 text-white rounded-lg px-6">
          <div className="flex items-center space-x-3">
            {/* Replace with your desired icon for "Challenges" */}
            <span className="text-2xl">🏆</span> {/* Example icon */}
            <span>Challenges</span>
          </div>
          <ArrowRightIcon className="h-6 w-6" />
        </Button>
      </div>
            </div>
        </div>
    );
};

export default Dashboard;
