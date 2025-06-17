import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { protectedRoutes } from '@/config/navigation';
import { navLink } from '@/config/navigation';
export async function middleware(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl;

    // Check the path to see if it matches with protected routes
    // const isProtected = protectedRoutes.some(route =>
    //     pathname.startsWith(route)
    // );
    const isProtected = protectedRoutes.some(
        route => pathname === route || pathname.startsWith(route + '/')
    );

    // Get cookie value
    const token =
        request.cookies.get('authjs.session-token')?.value ||
        request.cookies.get('__Secure-authjs.session-token')?.value;

    if (isProtected && !token) {
        // eslint-disable-next-line no-console
        console.error('User is not authenticated, redirecting to home page');
        // redirect to / if not authenticated
        return NextResponse.redirect(new URL(navLink.home, request.url));
    }

    // If the user is authenticated or not in a protected route, allow the request to continue
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/home',
        '/create-story',
        '/story-board',
        '/story-result',
        '/read-story/${story.id}'
    ]
};
