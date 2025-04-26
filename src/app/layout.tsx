import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Literata } from "next/font/google"

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
            <body
                className={literata.className}
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
