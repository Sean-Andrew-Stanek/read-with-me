const baseApiUri =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const putUserGradeURI = (): string => `${baseApiUri}/user`;
const postNewStoryUri = (): string => `${baseApiUri}/story`;
const getUserDataUri = (uuid: string): string =>
    `${baseApiUri}/user?uuid=${uuid}`;
const getStoriesUri = (parentId?: string, childId?: string): string => {
    const params = new URLSearchParams();
    if (parentId) params.append('parentId', parentId);
    if (childId) params.append('childId', childId);
    return `${baseApiUri}/story?${params.toString()}`;
};

export { putUserGradeURI, postNewStoryUri, getUserDataUri, getStoriesUri };
