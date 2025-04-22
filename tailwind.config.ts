import type { Config } from 'tailwindcss';
const { defaultTheme } = require('tailwindcss/defaultTheme');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'literata': ['Literata', 'serif'],
        'literata-variable': ['Literata Variable', 'serif'], 
        // You can keep or remove the examples below based on your needs
        // sans: ['ui-sans-serif', 'system-ui', ...defaultTheme.fontFamily.sans],
        // serif: ['ui-serif', 'Georgia', ...defaultTheme.fontFamily.serif],
        // mono: ['ui-monospace', 'SFMono-Regular', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
export default config;