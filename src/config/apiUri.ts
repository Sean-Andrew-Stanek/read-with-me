const baseApiUri =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const putUserGradeURI = (): string => `${baseApiUri}/grade`;
const postNewStoryUri = (): string => `${baseApiUri}/story`;
const getUserDataUri = (uuid: string): string =>
    `${baseApiUri}/user?uuid=${encodeURIComponent(uuid)}`;
const getStoriesUri = (parentId?: string, childId?: string): string => {
    const params = new URLSearchParams();
    if (parentId) params.append('parentId', parentId);
    if (childId) params.append('childId', childId);
    return `${baseApiUri}/story?${params.toString()}`;
};
const getStoryByIdUri = (id: string): string => `${baseApiUri}/story/${id}`;
const deleteStoryUri = (id: string): string => `${baseApiUri}/story/${id}`;

const getRequestsUri = (): string => `${baseApiUri}/requests`;
const patchRequestsUri = (token: string): string =>
    `${baseApiUri}/requests/${token}/status`;

const deleteChildUri = (): string => `${baseApiUri}/user/children`;
const postTokenUri = (): string => `${baseApiUri}/token`;
const getPendingRequests = (): string => `${baseApiUri}/requests/pending`;
export {
    putUserGradeURI,
    postNewStoryUri,
    getUserDataUri,
    getStoriesUri,
    getStoryByIdUri,
    deleteStoryUri,
    getRequestsUri,
    patchRequestsUri,
    deleteChildUri,
    postTokenUri,
    getPendingRequests
};
