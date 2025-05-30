import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Literata } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const literata = Literata({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
    title: 'Read With Me',
    description: ''
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html lang="en">
            <body className={`${literata.className} bg-gradient-to-b from-blue-100 to-red-100`}>
                <SessionProvider>
                    <Navbar />
                    {children}
                    <Toaster />
                </SessionProvider>
            </body>
        </html>
    );
};

export default RootLayout;
