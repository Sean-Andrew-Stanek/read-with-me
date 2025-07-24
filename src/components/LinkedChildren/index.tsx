'use client';

import { JSX } from 'react';
import { grades } from '@/lib/constants/grades';
import { ChildUser } from '@/lib/types/user';

type ChildUserWithName = ChildUser & { userName: string };

type LinkedChildrenProps = {
    childrenList: ChildUserWithName[];
    onImpersonate?: (uuid: string, name: string) => void;
    onDelete?: (uuid: string, name: string) => void;
    mode?: 'view' | 'delete';
};
const LinkedChildren = ({
    childrenList,
    onImpersonate,
    onDelete,
    mode
}: LinkedChildrenProps): JSX.Element => {
    return (
        <div className="w-full text-md text-gray-700">
            <p className="font-semibold text-md mb-1">Linked Children:</p>
            {childrenList.length === 0 ? (
                <p>No children linked yet.</p>
            ) : (
                <ul className=" w-full space-y-1">
                    {childrenList.map(child => (
                        <li
                            key={child.uuid}
                            className="flex justify-between items-center"
                        >
                            <span>{child.userName}</span>
                            <span className="text-gray-500 text-xs ml-2">
                                Grade:{' '}
                                {grades[child.grade as keyof typeof grades] ??
                                    'Not set'}
                            </span>

                            {mode === 'delete' ? (
                                <button
                                    className="text-sm text-red-500 hover:underline cursor-pointer"
                                    onClick={() =>
                                        onDelete?.(child.uuid, child.userName)
                                    }
                                >
                                    Delete
                                </button>
                            ) : (
                                <button
                                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                                    onClick={() =>
                                        onImpersonate?.(
                                            child.uuid,
                                            child.userName
                                        )
                                    }
                                >
                                    Log in as {child.userName}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default LinkedChildren;
