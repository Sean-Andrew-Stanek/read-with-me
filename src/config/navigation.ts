export const navLink: Record<string, string> = {
    home: '/',
    dashboard: '/home',
    story: '/create-story',
    storyList: '/my-stories'
};

// Protected routes that require authentication
export const protectedRoutes: string[] = [
    '/create-story',
    '/my-stories',
    '/home'
];
