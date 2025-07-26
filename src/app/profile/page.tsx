'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Link2, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import UserDropdown from '@/components/Sidebar/UserDropdown';
import EnterTokenDialog from '@/components/EnterTokenDialog';
import LinkedChildren from '@/components/LinkedChildren';
import { useLinkedChildren } from '@/lib/utils/hooks/useLinkedChildren';
import { usePendingRequests } from '@/lib/utils/hooks/usePendingRequests';

const Profile: React.FC = () => {
    const { data: session } = useSession();
    const [showTokenDialog, setShowTokenDialog] = useState(false);
    const [pendingSubmitted, setPendingSubmitted] = useState(false);

    const {
        children,
        handleImpersonate,
        linkToken,
        handleGenerateToken,
        fetchChildren
    } = useLinkedChildren();
    const { fetchPendingRequests, pendingRequests, handleApprove } =
        usePendingRequests({ fetchChildren });

    const isParent = session?.user?.isParent;
    const isLinkedChild = !isParent && !!session?.user?.parentId;
    useEffect(() => {
        if (isParent === true) {
            fetchPendingRequests();
        }
    }, [isParent, fetchPendingRequests]);

    useEffect(() => {
        if (!isParent && !isLinkedChild) {
            // Only check if child is not yet linked
            fetch('/api/requests/pending')
                .then(res => res.json())
                .then(data => {
                    if (data.pending) setPendingSubmitted(true);
                })
                .catch(() => {
                    console.error('Failed to fetch pending request status');
                });
        }
    }, [isParent, isLinkedChild]);

    if (typeof isParent !== 'boolean') {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex justify-center items-start p-6">
            {/* <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-md p-8 flex flex-col items-center"> */}
            <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-md p-8">
                <div className="flex flex-col items-center">
                    <div className="relative w-30 h-30 rounded-xl overflow-hidden bg-white p-1 mt-2">
                        <Image
                            src="/profile.png"
                            width={120}
                            height={120}
                            priority
                            alt="Picture of the user"
                            className="rounded-xl p-0"
                        />
                        <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                            <UserDropdown />
                        </div>
                    </div>
                    <p className="mt-3 sm:text-lg text-md font-medium text-gray-800 mb-7">
                        {session?.user.name}
                    </p>
                </div>

                {/* {!isParent ? (
                    !isLinkedChild ? (
                        <div className="mt-4 w-full text-center text-lg text-gray-700">
                            <p className="mb-4">
                                Haven’t linked to a parent yet?
                            </p>
                            <button
                                onClick={() => setShowTokenDialog(true)}
                                className="text-xl text-blue-600 underline hover:text-blue-800 cursor-pointer"
                            >
                                Enter Parent Token
                            </button>
                        </div>
                    ) : (
                        <p className="mt-4 text-center text-green-700 font-medium">
                            You are already linked to your parent account!
                        </p>
                    )
                ) : null} */}
                {!isParent ? (
                    isLinkedChild ? (
                        <p className="mt-4 text-center text-green-700 font-medium">
                            You are already linked to your parent account!
                        </p>
                    ) : pendingSubmitted ? (
                        <p className="mt-4 text-center text-yellow-700 font-medium">
                            Your parent has received the request. Please wait
                            for them to approve.
                        </p>
                    ) : (
                        <div className="mt-4 w-full text-center text-lg text-gray-700">
                            <p className="mb-4">
                                Haven’t linked to a parent yet?
                            </p>
                            <button
                                onClick={() => setShowTokenDialog(true)}
                                className="text-xl text-blue-600 underline hover:text-blue-800 cursor-pointer"
                            >
                                Enter Parent Token
                            </button>
                        </div>
                    )
                ) : null}

                {/* Parent View – Linked Children */}
                {isParent && session?.user?.uuid && (
                    <div className="mt-6 ">
                        <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
                            <LinkedChildren
                                childrenList={children}
                                onImpersonate={handleImpersonate}
                            />
                        </div>
                        <div className="mt-4 flex justify-center ">
                            <Button
                                onClick={handleGenerateToken}
                                variant="outline"
                                className="gap-2 cursor-pointer justify-center"
                            >
                                <Link2 className="h-4 w-4" />
                                Generate Link Token
                            </Button>
                        </div>
                        {linkToken && (
                            <div className="text-center mt-2 p-3 bg-gray-100 border rounded font-mono text-sm">
                                Share this token: <strong>{linkToken}</strong>
                            </div>
                        )}
                    </div>
                )}
                {pendingRequests.length > 0 && (
                    <div className="mt-6 w-full bg-yellow-50 border border-yellow-300 rounded-xl p-4 shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">
                            Pending Requests:
                        </h3>
                        <ul className="space-y-2">
                            {pendingRequests.map(req => (
                                <li
                                    key={req.childId}
                                    className="flex justify-between items-center"
                                >
                                    <span>{req.childName}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                req.token &&
                                                handleApprove(req.token)
                                            }
                                            className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded cursor-pointer"
                                        >
                                            Approve
                                        </button>
                                        <button className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded cursor-pointer">
                                            Reject
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {!isParent && (
                    <div className="mt-4 flex justify-center ">
                        <EnterTokenDialog
                            open={showTokenDialog}
                            onClose={() => setShowTokenDialog(false)}
                            onLinked={() => {
                                setShowTokenDialog(false);
                                setPendingSubmitted(true);
                                toast.success(
                                    'Request was sent successfuly, wait for your parent to approve!',
                                    {
                                        icon: (
                                            <Check className="h-5 w-5 text-green-500" />
                                        ),

                                        style: {
                                            color: 'rgb(22 163 74)',
                                            borderColor: 'rgb(134 239 172)'
                                        }
                                    }
                                );
                            }}
                        />
                    </div>
                )}

                <div className=" flex justify-center mt-8">
                    <Link href="/home">
                        <Button
                            variant="default"
                            className="bg-indigo-400 hover:bg-indigo-600 text-white cursor-pointer mb-4"
                        >
                            Return Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;
