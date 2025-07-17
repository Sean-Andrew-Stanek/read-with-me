'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Eye, Lock, UserPlus, ArrowLeft, Link2 } from 'lucide-react';
import { JSX } from 'react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import LinkedChildren from '@/components/LinkedChildren';
import { useLinkedChildren } from '@/lib/utils/hooks/useLinkedChildren';

const IconBubble = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => (
    <div className="flex items-center justify-center size-10 rounded-full bg-yellow-400 text-white">
        {children}
    </div>
);

const ParentDashboard = (): JSX.Element => {
    const [viewChildOpen, setViewChildOpen] = useState<boolean>(false);
    const [tokenModalOpen, setTokenModalOpen] = useState(false);

    const { data: session } = useSession();
    const isParent = session?.user?.isParent;

    const { children, handleImpersonate, linkToken, handleGenerateToken } =
        useLinkedChildren();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#dbeafe] to-[#fce7f3] py-12 px-6">
            {/* <div className="text-center text-3xl font-bold text-gray-800">
                Parent Dashboard
            </div> */}
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
                {/* Sidebar with Instructions */}
                <aside className="lg:w-1/3 w-full bg-white/70 rounded-3xl p-6 shadow-lg text-gray-700 text-sm flex flex-col justify-center">
                    <p className="mb-2 font-semibold text-gray-800 text-base">
                        How to add a child:
                    </p>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>
                            Click &quot;Add a child&quot; to generate a link
                            token.
                        </li>
                        <li>Share the token with your child.</li>
                        <li>Your child will enter it on their profile page.</li>
                        <li>
                            Once linked, click &quot;View a child&quot; to view
                            their account.
                        </li>
                        <li>Your token expires in 30 minutes.</li>
                    </ol>
                </aside>
                {/**Main box with buttons */}
                <div className="flex-1 bg-white/50 backdrop-blur-md rounded-3xl shadow-lg p-10">
                    <div className="flex flex-col space-y-6 mt-6">
                        <div>
                            <Button
                                onClick={() => setViewChildOpen(true)}
                                className="w-full cursor-pointer h-auto flex justify-start items-center gap-4 text-lg font-semibold text-gray-700 bg-white/70 hover:bg-yellow-400 hover:text-white rounded-2xl py-4 px-6 transition duration-300 shadow-md backdrop-blur-md"
                            >
                                <IconBubble>
                                    <Eye className="size-7" />
                                </IconBubble>
                                View a child
                            </Button>
                        </div>

                        <div>
                            <Link href="#">
                                <Button className="w-full cursor-pointer h-auto flex justify-start items-center gap-4 text-lg font-semibold text-gray-700 bg-white/70 hover:bg-yellow-400 hover:text-white rounded-2xl py-4 px-6 transition duration-300 shadow-md backdrop-blur-md">
                                    <IconBubble>
                                        <Lock className="size-7" />
                                    </IconBubble>
                                    Add Restrictions
                                </Button>
                            </Link>
                        </div>
                        <div>
                            <Button
                                onClick={() => setTokenModalOpen(true)}
                                className="w-full cursor-pointer h-auto flex justify-start items-center gap-4 text-lg font-semibold text-gray-700 bg-white/70 hover:bg-yellow-400 hover:text-white rounded-2xl py-4 px-6 transition duration-300 shadow-md backdrop-blur-md"
                            >
                                <IconBubble>
                                    <UserPlus className="size-7" />
                                </IconBubble>
                                Add a child
                            </Button>
                        </div>

                        <div>
                            <Link href="/home">
                                <Button className="w-full cursor-pointer h-auto flex justify-start items-center gap-4 text-lg font-semibold text-gray-700 bg-white/70 hover:bg-yellow-400 hover:text-white rounded-2xl py-4 px-6 transition duration-300 shadow-md backdrop-blur-md">
                                    <IconBubble>
                                        <ArrowLeft className="size-7" />
                                    </IconBubble>
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
                {/**Modal for linked children */}
                <Dialog open={viewChildOpen} onOpenChange={setViewChildOpen}>
                    <DialogContent className="max-w-md [&>button]:cursor-pointer">
                        <DialogTitle className="sr-only">
                            Linked children
                        </DialogTitle>

                        {isParent && (
                            <LinkedChildren
                                onImpersonate={handleImpersonate}
                                childrenList={children ?? []}
                            />
                        )}
                    </DialogContent>
                </Dialog>
                {/**Modal for Generating Token */}
                <Dialog open={tokenModalOpen} onOpenChange={setTokenModalOpen}>
                    <DialogContent className="max-w-md [&>button]:cursor-pointer">
                        <DialogTitle className="sr-only">
                            Generate Token
                        </DialogTitle>
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
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ParentDashboard;
