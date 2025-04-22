export const navLink: Record<string, string> = {
    home: '/',
    dashboard: '/home'
};

// Protected routes that require authentication
export const protectedRoutes: string[] = [
    '/home',
    '/create-story',
    '/my-stories'
];
