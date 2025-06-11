import { useState, JSX } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Home, LibraryBig, Trophy } from 'lucide-react';
import { useSession } from 'next-auth/react';
import OnboardingDialog from '../OnBoardingDialog';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { grades } from '@/lib/constants/grades';
import Link from 'next/link';
import UserDropdown from './UserDropdown';

const Sidebar = (): JSX.Element => {
    const { data: session } = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const grade = session?.user?.grade;
    const isParent = session?.user?.isParent;

    const handleOnboarded = (): void => {
        const toastType = localStorage.getItem('toast');

        if (toastType === 'grade-saved') {
            toast.success('Grade level saved successfully!', {
                icon: <Check className="h-5 w-5 text-green-500" />,
                style: {
                    color: 'rgb(22 163 74)',
                    borderColor: 'rgb(134 239 172)'
                }
            });
        }

        localStorage.removeItem('toast');
        setShowDialog(false);
    };

    const buttonSet =
        'w-[40%] lg:w-[90%] pl-0 h-16 group justify-start ml-9 text-2xl text-white bg-yellow-400 hover:bg-transparent hover:text-gray-700 shadow-lg rounded-3xl';
    const iconSet = 'size-9 mr-2 bg-amber-200 rounded-3xl p-1 text-gray-500';

    return (
        <div className="w-[30%] h-screen bg-transparent mr-4 p-2 sm:p-4 flex flex-col items-center transition-all duration-300 sm:text-black">
            <div className="flex flex-col items-center mb-10">
                <div className="relative w-30 h-30 rounded-xl overflow-hidden bg-white p-1 mt-2">
                    <Image
                        src="/profile.png"
                        width={500}
                        height={500}
                        alt="Picture of the user"
                        className="rounded-xl p-0"
                    />
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                        <UserDropdown />
                    </div>
                </div>
                <p className="mt-3 sm:text-lg text-md font-medium text-gray-800">
                    {session?.user.name}
                </p>

                {/* Grade display */}
                {!isParent && typeof grade === 'number' ? (
                    <span className="text-sm text-gray-600 -mt-1">
                        {grades[grade]}
                    </span>
                ) : !isParent ? (
                    <div className="text-sm -mt-1">
                        <span
                            className="text-blue-600 text-xs underline cursor-pointer hover:text-blue-800"
                            onClick={() => setShowDialog(true)}
                        >
                            Select your grade level
                        </span>
                    </div>
                ) : null}
            </div>
            <div className="w-full flex flex-col space-y-12">
                <Link href={'/home'}>
                    <Button variant="default" className={buttonSet}>
                        <span className="inline-flex items-center p-1 rounded-3xl group-hover:bg-amber-200 text-lg transition-colors duration-200">
                            <Home className={iconSet} />
                        </span>
                        <span className="hidden sm:inline ml-2 truncate">
                            Home
                        </span>
                    </Button>
                </Link>
                <Link href="/story-board">
                    <Button variant="ghost" className={buttonSet}>
                        <span className="inline-flex items-center p-1 rounded-3xl group-hover:bg-amber-200 text-lg transition-colors duration-200">
                            <LibraryBig className={iconSet} />
                        </span>
                        <span className="hidden sm:inline ml-2 truncate">
                            My Stories
                        </span>
                    </Button>
                </Link>

                <Link href={'/favorites'}>
                    <Button variant="ghost" className={buttonSet}>
                        <span className="inline-flex items-center p-1 rounded-3xl group-hover:bg-amber-200 text-lg transition-colors duration-200">
                            <Heart className={iconSet} />
                        </span>
                        <span className="hidden sm:inline ml-2 truncate">
                            Top Stories
                        </span>
                    </Button>
                </Link>
                <Link href="/create-story">
                    <Button variant="ghost" className={buttonSet}>
                        <span className="inline-flex items-center p-1 rounded-3xl group-hover:bg-amber-200 text-lg transition-colors duration-200">
                            <Trophy className={iconSet} />
                        </span>
                        <span className="hidden sm:inline ml-2 truncate">
                            Create a Story
                        </span>
                    </Button>
                </Link>
            </div>
            {showDialog && (
                <OnboardingDialog
                    open={showDialog}
                    onOnboarded={handleOnboarded}
                />
            )}
        </div>
    );
};

export default Sidebar;
