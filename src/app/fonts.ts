import { Roboto, Literata } from "next/font/google";

export const roboto = Roboto({
    weight: ['400', '700' ],  //On watch
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});

export const literata = Literata({
    weight: ['400', '700' ],  //On watch
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-literata',
});