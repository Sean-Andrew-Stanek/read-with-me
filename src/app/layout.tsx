import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import Navbar from '@/components/Navbar';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

export const metadata: Metadata = {
    title: 'Read With Me',
    description: ''
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html lang="en">
            <body
                className="font-literata antialiased"
            >
                <SessionProvider>
                    <Navbar />
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
};

export default RootLayout;
