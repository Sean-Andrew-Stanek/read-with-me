'use client';

import { FC } from 'react';
import Link from 'next/link';

const Sidebar: FC = () => {
    return (
        <aside className="w-64 h-screen bg-white border-r border-gray-200 top-16 left-0 z-40 p-4 shadow-sm">
            {/* ^ top-16 to be placed under a navbar that is 64px tall */}
            <nav className="space-y-4">
                <Link
                    href="#"
                    className="block text-gray-700 hover:text-red-500"
                >
                    Dashboard
                </Link>
                <Link
                    href="#"
                    className="block text-gray-700 hover:text-red-500"
                >
                    Create Story
                </Link>
                <Link
                    href="#"
                    className="block text-gray-700 hover:text-red-500"
                >
                    My Stories
                </Link>
                <Link
                    href="#"
                    className="block text-gray-700 hover:text-red-500"
                >
                    Settings
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;
