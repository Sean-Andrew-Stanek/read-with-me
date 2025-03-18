import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/auth';
import { sanitizeDoc } from '@/lib/utils';
import { ParentUser } from '@/lib/types/user';

export const POST = async (): Promise<NextResponse> => {
    const session = await auth();

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const googleId = session.user.email;
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    const existingUser = await users.findOne({ googleId }); // Check for existing user

    if (existingUser) {
        const safeUser = sanitizeDoc(existingUser);
        return NextResponse.json(
            { exists: true, user: safeUser },
            { status: 200 }
        );
    }

    const newUser: ParentUser = {
        googleId,
        uuid: uuidv4(),
        isParent: true,
        children: []
    };

    await users.insertOne(newUser);

    const safeUser = sanitizeDoc(newUser);
    return NextResponse.json(
        { created: true, user: safeUser },
        { status: 201 }
    );
};
