'use client';

import { FC } from 'react';
import DashboardSidebarLink from './DashboardSidebar';
import { useSession } from 'next-auth/react';

const Sidebar: FC = () => {
    const { data: session } = useSession();

    const grade = session?.user?.grade;
    return (
        <aside className="w-64 h-screen bg-white border-r border-gray-200 top-16 left-0 z-40 p-4 shadow-sm font-literata-variable font-semibold text-lg">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                    {session?.user?.name}'s grade: {grade}
                </span>
            </div>
            {/* ^ top-16 to be placed under a navbar that is 64px tall */}
            <nav className="space-y-4">
                <DashboardSidebarLink href="#" title="Profile" />
                <DashboardSidebarLink
                    href="/create-story"
                    title="Create Story"
                />
                <DashboardSidebarLink href="/my-stories" title="My Stories" />
            </nav>
        </aside>
    );
};

export default Sidebar;
