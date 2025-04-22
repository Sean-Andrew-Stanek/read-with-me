import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './lib/mongodb';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

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
                if (!credentials) {
                    throw new Error('No credentials provided');
                }

                const client = await clientPromise;
                const db = client.db();
                const user = await db.collection('childUsers').findOne({
                    userName: credentials?.userName
                });

                if (!user) {
                    throw new Error('User not found');
                }

                if (
                    typeof credentials?.password !== 'string' ||
                    typeof user?.password !== 'string'
                ) {
                    throw new Error('Invalid input');
                }

                const isValidPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isValidPassword) {
                    throw new Error('Incorrect password');
                }
                return {
                    id: user._id.toString(),
                    name: user.userName,
                    uuid: user.uuid,
                    isParent: false
                };
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.uuid = user.uuid;
                token.isParent = user.isParent;
            }
            return token;
        },

        async session({ session, token }: { session: Session; token: JWT }) {
            const client = await clientPromise;
            const db = client.db('read-with-me');

            //  If the user is already in the token (from credentials), use it
            if (token?.uuid) {
                session.user.uuid = token.uuid as string;
                session.user.isParent = token.isParent as boolean;
                return session;
            }

            //  If logging in via Google (no token.uuid), fetch user by email
            if (session.user?.email) {
                const userData = await db.collection('users').findOne({
                    email: session.user.email
                });
                if (
                    userData &&
                    (!userData.uuid || userData.isParent === undefined)
                ) {
                    const newUuid = uuidv4();
                    await db.collection('users').updateOne(
                        { _id: userData._id },
                        {
                            $set: {
                                uuid: newUuid,
                                isParent: true,
                                children: [],
                                googleId: session.user.email
                            }
                        }
                    );
                    userData.uuid = newUuid;
                    userData.isParent = true;
                    userData.children = [];
                    userData.googleId = session.user.email;
                }

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
