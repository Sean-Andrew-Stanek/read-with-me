'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';

type LoginProps = {
    loggedIn: boolean;
    setLoggedIn: (value: boolean) => void;
};

const Login = ({ loggedIn, setLoggedIn }: LoginProps) => {
    const router = useRouter();
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

    const handleLogin = async (): Promise<void> => {
        const res = await fetch('/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, password })
        });

        const data = await res.json();

        if (res.ok) {
            setLoggedIn(true);
            setIsOpen(false);
            router.push('/home');
        } else {
            setError(data.error || 'Invalid username or password.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-black cursor-pointer">
                    Log In
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[94%] max-w-md px-6 mx-auto [&>button]:cursor-pointer">
                <DialogHeader>
                    <DialogTitle className="text-center text-lg md:text-xl">
                        Log into your account
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col space-y-4 py-4">
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
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <Button
                        onClick={handleLogin}
                        className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-2 rounded-2xl"
                    >
                        Log In
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Login;
