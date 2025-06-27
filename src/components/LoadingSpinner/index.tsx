'use client';

import Image from 'next/image';
import { JSX } from 'react';

const LoadingSpinner = (): JSX.Element => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <Image
                src="/loading.gif"
                alt="Loading..."
                width={100}
                height={100}
                priority
                unoptimized
            />
        </div>
    );
};

export default LoadingSpinner;
