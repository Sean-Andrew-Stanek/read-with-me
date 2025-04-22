import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="flex w-full h-screen font-literata text-xl">
            <Sidebar />
            <div className="flex-1 flex justify-center">{children}</div>
        </div>
    );
};

export default DashboardLayout;
