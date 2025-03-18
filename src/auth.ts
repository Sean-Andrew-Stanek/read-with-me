import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './lib/mongodb';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
    throw new Error(
        'Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment'
    );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        Google({
            clientId,
            clientSecret
        })
    ]
});
