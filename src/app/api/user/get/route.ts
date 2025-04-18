// import { NextResponse } from 'next/server';
// import clientPromise from '@/lib/mongodb';

// export const GET = async (req: Request): Promise<Response> => {
//     try {
//         const { searchParams } = new URL(req.url);
//         const uuid = searchParams.get('uuid');

//         if (!uuid) {
//             return NextResponse.json(
//                 { error: 'UUID is required' },
//                 { status: 400 }
//             );
//         }

//         const client = await clientPromise;
//         const db = client.db('read-with-me');
//         const usersCollection = db.collection('users');
//         const childUsersCollection = db.collection('childUsers');

//         // Find the user by their UUID
//         // const user = await usersCollection.findOne({ uuid });
//         let user = await usersCollection.findOne({ uuid });
//         let type = 'parent';

//         if (!user) {
//             user = await childUsersCollection.findOne({ uuid });
//             type = 'child';
//         }

//         if (!user) {
//             return NextResponse.json(
//                 { error: 'User not found' },
//                 { status: 404 }
//             );
//         }

//         const parentId = user.isParent ? user.uuid : user.parentId || null;
//         const children = user.children || null;

//         return NextResponse.json({ type, parentId, children }, { status: 200 });
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             return NextResponse.json({ error: error.message }, { status: 500 });
//         }
//         return NextResponse.json(
//             { error: 'An unknown error occurred.' },
//             { status: 500 }
//         );
//     }
// };
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

        const client = await clientPromise;
        const db = client.db('read-with-me');
        // const usersCollection = db.collection('users');

        // Find the user by their UUID
        // const user = await usersCollection.findOne({ uuid });
        const user =
            (await db.collection('users').findOne({ uuid })) ??
            (await db.collection('childUsers').findOne({ uuid }));

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const parentId = user.isParent ? user.uuid : user.parentId || null;
        const children = user.children || null;

        return NextResponse.json(
            {
                parentId,
                children,
                userName: user.userName,
                grade: user.grade ?? null,
                googleId: user.googleId ?? null,
                email: user.email ?? null
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(
            { error: 'An unknown error occurred.' },
            { status: 500 }
        );
    }
};
