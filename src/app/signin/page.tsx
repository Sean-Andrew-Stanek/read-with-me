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
                    <h1 className="text-2xl  md:text-4xl font-semibold">
                        Welcome {user.name}
                    </h1>
                    <form
                        action={async () => {
                            'use server';
                            await signOut();
                        }}
                    >
                        <Button
                            className="mt-4 md:w-auto py-3 md:py-6 lg:py-6 md:text-xl text-base bg-red-400 text-white rounded font-medium"
                            type="submit"
                        >
                            Sign Out
                        </Button>
                    </form>
                </>
            ) : (
                <>
                    <h1 className="text-2xl  md:text-4xl p-4 font-semibold">
                        You are not authenticated. Please sign in!
                    </h1>
                    <form
                        action={async () => {
                            'use server';
                            await signIn('google');
                        }}
                    >
                        <Button
                            className="bg-[#131314] border mt-4 border-[#8E918F] text-[#E3E3E3] font-medium text-[14px] md:text-[16px] lg:text-[18px] 
 leading-[20px] md:leading-[24px] lg:leading-[26px] rounded-full px-6 py-4 md:px-12 md:py-5 lg:px-14 lg:py-6 flex items-center gap-2 shadow-md hover:bg-[#1a1a1b] transition"
                        >
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
