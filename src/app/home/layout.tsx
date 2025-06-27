'use client';
import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="flex w-full min-h-screen">
            <Sidebar />
            <div className="flex-1 flex justify-center">{children}</div>
        </div>
    );
};

export default DashboardLayout;
