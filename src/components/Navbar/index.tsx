'use client';
import Logo from './Logo';
// import AuthDialog from './AuthDialog';
import Signup from './Signup';
import Login from './Login';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
    const router = useRouter();

    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <nav className="flex justify-between items-center py-4 bg-red-400 text-white p-4">
            <Logo />
            <div className="flex items-center gap-2">
                {!loggedIn ? (
                    <>
                        <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                        <Signup loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                    </>
                ) : (
                    <Button
                        onClick={() => {
                            setLoggedIn(false);
                            router.push('/');
                        }}
                        variant="outline"
                        className="text-black"
                    >
                        Sign Out
                    </Button>
                )}
                {/* <AuthDialog /> */}
            </div>
        </nav>
    );
};

export default Navbar;
