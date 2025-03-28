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
    ],
    callbacks: {
        async session({ session, token }) {
            const client = await clientPromise;
            const db = client.db('read-with-me');
            const usersCollection = db.collection('users');

            // Fetch user data using the default userId
            const userData = await usersCollection.findOne({
                googleId: session.user.email
            });

            if (userData) {
                // Attach the uuid to the session object
                session.user.uuid = userData.uuid;
                session.user.isParent = userData.isParent;
            }

            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // Store the NextAuth userId
            }
            return token;
        }
    }
});
