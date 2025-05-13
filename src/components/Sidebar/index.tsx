'use client';

import { FC } from 'react';
import { useState } from 'react';
import DashboardSidebarLink from './DashboardSidebar';
import { useSession } from 'next-auth/react';
import OnboardingDialog from '@/components/OnBoardingDialog';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { grades } from '@/lib/constants/grades';

const Sidebar: FC = () => {
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

    return (
        <>
            <aside className="w-64 m-h-screen bg-white border-r border-gray-200 top-16 left-0 z-40 p-4 shadow-sm font-literata-variable font-semibold text-lg">
                <div className="flex items-center justify-between mb-4">
                    {!isParent && typeof grade === 'number' ? (
                        <span className="text-xs  text-gray-500 ">
                            {session?.user?.name}'s grade level: {grades[grade]}
                        </span>
                    ) : !isParent ? (
                        <div className="text-sm">
                            <span className="text-xs text-gray-500 block">
                                {session?.user?.name}'s grade level:
                            </span>
                            <span
                                className="text-blue-600 text-xs underline cursor-pointer hover:text-blue-800"
                                onClick={() => setShowDialog(true)}
                            >
                                Select your grade level
                            </span>
                        </div>
                    ) : null}
                </div>
                {/* ^ top-16 to be placed under a navbar that is 64px tall */}
                <nav className="space-y-4">
                    <DashboardSidebarLink href="#" title="Profile" />
                    <DashboardSidebarLink
                        href="/create-story"
                        title="Create Story"
                    />
                    <DashboardSidebarLink
                        href="/my-stories"
                        title="My Stories"
                    />
                </nav>
            </aside>
            {showDialog && (
                <OnboardingDialog
                    open={showDialog}
                    onOnboarded={handleOnboarded}
                />
            )}
        </>
    );
};

export default Sidebar;
