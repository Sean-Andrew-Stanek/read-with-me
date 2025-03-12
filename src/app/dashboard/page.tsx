import { auth } from '@/auth';
import { JSX } from 'react';

const SignIn = async (): Promise<JSX.Element> => {
    const session = await auth();

    const user = session?.user;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            {user ? (
                <>
                    <h1 className="text-2xl  md:text-4xl font-semibold">
                        Welcome {user.name}
                    </h1>
                </>
            ) : (
                <>
                    <h1 className="text-2xl  md:text-4xl p-4font-semibold">
                        You are not authenticated. Please sign in!
                    </h1>
                </>
            )}
        </div>
    );
};

export default SignIn;
