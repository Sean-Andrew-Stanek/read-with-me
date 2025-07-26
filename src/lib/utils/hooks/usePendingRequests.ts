'use client';
import { useCallback, useState } from 'react';

import { LinkRequest } from '@/lib/types/linkRequest';
import { toast } from 'sonner';
import { getRequestsUri, patchRequestsUri } from '@/config/apiUri';

export type usePendingrequestsTypes = {
    pendingRequests: LinkRequest[];
    fetchPendingRequests: () => Promise<void>;
    setPendingRequests: React.Dispatch<React.SetStateAction<LinkRequest[]>>;
    handleApprove: (token: string) => Promise<void>;
    handleReject: (token: string) => Promise<void>;
};

export const usePendingRequests = ({
    fetchChildren
}: {
    fetchChildren: () => Promise<void>;
}): usePendingrequestsTypes => {
    const [pendingRequests, setPendingRequests] = useState<LinkRequest[]>([]);

    const fetchPendingRequests = useCallback(async (): Promise<void> => {
        try {
            const res = await fetch(getRequestsUri());
            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Failed to approve request');
            }
            setPendingRequests(result);
        } catch {
            toast.error('Failed to load pending requests');
        }
    }, []);

    const handleApprove = async (token: string): Promise<void> => {
        try {
            const res = await fetch(patchRequestsUri(token), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved' })
            });

            // const data = await res.json();

            if (!res.ok) {
                throw new Error('Failed to approve request');
            }

            await fetchChildren();

            // update pending list
            toast.success('Request approved!');
            setPendingRequests(prev => prev.filter(req => req.token !== token));
        } catch {
            toast.error('Could not approve request');
        }
    };

    const handleReject = async (token: string): Promise<void> => {
        try {
            const res = await fetch(patchRequestsUri(token), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'rejected' })
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || 'Failed to reject request');
            }

            toast.success('Request rejected successfully');
            fetchPendingRequests();
        } catch {
            toast.error(`Failed to reject request`);
        }
    };

    return {
        fetchPendingRequests,
        pendingRequests,
        setPendingRequests,
        handleApprove,
        handleReject
    };
};
