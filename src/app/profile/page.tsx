'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

import { grades } from '@/lib/constants/grades';
import { Button } from '@/components/ui/button';
import UserDropdown from '@/components/Sidebar/UserDropdown';
import OnboardingDialog from '@/components/OnBoardingDialog';
import LinkChildDialog from '@/components/LinkChildDialog';
import { ChildUser } from '@/lib/types/user';

type ChildUserWithName = ChildUser & { userName: string };

const Profile: React.FC = () => {
    const { data: session } = useSession();
    const [showDialog, setShowDialog] = useState(false);
    const [children, setChildren] = useState<ChildUserWithName[]>([]);

    const grade = session?.user?.grade;
    const isParent = session?.user?.isParent;

    const fetchChildren = useCallback(async (): Promise<void> => {
        if (isParent && session?.user?.uuid) {
            const res = await fetch(`/api/user?uuid=${session.user.uuid}`);
            const data = await res.json();
            if (data.children?.length > 0) {
                const childDetails = await Promise.all(
                    data.children.map(async (childUuid: string) => {
                        const res = await fetch(`/api/user?uuid=${childUuid}`);
                        if (!res.ok) return null;
                        const child = await res.json();
                        return child;
                    })
                );
                setChildren(childDetails.filter(Boolean));
            } else {
                setChildren([]);
            }
        }
    }, [isParent, session?.user?.uuid]);

    useEffect(() => {
        fetchChildren();
    }, [fetchChildren]);

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

    return (
        <div className="flex justify-center items-start p-6">
            <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-md p-8">
                <div className="flex flex-col items-center">
                    <div className="relative w-30 h-30 rounded-xl overflow-hidden bg-white p-1 mt-2">
                        <Image
                            src="/profile.png"
                            width={120}
                            height={120}
                            priority
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

                    {/* Child Grade Display */}
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

                {/* Parent View – Linked Children */}
                {isParent && (
                    <div className="mt-6 w-full text-md text-gray-700">
                        <p className="font-semibold text-md mb-1">
                            Linked Children:
                        </p>
                        {children.length === 0 ? (
                            <p>No children linked yet.</p>
                        ) : (
                            <ul className="space-y-1">
                                {children.map(child => (
                                    <li
                                        key={child.uuid}
                                        className="flex justify-between"
                                    >
                                        <span>{child.userName}</span>
                                        <span className="text-gray-500 text-xs">
                                            Grade:{' '}
                                            {grades[
                                                child.grade as keyof typeof grades
                                            ] ?? 'Not set'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button
                            className="mt-2 text-blue-600 text-sm underline hover:text-blue-800 cursor-pointer"
                            onClick={() => setShowDialog(true)}
                        >
                            Link a child account
                        </button>
                    </div>
                )}

                <div className="mt-8">
                    <Link href="/home">
                        <Button
                            variant="default"
                            className="bg-indigo-400 text-white cursor-pointer"
                        >
                            Go to Home
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Dialog for Grade or Linking */}
            {showDialog &&
                (isParent ? (
                    <LinkChildDialog
                        open={showDialog}
                        onClose={() => setShowDialog(false)}
                        onLinked={fetchChildren}
                    />
                ) : (
                    <OnboardingDialog
                        open={showDialog}
                        onOnboarded={handleOnboarded}
                    />
                ))}
        </div>
    );
};

export default Profile;
