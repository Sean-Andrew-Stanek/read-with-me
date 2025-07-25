'use client';
import { useCallback, useState } from 'react';

import { LinkRequest } from '@/lib/types/linkRequest';
import { toast } from 'sonner';
export type usePendingrequestsTypes = {
    pendingRequests: LinkRequest[];
    fetchPendingRequests: () => Promise<void>;
    setPendingRequests: React.Dispatch<React.SetStateAction<LinkRequest[]>>;
};

export const usePendingRequests = (): usePendingrequestsTypes => {
    const [pendingRequests, setPendingRequests] = useState<LinkRequest[]>([]);

    const fetchPendingRequests = useCallback(async (): Promise<void> => {
        try {
            const res = await fetch('/api/requests');
            if (!res.ok) {
                throw new Error('Failed to fetch the data!');
            }
            const data = await res.json();
            setPendingRequests(data);
        } catch {
            toast.error('Failed to load pending requests');
        }
    }, []);

    return { fetchPendingRequests, pendingRequests, setPendingRequests };
};
