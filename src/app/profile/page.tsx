'use client';

import { useState } from 'react';
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

const Profile: React.FC = () => {
    const { data: session } = useSession();
    const [showTokenDialog, setShowTokenDialog] = useState(false);

    const { children, handleImpersonate, linkToken, handleGenerateToken } =
        useLinkedChildren();

    const isParent = session?.user?.isParent;

    return (
        <div className="flex justify-center items-start p-6">
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
                    <p className="mt-3 sm:text-lg text-md font-medium text-gray-800">
                        {session?.user.name}
                    </p>
                </div>
                {!isParent && (
                    <div className="mt-4 text-sm text-gray-700">
                        <p className="mb-2">Haven’t linked to a parent yet?</p>
                        <button
                            onClick={() => setShowTokenDialog(true)}
                            className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
                        >
                            Enter Parent Token
                        </button>
                    </div>
                )}

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
                {!isParent && (
                    <div className="mt-4 flex justify-center ">
                        <EnterTokenDialog
                            open={showTokenDialog}
                            onClose={() => setShowTokenDialog(false)}
                            onLinked={() => {
                                setShowTokenDialog(false);
                                toast.success(
                                    'Linked successfully! You are now linked to your parent account.',
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

                <div className="mt-8">
                    <Link href="/home">
                        <Button
                            variant="default"
                            className="bg-indigo-400 hover:bg-indigo-600 text-white cursor-pointer"
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
