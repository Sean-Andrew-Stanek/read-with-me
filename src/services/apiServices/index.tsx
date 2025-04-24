import {
    postNewStoryUri,
    putUserGradeURI,
    getUserDataUri,
    getStoriesUri
} from '@/config/apiUri';
import { Story } from '@/lib/types/story';
import { ChildUser, ParentUser } from '@/lib/types/user';

// const putUserGrade = async (grade: string, uuid: string): Promise<void> => {
//     try {
//         await fetch(putUserGradeURI(), {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 uuid,
//                 grade
//             })
//         });
//     } catch (error) {
//         throw new Error(`Failed to save grade: ${error}`);
//     }
// };

const putUserGrade = async (grade: string | number): Promise<void> => {
    try {
        await fetch(putUserGradeURI(), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grade
            })
        });
    } catch (error) {
        throw new Error(`Failed to save grade: ${error}`);
    }
};

const postNewStory = async (
    prompt: string,
    // parentId?: string | null,
    // childId?: string | null,
    grade?: string | number
): Promise<string> => {
    const response = await fetch(postNewStoryUri(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, grade })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate story.');
    }

    const data = await response.json();
    return data.story;
};

// const getUserData = async (uuid: string): Promise<ParentUser | ChildUser> => {
//     const response = await fetch(getUserDataUri(uuid), {
//         method: 'GET'
//     });

//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch user data.');
//     }

//     const data = await response.json();
//     return data as ParentUser | ChildUser;
// };
const getUserData = async (): Promise<ParentUser | ChildUser> => {
    const response = await fetch(getUserDataUri(), {
        method: 'GET'
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user data.');
    }

    const data = await response.json();
    return data as ParentUser | ChildUser;
};

const getStories = async () // parentId?: string,
// childId?: string
: Promise<Story[]> => {
    // const params = new URLSearchParams();
    // if (childId && parentId)
    //     return Promise.reject('Both parentId and childId cannot be provided.');

    // if (parentId) params.append('parentId', parentId);
    // if (childId) params.append('childId', childId);

    const response = await fetch(getStoriesUri(), {
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

export { postNewStory, getUserData, getStories, putUserGrade };
