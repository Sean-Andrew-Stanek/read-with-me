// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import { MongoDBAdapter } from '@auth/mongodb-adapter';
// import clientPromise from './lib/mongodb';
// import { Session } from 'next-auth';
// import { JWT } from 'next-auth/jwt';
// import { v4 as uuidv4 } from 'uuid';
// import bcrypt from 'bcryptjs';

// const clientId = process.env.GOOGLE_CLIENT_ID!;
// const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

// export const { auth, handlers, signIn, signOut } = NextAuth({
//     adapter: MongoDBAdapter(clientPromise),
//     providers: [
//         GoogleProvider({
//             clientId,
//             clientSecret
//         }),
//         CredentialsProvider({
//             name: 'Child login',
//             credentials: {
//                 userName: { label: 'Username', type: 'text' },
//                 password: { label: 'Password', type: 'password' }
//             },
//             async authorize(credentials) {
//                 if (!credentials) {
//                     throw new Error('No credentials provided');
//                 }

//                 const client = await clientPromise;
//                 const db = client.db();
//                 const user = await db.collection('childUsers').findOne({
//                     userName: credentials?.userName
//                 });

//                 if (!user) {
//                     throw new Error('User not found');
//                 }

//                 if (
//                     typeof credentials?.password !== 'string' ||
//                     typeof user?.password !== 'string'
//                 ) {
//                     throw new Error('Invalid input');
//                 }

//                 const isValidPassword = await bcrypt.compare(
//                     credentials.password,
//                     user.password
//                 );

//                 if (!isValidPassword) {
//                     throw new Error('Incorrect password');
//                 }
//                 return {
//                     id: user._id.toString(),
//                     name: user.userName,
//                     uuid: user.uuid,
//                     isParent: false,
//                     grade: user.grade
//                 };
//             }
//         })
//     ],
//     session: {
//         strategy: 'jwt'
//     },
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.uuid = user.uuid;
//                 token.isParent = user.isParent;
//                 token.grade = user.grade;
//             }

//             return token;
//         },

//         async session({ session, token }: { session: Session; token: JWT }) {
//             const client = await clientPromise;
//             const db = client.db('read-with-me');

//             //  If the user is already in the token (from credentials), use it
//             if (token?.uuid) {
//                 //  fetch the latest user from the DB using uuid
//                 const user = await db
//                     .collection('childUsers')
//                     .findOne({ uuid: token.uuid });
//                 if (user) {
//                     session.user.uuid = token.uuid as string;
//                     session.user.isParent = token.isParent as boolean;
//                     session.user.grade = user.grade as string | number | null;
//                     return session;
//                 }
//             }

//             //  If logging in via Google (no token.uuid), fetch user by email
//             if (session.user?.email) {
//                 const userData = await db.collection('users').findOne({
//                     email: session.user.email
//                 });
//                 if (
//                     userData &&
//                     (!userData.uuid || userData.isParent === undefined)
//                 ) {
//                     const newUuid = uuidv4();
//                     await db.collection('users').updateOne(
//                         { _id: userData._id },
//                         {
//                             $set: {
//                                 uuid: newUuid,
//                                 isParent: true,
//                                 children: [],
//                                 googleId: session.user.email
//                             }
//                         }
//                     );
//                     userData.uuid = newUuid;
//                     userData.isParent = true;
//                     userData.children = [];
//                     userData.googleId = session.user.email;
//                 }

//                 if (userData) {
//                     session.user.uuid = userData.uuid;
//                     session.user.isParent = userData.isParent;
//                     session.user.grade = userData.grade;
//                     return session;
//                 }
//             }

//             throw new Error('User data not found in session callback.');
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
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

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
                const {
                    trigger,
                    impersonateUuid,
                    userName,
                    password,
                    realUserUuid
                } = credentials as {
                    trigger?: string;
                    impersonateUuid?: string;
                    userName?: string;
                    password?: string;
                    realUserUuid: string;
                };

                // Handle impersonation
                if (trigger === 'impersonate' && impersonateUuid) {
                    const client = await clientPromise;
                    const db = client.db('read-with-me');

                    const child = await db
                        .collection('childUsers')
                        .findOne({ uuid: impersonateUuid });

                    if (!child) {
                        throw new Error('Impersonated child not found');
                    }

                    return {
                        id: child._id.toString(),
                        name: child.userName,
                        uuid: child.uuid,
                        isParent: false,
                        grade: child.grade,
                        trigger: 'impersonate',
                        // impersonateUuid: child.uuid,
                        impersonating: true,
                        realUserUuid
                    };
                }

                // Handle stop impersonating
                if (trigger === 'stop-impersonating' && realUserUuid) {
                    const client = await clientPromise;
                    const db = client.db('read-with-me');

                    const parent = await db
                        .collection('users')
                        .findOne({ uuid: realUserUuid });

                    if (!parent) throw new Error('Original parent not found');

                    return {
                        id: parent._id.toString(),
                        name: parent.name,
                        uuid: parent.uuid,
                        isParent: true,
                        impersonating: false,
                        grade: parent.grade,
                        email: parent.email
                    };
                }

                //  Handle normal credential login
                if (!userName || !password) {
                    throw new Error('Missing credentials');
                }

                const client = await clientPromise;
                const db = client.db();
                const user = await db
                    .collection('childUsers')
                    .findOne({ userName });

                if (!user) {
                    throw new Error('User not found');
                }

                const isValidPassword = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isValidPassword) {
                    throw new Error('Incorrect password');
                }

                return {
                    id: user._id.toString(),
                    name: user.userName,
                    uuid: user.uuid,
                    isParent: false,
                    grade: user.grade,
                    impersonating: false,
                    realUserUuid: undefined
                };
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, user }) {
            // handle impersonating
            if (user?.impersonating === true) {
                return {
                    ...token,
                    uuid: user.uuid,
                    isParent: false,
                    impersonating: true,
                    realUserUuid: user.realUserUuid
                };
            }

            // Handle stop impersonating
            if (user?.impersonating === false) {
                return {
                    ...token,
                    uuid: user.uuid,
                    isParent: true,
                    impersonating: false,
                    realUserUuid: undefined,
                    grade: user.grade,
                    name: user.name,
                    email: user.email
                };
            }

            // Standard login
            if (user) {
                token.uuid = user.uuid;
                token.isParent = user.isParent;
                token.grade = user.grade;
                token.impersonating = false;
                token.realUserUuid = undefined;
            }

            return token;
        },

        async session({ session, token }: { session: Session; token: JWT }) {
            const client = await clientPromise;
            const db = client.db('read-with-me');

            //  If the user is already in the token (from credentials), use it
            if (token?.uuid) {
                // First check if this is a child
                const child = await db
                    .collection('childUsers')
                    .findOne({ uuid: token.uuid });
                if (child) {
                    session.user.uuid = child.uuid;
                    session.user.isParent = false;
                    session.user.grade = child.grade;
                    session.user.impersonating = token.impersonating || false;
                    session.user.realUserUuid = token.realUserUuid || undefined;
                    session.user.parentId = child.parentId ?? null;
                    return session;
                }

                // Then check if this is a parent
                const parent = await db
                    .collection('users')
                    .findOne({ uuid: token.uuid });
                if (parent) {
                    session.user.uuid = parent.uuid;
                    session.user.isParent = true;
                    session.user.grade = parent.grade;
                    session.user.name = parent.name;
                    session.user.email = parent.email;
                    session.user.impersonating = token.impersonating || false;
                    session.user.realUserUuid = token.realUserUuid || undefined;
                    return session;
                }
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
                    session.user.grade = userData.grade;
                    session.user.impersonating = token.impersonating || false;
                    session.user.realUserUuid = token.realUserUuid || undefined;
                    return session;
                }
            }

            throw new Error('User data not found in session callback.');
        }
    }
});
