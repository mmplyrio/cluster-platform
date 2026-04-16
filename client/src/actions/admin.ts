'use server';

import { cookies } from 'next/headers';

// INTERNAL_API_URL deve ser configurada na Vercel com a URL completa do backend Render
// Ex: https://seu-backend.onrender.com/api
const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';

async function getAuthHeaders() {
    const session = (await cookies()).get('session')?.value;
    return {
        'Content-Type': 'application/json',
        ...(session ? { 'Authorization': `Bearer ${session}` } : {})
    };
}

export async function getDashboardKPIs() {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/admin/kpis`, { headers, cache: 'no-store' });
        return await res.json();
    } catch (error) {
        console.error('Erro ao buscar KPIs do dashboard:', error);
        return { success: false, data: null, error: 'Falha ao buscar indicadores do dashboard' };
    }
}

export async function getLeadsList() {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/admin/leads`, { headers, cache: 'no-store' });
        return await res.json();
    } catch (error) {
        console.error('Erro ao buscar lista de leads:', error);
        return { success: false, data: null, error: 'Falha ao carregar a lista de leads' };
    }
}

export async function getLeadDetails(leadId: string) {
    if (!leadId) {
        return { success: false, data: null, error: 'ID do lead é obrigatório' };
    }

    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/admin/leads/${leadId}`, { headers, cache: 'no-store' });
        return await res.json();
    } catch (error) {
        console.error('Erro ao buscar detalhes do lead:', error);
        return { success: false, data: null, error: 'Falha ao buscar os detalhes do lead solicitado' };
    }
}

export async function convertLeadToAlunoAction(leadId: string, mentorId: string) {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/admin/leads/${leadId}/convert`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ mentorId })
        });
        const result = await res.json();
        return result;
    } catch (e) {
        return { success: false, error: 'Erro ao converter o lead.' };
    }
}

export async function getMentorsListAction() {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/admin/mentors`, { headers, cache: 'no-store' });
        return await res.json();
    } catch (error) {
        console.error('Erro ao buscar lista de mentores:', error);
        return { success: false, data: [], error: 'Falha ao buscar mentores' };
    }
}

export async function createTeamMemberAction(formData: FormData) {
    try {
        const email = formData.get('email');
        const fullName = formData.get('fullName');
        const roleName = formData.get('roleName');

        if (!email || !fullName || !roleName) {
            return { success: false, error: 'Preencha todos os campos corretamente.' };
        }

        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/admin/team`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ email, fullName, roleName })
        });
        
        const result = await res.json();
        return result;
    } catch (error) {
        return { success: false, error: 'Erro de comunicação ao criar conta de equipe' };
    }
}
