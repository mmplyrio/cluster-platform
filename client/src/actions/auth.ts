'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        return { error: 'Preencha todos os campos.' };
    }

    let result;
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        result = await res.json();
    } catch (e) {
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

    const redirectPath = (result.data.user.role === 'master' || result.data.user.role === 'admin') 
        ? '/admin/leads' 
        : '/dashboard';
    redirect(redirectPath);
}

export async function logoutAction() {
    (await cookies()).delete('session');
    redirect('/');
}

export async function checkEmailAction(email: string) {
    if (!email) return { error: 'Email inválido', exists: false, isFirstAccess: false };

    try {
        const res = await fetch(`${API_URL}/auth/check-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
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

    let result;
    try {
        const res = await fetch(`${API_URL}/auth/set-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        result = await res.json();
    } catch (e) {
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

    const redirectPath = result.data.user.role === 'master' ? '/admin/leads' : '/dashboard';
    redirect(redirectPath);
}
