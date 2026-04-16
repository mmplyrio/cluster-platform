'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// IMPORTANTE: process.env deve ser lido DENTRO das funções (runtime), não no nível do módulo.
// Se lido no nível do módulo, o Next.js faz inlining em build time, antes das env vars da Vercel serem injetadas.
function getApiUrl(): string {
    const url = process.env.INTERNAL_API_URL;
    if (!url) {
        console.error('[auth] INTERNAL_API_URL não está configurada! Usando fallback localhost.');
    }
    return url || 'http://localhost:4000/api';
}

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        return { error: 'Preencha todos os campos.' };
    }

    const API_URL = getApiUrl();
    let result;
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error(`[loginAction] HTTP ${res.status} de ${API_URL}/auth/login`);
            console.error('[loginAction] Resposta recebida:', text.slice(0, 200));
            return { error: `Erro do servidor (${res.status}). Tente novamente.` };
        }

        result = await res.json();
    } catch (e) {
        console.error('[loginAction] Falha ao conectar com API:', e);
        console.error('[loginAction] API_URL usada:', API_URL);
        return { error: 'Erro de comunicação com o servidor. Tente novamente.' };
    }

    if (!result.success) {
        return { error: result.error || 'Credenciais inválidas' };
    }

    (await cookies()).set('session', result.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
    });

    let redirectPath = '/';
    const r = (result.data.user.role || '').toUpperCase();
    if (r === 'ADMIN' || r === 'COMERCIAL' || r === 'MASTER') redirectPath = '/admin/leads';
    else if (r === 'MENTOR') redirectPath = '/mentor';
    else if (r === 'ALUNO') redirectPath = '/mentee';
    redirect(redirectPath);
}

export async function logoutAction() {
    (await cookies()).delete('session');
    redirect('/');
}

export async function checkEmailAction(email: string) {
    if (!email) return { error: 'Email inválido', exists: false, isFirstAccess: false };

    const API_URL = getApiUrl();
    try {
        const res = await fetch(`${API_URL}/auth/check-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error(`[checkEmailAction] HTTP ${res.status} de ${API_URL}/auth/check-email`);
            console.error('[checkEmailAction] Resposta recebida:', text.slice(0, 200));
            return { error: `Erro do servidor (${res.status}). Tente novamente.`, exists: false, isFirstAccess: false };
        }

        const json = await res.json();
        
        if (!json.success) {
            return { error: json.error || 'Erro ao validar email', exists: false, isFirstAccess: false };
        }
        
        return { 
            error: null, 
            exists: json.data.exists, 
            isFirstAccess: json.data.isFirstAccess 
        };
    } catch (e) {
        console.error('[checkEmailAction] Falha ao conectar com API:', e);
        console.error('[checkEmailAction] API_URL usada:', API_URL);
        return { error: 'Falha de comunicação', exists: false, isFirstAccess: false };
    }
}

export async function setupPasswordAction(prevState: any, formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!email || !password || !confirmPassword) {
        return { error: 'Preencha todos os campos.' };
    }

    if (password !== confirmPassword) {
        return { error: 'As senhas não coincidem.' };
    }

    const API_URL = getApiUrl();
    let result;
    try {
        const res = await fetch(`${API_URL}/auth/set-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        result = await res.json();
    } catch (e) {
        console.error('[setupPasswordAction] Falha ao conectar com API:', e);
        console.error('[setupPasswordAction] API_URL usada:', API_URL);
        return { error: 'Erro de comunicação com o servidor. Tente novamente.' };
    }

    if (!result.success) {
        return { error: result.error || 'Erro ao cadastrar senha.' };
    }

    (await cookies()).set('session', result.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
    });

    let redirectPath = '/';
    const r = (result.data.user.role || '').toUpperCase();
    if (r === 'ADMIN' || r === 'COMERCIAL' || r === 'MASTER') redirectPath = '/admin/leads';
    else if (r === 'MENTOR') redirectPath = '/mentor';
    else if (r === 'ALUNO') redirectPath = '/mentee';
    redirect(redirectPath);
}
