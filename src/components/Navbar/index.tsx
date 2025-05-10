'use client';
import Logo from './Logo';
import Signup from './Signup';
import { Button } from '@/components/ui/button';
import AuthDialog from './AuthDialog';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import OnboardingDialog from '@/components/OnBoardingDialog';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Navbar: React.FC = () => {
    const { showOnboarding, setShowOnboarding } = useOnboardingStore();
    const pathname = usePathname();
    const isSelectedPath =
        pathname === '/create-story' || pathname === '/my-stories' || pathname === '/story-result';

    const { data: session, status } = useSession();
    if (status === 'loading') return null;

    const isLoggedIn = !!session?.user?.uuid;

    return (
        <>
            <nav className="flex justify-between items-center py-4 bg-red-400 text-white p-4">
                <Logo />

                <div className="flex items-center gap-2 ">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <span className="text-white font-semibold not-odd:text-md md:text-base break-words whitespace-normal">
                                {session?.user?.name}
                            </span>

                            {isSelectedPath && (
                                <Link href="/home">
                                    <Button
                                        variant="outline"
                                        className="text-black cursor-pointer"
                                    >
                                        Back
                                    </Button>
                                </Link>
                            )}

                            <Button
                                onClick={() => {
                                    signOut({ callbackUrl: '/' });
                                }}
                                variant="outline"
                                className="flex items-center gap-2 text-black cursor-pointer"
                            >
                                {/* Logout Icon */}
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Signup />
                            <AuthDialog />
                        </>
                    )}
                </div>
            </nav>
            <OnboardingDialog
                open={showOnboarding}
                onOnboarded={() => {
                    setShowOnboarding(false);
                    window.location.href = '/home';
                }}
            />
        </>
    );
};

export default Navbar;
