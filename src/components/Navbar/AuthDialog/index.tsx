'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useSession, signIn, signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

// import { JSX } from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';

const AuthDialog: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';

    // Prevent page shift when dialog is open
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden'); // Prevents shifting
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [isOpen]);

    const handleGoogleSignIn = async (): Promise<void> => {
        await signIn('google', { callbackUrl: '/dashboard' });
        setIsOpen(false);
    };

    const handleSignOut = async (): Promise<void> => {
        await signOut({ callbackUrl: '/' });
    };

    if (isAuthenticated) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-white text-sm md:text-base break-words whitespace-normal">
                    {session?.user?.name}
                </span>

                <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="flex items-center gap-2 text-black cursor-pointer"
                >
                    {/* Logout Icon */}
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="text-black cursor-pointer" variant="outline">
                    Sign In
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[94%] max-w-md px-6 mx-auto [&>button]:cursor-pointer">
                <DialogHeader>
                    <DialogTitle className="text-center  text-lg md:text-xl">
                        Sign in to your account
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col space-y-4 py-4">
                    <Button
                        variant="outline"
                        className="flex items-center justify-center gap-2 h-12 cursor-pointer"
                        onClick={handleGoogleSignIn}
                    >
                        {/* Google Icon */}
                        <svg
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="h-5 w-5"
                        >
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Continue with Google
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthDialog;
