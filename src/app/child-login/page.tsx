'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

const ChildLoginPage: React.FC = () => {
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleLogin = async (): Promise<void> => {
        try {
            const res = await fetch('/api/child-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, password })
            });

            if (res.ok) {
                router.push('/dashboard/child');
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed.');
            }
        } catch {
            setError('Something went wrong.');
        }
    };

    const handleUuidChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setUserName(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Child Login</h1>

            <input
                className="border p-2 w-full mb-2"
                placeholder="Enter your user name"
                value={userName}
                onChange={handleUuidChange}
            />
            <input
                className="border p-2 w-full mb-2"
                placeholder="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
                className="bg-red-400 text-white p-2 mt-2 w-full rounded-2xl cursor-pointer"
                onClick={handleLogin}
            >
                Log In
            </button>
        </div>
    );
};

export default ChildLoginPage;
