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
import { useParams } from 'next/navigation';
import SearchDropdown from '../SearchDropdown';

const Navbar: React.FC = () => {
    const { showOnboarding, setShowOnboarding } = useOnboardingStore();
    const pathname = usePathname();

    const { id } = useParams();
    // console.log(`ID: ${id}`)

    const staticPaths = ['/create-story', '/story-result', '/story-board'];
    const dynamicPath = id ? `/read-story/${id}` : null;

    const isSelectedPath = staticPaths.includes(pathname);
    const isReadingPage = pathname === dynamicPath;
    const backPath = isSelectedPath
        ? '/home'
        : isReadingPage
            ? '/story-board'
            : null

    const { data: session, status } = useSession();
    if (status === 'loading') return null;

    const isLoggedIn = !!session?.user?.uuid;

    return (
        <>
            <nav className="flex bg-transparent justify-between items-center px-6 py-4 rounded-t-3xl">
                <Logo />
                <div className="flex items-center gap-4 ml-auto">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-2">

                            {backPath && (
                                <Link href={backPath}>
                                    <Button
                                        variant='outline'
                                        className='text-black cursor-pointer'
                                    >
                                        Back
                                    </Button>
                                </Link>
                            )}

                            {pathname === '/profile' && (
                                <Button
                                    onClick={() => {
                                        signOut({ callbackUrl: '/' });
                                    }}
                                    variant="outline"
                                    className="h-auto px-3 py-1 text-xs sm:text-sm md:text-base text-black flex items-center gap-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <Signup />
                            <AuthDialog />
                        </>
                    )}

                    {/* <Button className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50">
                        <Search className="text-gray-600 size-6" />
                    </Button> */}
                    <SearchDropdown />
                </div>

                <OnboardingDialog
                    open={showOnboarding}
                    onOnboarded={() => {
                        setShowOnboarding(false);
                        window.location.href = '/home';
                    }}
                />
            </nav>

        </>
    );
};

export default Navbar;
