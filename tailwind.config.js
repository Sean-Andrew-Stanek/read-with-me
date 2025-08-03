import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-roboto)', ...defaultTheme.fontFamily.sans], //Default font face
                literata: ['var(--font-literata)', ...defaultTheme.fontFamily.serif], //Custom font face for reading material
            },
        },
    },
    plugins: []
};

export default config;