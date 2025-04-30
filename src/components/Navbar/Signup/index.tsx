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
import { Eye, EyeOff } from 'lucide-react';
import { signupSchema } from '@/lib/validation';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

const Signup = (): JSX.Element => {
    const { setShowOnboarding } = useOnboardingStore();

    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = (): void => {
        setShowPassword(prev => !prev);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [isOpen]);

    const handleSignup = async (): Promise<void> => {
        const validation = signupSchema.safeParse({ userName, password });

        if (!validation.success) {
            setError(validation.error.errors[0].message); // show the first error message
            return;
        }

        const res = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, password })
        });

        const data = await res.json();
        if (res.ok) {
            toast.success('Account created successfully!', {
                icon: <Check className="h-5 w-5 text-green-500" />,
                style: {
                    color: 'rgb(22 163 74)',
                    borderColor: 'rgb(134 239 172)'
                }
            });

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
                    <div className="relative w-full">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                        />

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}
                        <Button
                            onClick={toggleVisibility}
                            className="absolute inset-y-0 right-1 flex items-center px-2 rounded cursor-pointer bg-grey text-black hover:bg-grey focus:outline-none shadow-none"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

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
