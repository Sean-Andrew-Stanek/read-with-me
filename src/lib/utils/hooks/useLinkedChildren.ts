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
};

export const useLinkedChildren = () => {
    const { data: session } = useSession();
    const isParent = session?.user?.isParent;

    const [children, setChildren] = useState<ChildUserWithName[]>([]);

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

                        if (
                            child.parentLinkExpiresAt &&
                            new Date(child.parentLinkExpiresAt) < new Date()
                        ) {
                            await fetch('/api/user/children', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ childUuid: child.uuid })
                            });

                            return null;
                        }

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
            toast.success(`Logged in as ${childName}`);
            await signIn('credentials', {
                redirect: true,
                callbackUrl: '/home',
                trigger: 'impersonate',
                impersonateUuid: childUuid
            });
        } catch {
            toast.error('Failed to impersonate child');
        }
    };

    return { children, fetchChildren, handleImpersonate };
};
