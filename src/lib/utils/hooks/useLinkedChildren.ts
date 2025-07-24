import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ChildUser } from '@/lib/types/user';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';

export type ChildUserWithName = ChildUser & { userName: string };

type UseLinkedChildrenReturn = {
    children: ChildUserWithName[];
    fetchChildren: () => Promise<void>;
    handleImpersonate: (uuid: string, name: string) => Promise<void>;
    handleGenerateToken: () => Promise<void>;
    handleDeleteChild: (uuid: string, name: string) => Promise<void>;
    linkToken: string | null;
};

export const useLinkedChildren = (): UseLinkedChildrenReturn => {
    const { data: session } = useSession();
    const isParent = session?.user?.isParent;

    const [children, setChildren] = useState<ChildUserWithName[]>([]);
    const [linkToken, setLinkToken] = useState<string | null>(null);

    const fetchChildren = useCallback(async (): Promise<void> => {
        if (isParent && session?.user?.uuid) {
            const res = await fetch(`/api/user?uuid=${session.user.uuid}`);
            const data = await res.json();

            if (data.children?.length > 0) {
                const childDetails = await Promise.all(
                    data.children.map(async (childUuid: string) => {
                        const res = await fetch(`/api/user?uuid=${childUuid}`);
                        if (!res.ok) return null;
                        const child = await res.json();

                        // if (
                        //     child.parentLinkExpiresAt &&
                        //     new Date(child.parentLinkExpiresAt) < new Date()
                        // ) {
                        //     await fetch('/api/user/children', {
                        //         method: 'DELETE',
                        //         headers: { 'Content-Type': 'application/json' },
                        //         body: JSON.stringify({ childUuid: child.uuid })
                        //     });

                        //     return null;
                        // }

                        return child;
                    })
                );
                setChildren(childDetails.filter(Boolean));
            } else {
                setChildren([]);
            }
        }
    }, [isParent, session?.user?.uuid]);

    useEffect(() => {
        fetchChildren();
    }, [fetchChildren]);

    const handleImpersonate = async (
        childUuid: string,
        childName: string
    ): Promise<void> => {
        try {
            toast.success(`Logged in as ${childName}`, {
                style: {
                    color: 'rgb(22 163 74)',
                    borderColor: 'rgb(134 239 172)'
                }
            });
            await signIn('credentials', {
                redirect: true,
                callbackUrl: '/home',
                trigger: 'impersonate',
                impersonateUuid: childUuid,
                realUserUuid: session?.user?.uuid // parent uuid to let them return to their dash
            });
        } catch {
            toast.error('Failed to impersonate child');
        }
    };

    const handleGenerateToken = async (): Promise<void> => {
        try {
            const res = await fetch('api/token', { method: 'POST' });
            const data = await res.json();

            if (res.ok && data.token) {
                setLinkToken(data.token);
                toast.success('Token generated!', {
                    style: {
                        color: 'rgb(22 163 74)',
                        borderColor: 'rgb(134 239 172)'
                    }
                });
            } else {
                toast.error(data.error || 'Failed to generate token!');
            }
        } catch {
            toast.error('Something went wrong.');
        }
    };

    const handleDeleteChild = async (
        uuid: string,
        name: string
    ): Promise<void> => {
        const confirmed = confirm(`Are you sure you want to delete ${name}?`);
        if (!confirmed) return;

        const res = await fetch('/api/user/children', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ childUuid: uuid })
        });

        if (res.ok) {
            toast.success(`${name} has been deleted`);
            await fetchChildren(); // refresh list
        } else {
            const data = await res.json();
            toast.error(data.error || 'Failed to delete child');
        }
    };

    return {
        children,
        fetchChildren,
        handleImpersonate,
        handleGenerateToken,
        handleDeleteChild,
        linkToken
    };
};
