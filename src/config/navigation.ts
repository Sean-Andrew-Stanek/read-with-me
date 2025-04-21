export const navLink: Record<string, string> = {
    home: '/',
    dashboard: '/home'
};

// Protected routes that require authentication
export const protectedRoutes: string[] = [
    '/create-story',
    '/my-stories',
    '/dashboard'
];
