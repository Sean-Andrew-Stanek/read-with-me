'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { postLogin } from '@/services/authAPIServices';

const SignIn: React.FC = () => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            // eslint-disable-next-line no-console
            postLogin().catch(console.error); // TODO: Deal with this UI side
        }
    }, [status]);

    const user = session?.user;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            {user ? (
                <h1 className="text-2xl md:text-4xl font-semibold">
                    Welcome {user.name}
                </h1>
            ) : (
                <h1 className="text-2xl md:text-4xl font-semibold">
                    You are not authenticated. Please sign in!
                </h1>
            )}
        </div>
    );
};

export default SignIn;
