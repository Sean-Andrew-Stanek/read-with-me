/**
 * This component is a higher order component that wraps a page component
 * and makes sure that the page is only accessible to authenticated users.
 *
 * It uses the useSession hook from next-auth to get the current session
 * and check if the user is authenticated. If the user is not authenticated,
 * it will redirect the user to the root path ('/').
 *
 * @param {React.ReactNode} children The page component to wrap.
 * @returns {React.ReactNode} The wrapped page component.
 */

'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ProtectedPageProps {
    children: React.ReactNode;
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            alert('You must be logged in to access this page.');
            router.push('/');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return <>{children}</>;
};
export default ProtectedPage;
