/**
 * Middleware function to handle protected routes redirection. It runs before the page loads.
 *
 * This middleware checks if the requested URL path is part of the protected routes
 * that require authentication. If the route is protected and there is no valid session
 * token in the request cookies, it redirects the user to the homepage ('/').
 *
 * It uses the session token stored in cookies to verify authentication. For production,
 * it checks for the '__Secure-next-auth.session-token'.
 *
 * Returns the next response if the route is not protected or if the session token is present.
 *
 * @param request - The incoming NextRequest object representing the HTTP request.
 * @returns NextResponse - The response to be sent back, either a redirect or the next response.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { protectedRoutes } from './config/navigation';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check the path to see if it matches with protected routes
    const isProtected = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    const token =
        // Check for the next-auth login cookie
        request.cookies.get('next-auth.session-token') ||
        request.cookies.get('__Secure-next-auth.session-token'); // for production

    if (isProtected && !token) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}
