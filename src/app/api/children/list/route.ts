import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const GET = async (): Promise<NextResponse> => {
    const session = await auth();

    //This allows testing with Postman without setting up auth - disable the above session declaration to use this. 
    // const session = {
    //     user: {
    //         email: 'parent's gmail address'
    //     }
    // };

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Find the parent
    const parent = await db.collection('users').findOne({
        googleId: session.user.email,
    });

    if (!parent || !Array.isArray(parent.children)) {
        return NextResponse.json({ children: [] });
    }

    // Get children from the childUsers
    const children = await db
        .collection('childUsers')
        .find({ uuid: { $in: parent.children } })
        .project({ uuid: 1, userName: 1 })
        .toArray();

    return NextResponse.json({ children });
}
