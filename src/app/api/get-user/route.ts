import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const GET = async (req: Request): Promise<Response> => {
    try {
        const { searchParams } = new URL(req.url);
        const uuid = searchParams.get('uuid');

        if (!uuid) {
            return NextResponse.json(
                { error: 'UUID is required' },
                { status: 400 }
            );
        }

        console.log('Fetching user with uuid:', uuid);

        const client = await clientPromise;
        const db = client.db('read-with-me');
        const usersCollection = db.collection('users');

        // Find the user by their UUID
        const user = await usersCollection.findOne({ uuid });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const parentId = user.isParent ? user.uuid : user.parentId || null;
        const children = user.children || null;

        console.log('User Data Retrieved:', { parentId, children });

        return NextResponse.json({ parentId, children }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching user data:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
