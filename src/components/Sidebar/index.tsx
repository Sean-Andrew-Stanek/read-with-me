'use client';

import { FC } from 'react';
import { useState } from 'react';
import DashboardSidebarLink from './DashboardSidebar';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import OnboardingDialog from '@/components/OnBoardingDialog';

const Sidebar: FC = () => {
    const { data: session } = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const grade = session?.user?.grade;

    const handleOnboarded = (): void => {
        setShowDialog(false);
    };

    console.log('Grade from session:', grade);
    return (
        <>
            <aside className="w-64 h-screen bg-white border-r border-gray-200 top-16 left-0 z-40 p-4 shadow-sm font-literata-variable font-semibold text-lg">
                <div className="flex items-center bg-gray justify-between mb-4">
                    {grade ? (
                        <span className="text-sm text-gray-500 ">
                            {session?.user?.name}'s grade level: {grade}
                        </span>
                    ) : (
                        <div className="text-sm">
                            <span className="text-xs text-gray-500 block">
                                {session?.user?.name}'s grade level:
                            </span>
                            <span
                                className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                                onClick={() => setShowDialog(true)}
                            >
                                Select your grade level
                            </span>
                        </div>
                    )}
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
