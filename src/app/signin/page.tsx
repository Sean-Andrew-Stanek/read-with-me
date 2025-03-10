import { auth, signIn, signOut } from '@/auth';
import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

const SignIn = async (): Promise<JSX.Element> => {
    const session = await auth();

    const user = session?.user;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            {user ? (
                <>
                    <h1 className="text-3xl font-semibold">
                        Welcome {user.name}
                    </h1>
                    <form
                        action={async () => {
                            'use server';
                            await signOut();
                        }}
                    >
                        <Button
                            className="bg-red-400 text-white px-4 py-2 rounded mt-4"
                            type="submit"
                        >
                            Sign Out
                        </Button>
                    </form>
                </>
            ) : (
                <>
                    <h1 className="text-3xl font-semibold">
                        You are not authenticated. Please sign in!
                    </h1>
                    <form
                        action={async () => {
                            'use server';
                            await signIn('google');
                        }}
                    >
                        <Button className="bg-[#131314] border mt-4 border-[#8E918F] text-[#E3E3E3] font-medium text-[14px] leading-[20px] rounded-full px-6 py-4 flex items-center gap-2 shadow-md hover:bg-[#1a1a1b] transition">
                            <FcGoogle size={18} />
                            Sign In with Google
                        </Button>
                    </form>
                </>
            )}
        </div>
    );
};

export default SignIn;
