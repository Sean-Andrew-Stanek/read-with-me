'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
// import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from '@/components/ui/dialog';

const AuthDialog: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = (): void => {
        setShowPassword(prev => !prev);
    };

    // const { data: session, status } = useSession();

    // const isLoggedIn = !!session?.user?.uuid;

    const router = useRouter();

    // Prevent page shift when dialog is open
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden'); // Prevents shifting
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [isOpen]);

    // if (status === 'loading') return null;

    const handleGoogleSignIn = async (): Promise<void> => {
        await signIn('google', { callbackUrl: '/home' });
        setIsOpen(false);
    };

    const handleCredentialsLogin = async (): Promise<void> => {
        const res = await signIn('credentials', {
            redirect: false,
            userName,
            password
        });
        if (res?.error) {
            setError('Invalid username or password.');
        } else {
            setIsOpen(false);
            router.refresh();
            router.push('/home');
        }
    };

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
                    <DialogDescription className="text-center text-sm text-muted-foreground">
                        Choose how you&apos;d like to log in below.
                    </DialogDescription>
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
                    <div className="text-center text-sm text-muted-foreground">
                        or sign in as a child
                    </div>

                    {/* Username and password login */}
                    <label className="block mb-1 font-medium text-sm">
                        Username:
                    </label>
                    <input
                        type="text"
                        placeholder="Username"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                    />
                    <label className="block mb-1 font-medium text-sm">
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
                            className="absolute top-1/2 right-1 transform -translate-y-1/2 rounded cursor-pointer bg-grey text-black hover:bg-grey focus:outline-none shadow-none"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    <Button
                        onClick={handleCredentialsLogin}
                        className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-2 rounded-2xl cursor-pointer"
                    >
                        Log In as Child
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthDialog;
