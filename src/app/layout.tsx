import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';
import { roboto, literata } from './fonts';


export const metadata: Metadata = {
    title: 'Read With Me',
    description: '',
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html lang="en">
            <body 
                className={`${literata.variable} ${roboto.variable} p-0 m-0 font-sans bg-gradient-to-b from-blue-100 to-red-100 min-h-screen`}
                style={{fontFamily:'var(--font-roboto)'}}
            >
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
