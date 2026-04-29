import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    const pathname = request.nextUrl.pathname;

    const isAuthPage = pathname.startsWith('/login');
    const isAdminPage = pathname.startsWith('/admin');
    const isDashboardPage = pathname.startsWith('/dashboard');
    const isMentorPage = pathname.startsWith('/mentor');
    const isMenteePage = pathname.startsWith('/mentee');

    const isProtectedRoute = isAdminPage || isDashboardPage || isMentorPage || isMenteePage;

    // Se não tem sessão, redireciona apenas se for rota protegida
    if (!session) {
        if (isProtectedRoute) {
            console.log(`[Middleware] Sem sessão, redirecionando para /login: ${pathname}`);
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'fallback_secret_key_change_in_production'
    );

    try {
        const { payload } = await jwtVerify(session, secret);
        const r = (payload.role as string || '').toUpperCase();
        
        console.log(`[Middleware] Usuário: ${payload.email}, Role: ${r}, Path: ${pathname}`);

        // Se usuário que já tá logado tenta acessar a tela de login
        if (isAuthPage) {
            let redirectPath = '/';
            if (r === 'ADMIN' || r === 'COMERCIAL' || r === 'MASTER') redirectPath = '/admin/leads';
            else if (r === 'MENTOR') redirectPath = '/mentor';
            else if (r === 'ALUNO') redirectPath = '/mentee';
            
            console.log(`[Middleware] Já logado, redirecionando para: ${redirectPath}`);
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
        console.error('[Middleware] Erro ao verificar token:', err instanceof Error ? err.message : err);
        
        // Token expired/invalid
        if (isProtectedRoute) {
            console.log(`[Middleware] Token inválido em rota protegida, limpando sessão e indo para /login: ${pathname}`);
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
