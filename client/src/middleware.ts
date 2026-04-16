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
    const isMentorPage = request.nextUrl.pathname.startsWith('/mentor');
    const isMenteePage = request.nextUrl.pathname.startsWith('/mentee');

    const isProtectedRoute = isAdminPage || isDashboardPage || isMentorPage || isMenteePage;

    if (!session) {
        if (isProtectedRoute) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    try {
        const { payload } = await jwtVerify(session, JWT_SECRET);
        const r = (payload.role as string || '').toUpperCase();
        
        // Se usuário que já tá logado tenta acessar a tela de login
        if (isAuthPage) {
            let redirectPath = '/';
            if (r === 'ADMIN' || r === 'COMERCIAL' || r === 'MASTER') redirectPath = '/admin/leads';
            else if (r === 'MENTOR') redirectPath = '/mentor';
            else if (r === 'ALUNO') redirectPath = '/mentee';
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }

        // Restrições de páginas protegidas
        if (isAdminPage && r !== 'ADMIN' && r !== 'COMERCIAL' && r !== 'MASTER') {
            let redirectPath = '/';
            if (r === 'MENTOR') redirectPath = '/mentor';
            else if (r === 'ALUNO') redirectPath = '/mentee';
            else redirectPath = '/login';
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }

        if (isMentorPage && r !== 'MENTOR') {
            let redirectPath = '/';
            if (r === 'ADMIN' || r === 'COMERCIAL' || r === 'MASTER') redirectPath = '/admin/leads';
            else if (r === 'ALUNO') redirectPath = '/mentee';
            else redirectPath = '/login';
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }

        if (isMenteePage && r !== 'ALUNO') {
            let redirectPath = '/';
            if (r === 'ADMIN' || r === 'COMERCIAL' || r === 'MASTER') redirectPath = '/admin/leads';
            else if (r === 'MENTOR') redirectPath = '/mentor';
            else redirectPath = '/login';
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }

    } catch (err) {
        // Token expired/invalid
        if (isProtectedRoute) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('session');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*', '/mentor/:path*', '/mentee/:path*', '/login'],
};
