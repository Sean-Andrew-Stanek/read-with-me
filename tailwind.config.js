import('tailwindcss').Config;
// import { fontFamily } from 'tailwindcss/defaultTheme';
import defaultTheme from 'tailwindcss/defaultTheme';


export const content = [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
]
export const theme = {
    extend: {
        fontFamily: {
            sans: ['var(--font-roboto)', ...defaultTheme.fontFamily.sans], //Default font face
            literata: ['var(--font-literata)', ...defaultTheme.fontFamily.serif], //Custom font face for reading material
        },
    },
}
export const plugins = []