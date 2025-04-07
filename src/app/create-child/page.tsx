'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JSX } from 'react';

const CreateChildPage = (): JSX.Element => {
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleCreate = async (): Promise<void> => {
        const res = await fetch('/api/create-child', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, password })
        });

        const data = await res.json();

        if (res.ok) {
            setSuccess(`Child account created. `);
            setTimeout(() => {
                router.push('/child-login');
            }, 1500);
        } else {
            setError(data.error || 'Something went wrong.');
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Create Child Account</h1>
            <h5 className="font-secondary mb-4 text-sm text-gray-500">
                User Name must consist of the child&apos;s name, mom&apos;s
                name, and dad&apos;s name. <br />
                e.g. Luna_Hannah_Tom
            </h5>
            <input
                className="border p-2 w-full mb-2"
                placeholder="User Name"
                value={userName}
                onChange={e => setUserName(e.target.value)}
            />
            <input
                className="border p-2 w-full mb-2"
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button
                className="bg-red-400 text-white p-2 w-full mt-2 rounded-2xl cursor-pointer"
                onClick={handleCreate}
            >
                Create Child
            </button>
        </div>
    );
};

export default CreateChildPage;
