'use client';

import { JSX } from 'react';
import { Button } from '@/components/ui/button';

const LandingPage = (): JSX.Element => {
    return (
        <div className="min-h-screen mt:1 bg-gray-100 flex flex-col items-center justify-center px-6 text-center">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Welcome
                </h1>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl mb-8">
                <p className="text-lg md:text-xl text-gray-600">
                    Practice reading stories out loud and get instant feedback
                    powered by AI!
                </p>
            </div>
            <Button className="rounded-full w-50 h-50 bg-blue-600 text-white text-xl font-semibold shadow-md hover:bg-blue-700 transition cursor-pointer">
                Let&apos;s go
            </Button>
        </div>
    );
};

export default LandingPage;
