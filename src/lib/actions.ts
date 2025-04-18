import { Story } from '@/lib/types/story';
import { ParentUser, ChildUser } from '@/lib/types/user';

const createStory = async (
    prompt: string,
    parentId?: string,
    childId?: string
): Promise<string> => {
    const response = await fetch('/api/story', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, parentId, childId })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate story.');
    }

    const data = await response.json();
    return data.story;
};

const fetchUserData = async (uuid: string): Promise<ParentUser | ChildUser> => {
    const response = await fetch(`/api/user/get?uuid=${uuid}`, {
        method: 'GET'
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user data.');
    }

    const data = await response.json();
    return data as ParentUser | ChildUser;
};

const fetchStories = async (
    parentId?: string,
    childId?: string
): Promise<Story[]> => {
    const params = new URLSearchParams();
    if (parentId) params.append('parentId', parentId);
    if (childId) params.append('childId', childId);

    const response = await fetch(`/api/story?${params.toString()}`, {
        method: 'GET'
    });

    if (response.status === 204) {
        return [];
    }
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch stories.');
    }

    const data = await response.json();
    if (!data || !Array.isArray(data.stories)) {
        throw new Error('Invalid response format or no stories found.');
    }
    return data.stories;
};

export { createStory, fetchUserData, fetchStories };
