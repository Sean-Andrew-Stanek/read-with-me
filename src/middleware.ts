import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { protectedRoutes } from '@/config/navigation';
import { navLink } from '@/config/navigation';
import { auth } from '@/auth';
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check the path to see if it matches with protected routes
    // const isProtected = protectedRoutes.some(route =>
    //     pathname.startsWith(route)
    // );
    const isProtected = protectedRoutes.some(
        route => pathname === route || pathname.startsWith(route + '/')
    );

    // if (isProtected) {
    //     // Get cookie value
    //     const token =
    //         request.cookies.get('next-auth.session-token')?.value ||
    //         request.cookies.get('__Secure-next-auth.session-token')?.value;
    const session = await auth();

    console.log(
        'Path:',
        pathname,
        '| Protected:',
        isProtected,
        '| Token:',
        session
    );

    if (isProtected && !session) {
        // redirect to / if not authenticated
        return NextResponse.redirect(new URL(navLink.home, request.url));
    }

    // If the user is authenticated or not in a protected route, allow the request to continue
    return NextResponse.next();
}

export const config = {
    matcher: ['/home', '/create-story', '/my-stories']
};
