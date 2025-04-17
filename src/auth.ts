// import { Session } from 'next-auth';
// import NextAuth from 'next-auth';
// import Google from 'next-auth/providers/google';
// import { MongoDBAdapter } from '@auth/mongodb-adapter';
// import clientPromise from './lib/mongodb';
// import CredentialsProvider from 'next-auth/providers/credentials';

// const clientId = process.env.GOOGLE_CLIENT_ID;
// const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

// if (!clientId || !clientSecret) {
//     throw new Error(
//         'Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment'
//     );
// }

// export const { handlers, signIn, signOut, auth } = NextAuth({
//     adapter: MongoDBAdapter(clientPromise),
//     providers: [
//         Google({
//             clientId,
//             clientSecret
//         })
//     ],
//     callbacks: {
//         async session({ session }: { session: Session }) {
//             const client = await clientPromise;
//             const db = client.db('read-with-me');
//             const usersCollection = db.collection('users');

//             // Fetch user data using the default userId
//             const userData = await usersCollection.findOne({
//                 googleId: session.user.email
//             });

//             if (userData) {
//                 // Attach the uuid to the session object
//                 session.user.uuid = userData.uuid;
//                 session.user.isParent = userData.isParent;
//             } else {
//                 throw new Error('User data not found in database.');
//             }

//             return session;
//         }
//     }
// });
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './lib/mongodb';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
// import { compare } from 'bcryptjs';

const clientId = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId,
            clientSecret
        }),
        CredentialsProvider({
            name: 'Child login',
            credentials: {
                userName: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials) return null;

                const client = await clientPromise;
                const db = client.db();
                const user = await db.collection('childUsers').findOne({
                    userName: credentials?.userName
                });

                if (user && credentials?.password === user.password) {
                    return {
                        id: user._id.toString(),
                        name: user.userName,
                        uuid: user.uuid,
                        isParent: false
                    };
                }

                return null;
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, user }) {
            console.log(' JWT callback running:', user);
            console.log(' child token:', token);

            if (user) {
                token.uuid = user.uuid;
                token.isParent = user.isParent;
            }
            return token;
        },

        async session({ session, token }: { session: Session; token: JWT }) {
            console.log(' SESSION callback running:', session, token);

            const client = await clientPromise;
            const db = client.db('read-with-me');

            //  If the user is already in the token (from credentials), use it
            if (token?.uuid) {
                session.user.uuid = token.uuid as string;
                session.user.isParent = token.isParent as boolean;
                return session;
            }

            console.log('Session user:', session.user);

            //  If logging in via Google (no token.uuid), fetch user by email
            if (session.user?.email) {
                const userData = await db.collection('users').findOne({
                    googleId: session.user.email
                });
                console.log('userdata for google login:', userData);

                if (userData) {
                    session.user.uuid = userData.uuid;
                    session.user.isParent = userData.isParent;
                    return session;
                }
            }

            throw new Error('User data not found in session callback.');
        }
    }
});
