'use client';

import { Loader } from "lucide-react";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";
import { toast } from "sonner";

const CreateChildAccountForm = (): JSX.Element => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 15000);

            return (): void => {
                clearTimeout(timer);
            };
        }
        return;
    }, [message]);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch('/api/children/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Child account created and added to your children list.`)
                setUsername('');
                setPassword('');
            } else {
                setMessage(`${data.error || 'Something went wrong.'}`);
            }
        } catch (error) {
            setMessage(`${error}`);
            toast.message(message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-purple-100">
            <form
                onSubmit={handleSubmit}
                className="p-4 w-full max-w-md bg-neutral-200 rounded shadow-lg mb-60"
                aria-labelledby="form-title"
            >
                <h2 id="form-title" className="text-center text-xl font-bold mb-4">Create Child Account</h2> {/* Added mb-4 */}

                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                    <input
                        id="username"
                        type="text"
                        className="w-full bg-yellow-50 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" // Added focus styles
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        maxLength={20}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="w-full border bg-yellow-50 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" // Added focus styles
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        maxLength={20}
                        required
                    />
                </div>

                <div className="flex justify-center space-x-6">
                    <Link href={'/parent-dashboard'}>
                        <button
                        className="bg-purple-600 hover:bg-purple-700 hover:scale-[105%] transition-transform text-white my-4 px-4 py-2 rounded disabled:opacity-50" // Added transition-transform
                    >
                        Return to Dashboard
                    </button>
                    </Link>
                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 hover:scale-[105%] transition-transform text-white my-4 px-4 py-2 rounded disabled:opacity-50" // Added transition-transform
                        disabled={loading}
                    >
                        {loading ? <Loader className="size-15" /> : 'Create Child'}
                    </button>
                </div>
                {message && <p className={`mt-2 text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-gray-700'}`}>{message}</p>}
            </form>
        </div>
    );
}

export default CreateChildAccountForm;