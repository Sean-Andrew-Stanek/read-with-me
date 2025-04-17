// 'use client';
// import { useSession, signOut, signIn } from 'next-auth/react';
// import Logo from './Logo';
// import Signup from './Signup';
// import Login from './Login';
// import { Button } from '@/components/ui/button';
// import AuthDialog from './AuthDialog';

// const Navbar = () => {
//     const { data: session, status } = useSession();

//     if (status === 'loading') return null;
//     console.log('Session:', session);

//     return (
//         <nav className="flex justify-between items-center py-4 bg-red-400 text-white p-4">
//             <Logo />
//             <AuthDialog />
//             <div className="flex items-center gap-2">
//                 {!session ? (
//                     <>
//                         <Login />
//                         <Signup />
//                     </>
//                 ) : (
//                     <Button
//                         onClick={() => signOut({ callbackUrl: '/' })}
//                         variant="outline"
//                         className="text-black"
//                     >
//                         Sign Out
//                     </Button>
//                 )}
//             </div>
//         </nav>
//     );
// };

// export default Navbar;

'use client';
import Logo from './Logo';
import Signup from './Signup';
import { Button } from '@/components/ui/button';
import AuthDialog from './AuthDialog';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

const Navbar: React.FC = () => {
    const { data: session, status } = useSession();
    if (status === 'loading') return null;

    const isLoggedIn = !!session?.user?.uuid;
    // const router = useRouter();

    // const [loggedIn, setLoggedIn] = useState(false);

    return (
        <nav className="flex justify-between items-center py-4 bg-red-400 text-white p-4">
            <Logo />

            <div className="flex items-center gap-2">
                {isLoggedIn ? (
                    <Button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        variant="outline"
                        className="text-black"
                    >
                        Sign Out
                    </Button>
                ) : (
                    <>
                        <Signup />
                        <AuthDialog />
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
