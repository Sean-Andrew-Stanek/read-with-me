import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Sparkles, Trophy } from "lucide-react";
import { useSession } from "next-auth/react";
import OnboardingDialog from "../OnBoardingDialog";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { grades } from "@/lib/constants/grades";
import Link from "next/link";

const Sidebar = () => {
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

    const buttonSet = 'pl-0 h-12 group w-full justify-start mb-5 text-white bg-yellow-400 hover:bg-blue-200 hover:text-gray-700 shadow-sm rounded-3xl';
    const iconSet = 'size-9 mr-2 bg-amber-200 rounded-3xl p-1 text-gray-500'

    return (
        <div className="w-16 sm:w-60 lg:w-70 h-screen bg-transparent p-2 sm:p-4 flex flex-col items-center transition-all duration-300 sm:text-black">

            <div className="flex flex-col items-center mb-10">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white p-1 mt-2">
                    <Image
                        src="/profile.png"
                        width={500}
                        height={500}
                        alt="Picture of the user"
                        className="rounded-xl p-0"
                    />
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                        <div className="text-xs font-bold text-gray-700">...</div>
                    </div>
                </div>

                <p className="mt-3 sm:text-lg text-md font-medium text-gray-800">{session?.user.name}</p>

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
            <div className="w-full flex flex-col gap-4">
                <Link href={'/home'}>
                    <Button
                    variant="default"
                    className={buttonSet}
                >
                    <span className="inline-flex items-center p-1 rounded-3xl group-hover:bg-amber-200 text-lg transition-colors duration-200">
                        <Home className={iconSet} />
                    </span>
                    <span className="hidden sm:inline ml-2">Home</span>
                </Button>
                </Link>
                <Link href="/story-board">
                    <Button
                        variant="ghost"
                        className={buttonSet}
                    >
                        <span className="inline-flex items-center p-1 rounded-3xl group-hover:bg-amber-200 text-lg transition-colors duration-200">
                            <BookOpen className={iconSet} />
                        </span>
                        <span className="hidden sm:inline ml-2">My Stories</span>
                    </Button>
                </Link>

                <Link href={'/create-story'}>
                    <Button
                    variant="ghost"
                    className={buttonSet}
                >
                    <span className="inline-flex items-center p-1 rounded-3xl group-hover:bg-amber-200 text-lg transition-colors duration-200">
                        <Sparkles className={iconSet} />
                    </span>
                    <span className="hidden sm:inline ml-2">Create a Story</span>

                </Button>
                </Link>
                <Link href='#'>
                    <Button
                    variant="ghost"
                    className={buttonSet}
                >
                    <span className="inline-flex items-center p-1 rounded-3xl group-hover:bg-amber-200 text-lg transition-colors duration-200">
                        <Trophy className={iconSet} />
                    </span>
                    <span className="hidden sm:inline ml-2">My Progress</span>
                </Button>
                </Link>
            </div>
            {showDialog && (
                <OnboardingDialog
                    open={showDialog}
                    onOnboarded={handleOnboarded}
                />
            )}
        </div >
    );
};

export default Sidebar;
