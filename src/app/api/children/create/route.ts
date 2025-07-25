import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ParentUser } from "@/lib/types/user";

export const POST = async (request: Request): Promise<NextResponse> => {
    const session = await auth();

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parentEmail = session.user.email;
    const client = await clientPromise;
    const db = client.db();

    const usersCollection = db.collection<ParentUser>('users');
    const childUsersCollection = db.collection('childUsers');

    // Parse body
    const { username, password } = await request.json();

    if (!username || !password) {
        return NextResponse.json({ error: 'Missing username or password.' }, { status: 400 });
    }

    // Find parent in `users` collection
    const parentUser = await usersCollection.findOne({ email: parentEmail });

    if (!parentUser) {
        return NextResponse.json({ error: 'Parent user not found.' }, { status: 400 });
    }

    // Create child user
    const childUuid = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newChildUser = {
        userName: username,
        password: hashedPassword,
        uuid: childUuid,
        parentId: parentUser.uuid,
        isParent: false,
        createdAt: new Date(),
    };

    await childUsersCollection.insertOne(newChildUser);

    // Add child UUID to parent's children array
    await usersCollection.updateOne(
        { email: parentEmail },
        { $push: { children: childUuid } }
    );

    return NextResponse.json({ childUuid }, { status: 201 });
};
