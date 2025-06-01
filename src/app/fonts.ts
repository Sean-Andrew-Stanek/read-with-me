import { Roboto, Literata } from "next/font/google";

export const roboto = Roboto({
    weight: ['300', '400', '500', '600', '700', '800', '900' ],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});

export const literata = Literata({
    weight: ['300', '400', '500', '600', '700', '800', '900' ],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-literata',
});