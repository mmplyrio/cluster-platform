'use server';

import { cookies } from 'next/headers';

function getApiUrl(): string {
    const url = process.env.INTERNAL_API_URL;
    return url || 'http://localhost:4000/api';
}

async function getAuthHeaders() {
    const session = (await cookies()).get('session')?.value;
    return {
        'Content-Type': 'application/json',
        ...(session ? { 'Authorization': `Bearer ${session}` } : {})
    };
}

export async function createMenteeAction(data: any) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/alunos`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const error = await res.json();
            return { success: false, error: error.error || 'Falha ao cadastrar aluno' };
        }

        return await res.json();
    } catch (error) {
        console.error('Erro ao cadastrar aluno:', error);
        return { success: false, error: 'Erro de comunicação com o servidor' };
    }
}

export async function getTurmaDetailsAction(id: string) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/turmas/${id}`, {
            headers,
            cache: 'no-store'
        });

        if (!res.ok) return null;
        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error('Erro ao buscar detalhes da turma:', error);
        return null;
    }
}

export async function getMentorshipTemplateAction(id: string) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/builder/${id}`, {
            headers,
            cache: 'no-store'
        });

        if (!res.ok) return null;
        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error('Erro ao buscar template:', error);
        return null;
    }
}

export async function updateMentorshipTemplateAction(id: string, data: any) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/builder/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const error = await res.json();
            return { success: false, error: error.error || 'Falha ao atualizar template' };
        }

        return await res.json();
    } catch (error) {
        console.error('Erro ao atualizar template:', error);
        return { success: false, error: 'Erro de comunicação com o servidor' };
    }
}

export async function getBuilderDataAction() {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/builder`, {
            headers,
            cache: 'no-store'
        });

        if (!res.ok) return { stats: null, mentorias: [] };
        const json = await res.json();
        return json.data || { stats: null, mentorias: [] };
    } catch (error) {
        console.error('Erro ao buscar builder data:', error);
        return { stats: null, mentorias: [] };
    }
}
