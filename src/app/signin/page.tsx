import { auth, signIn, signOut } from '@/auth';

export default async function SignIn() {
    const session = await auth();
    console.log(session);

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
                        <button
                            className="bg-red-400 text-white px-4 py-2 rounded mt-4"
                            type="submit"
                        >
                            Sign Out
                        </button>
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
                        <button className="bg-red-400 text-white px-4 py-2 rounded mt-4">
                            Sign In with Google
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
