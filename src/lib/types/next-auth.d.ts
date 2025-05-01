import { DefaultSession, DefaultUser, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            uuid: string;
            isParent: boolean;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            grade?: string | number | null;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        uuid: string;
        isParent: boolean;
        grade?: string | number | null;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        uuid: string;
        isParent: boolean;
        grade?: string | number | null;
    }
}
