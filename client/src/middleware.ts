import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_change_in_production'
);

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;

    const isAuthPage = request.nextUrl.pathname.startsWith('/login');
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

    if (!session) {
        if (isAdminPage || isDashboardPage) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    try {
        const { payload } = await jwtVerify(session, JWT_SECRET);
        
        if (isAuthPage) {
            return NextResponse.redirect(new URL(payload.role === 'master' ? '/admin/leads' : '/dashboard', request.url));
        }

        if (isAdminPage && payload.role !== 'master') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

    } catch (err) {
        // Token expired/invalid
        if (isAdminPage || isDashboardPage) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('session');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*', '/login'],
};
