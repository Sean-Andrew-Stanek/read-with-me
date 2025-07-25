'use client';
import { useCallback, useEffect, useState } from 'react';

import { LinkRequest } from '@/lib/linkRequest';
import { toast } from 'sonner';

export const usePendingRequests = () => {
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
