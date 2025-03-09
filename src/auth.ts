import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

// Initialize NextAuth with Google as an authentication provider
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google]
});
