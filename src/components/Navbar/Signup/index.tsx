'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from '@/components/ui/dialog';
import { signIn } from 'next-auth/react';
import { JSX } from 'react';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

const Signup = (): JSX.Element => {
    const { setShowOnboarding } = useOnboardingStore();

    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [isOpen]);

    const handleSignup = async (): Promise<void> => {
        const res = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, password })
        });

        const data = await res.json();
        if (res.ok) {
            // log in after signup
            const loginRes = await signIn('credentials', {
                redirect: false,
                userName,
                password
            });

            if (loginRes && loginRes.ok) {
                setIsOpen(false);
                setShowOnboarding(true);
            } else {
                setError(data.error || 'Something went wrong.');
            }
        } else {
            setError(data.error || 'Something went wrong.');
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-black cursor-pointer">
                    Sign Up
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[94%] max-w-md px-6 mx-auto [&>button]:cursor-pointer">
                <DialogHeader>
                    <DialogTitle className="text-center text-lg md:text-xl">
                        Create an account
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm text-muted-foreground">
                        Sign up to get started with Read With Me.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col space-y-4 py-4">
                    <label
                        className="block mb-1 font-medium text-sm"
                        htmlFor="password"
                    >
                        Username:
                    </label>
                    <input
                        type="text"
                        placeholder="Username"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                    />
                    <label
                        className="block mb-1 font-medium text-sm"
                        htmlFor="password"
                    >
                        Password:
                    </label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <Button
                        onClick={handleSignup}
                        className="bg-red-400 hover:bg-red-600 text-white font-semibold py-2 rounded-2xl cursor-pointer"
                    >
                        Sign Up
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Signup;
