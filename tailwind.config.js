import('tailwindcss').Config;

export const content = [
    // './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    // './pages/**/*.{js,ts,jsx,tsx,mdx}',
    // './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
]
export const theme = {
    extend: {
        fontFamily: {
            sans: ['var(--font-roboto)', ... fontFamily.sans], //Default font face
            literata: ['var(--font-literata)', fontFamily.serif], //Custom font face for reading material
        },
    },
}
export const plugins = []