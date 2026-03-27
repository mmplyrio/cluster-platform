'use server';

const API_URL = 'http://localhost:4000/api';

export async function getDashboardKPIs() {
    try {
        const res = await fetch(`${API_URL}/admin/kpis`, { cache: 'no-store' });
        return await res.json();
    } catch (error) {
        console.error('Erro ao buscar KPIs do dashboard:', error);
        return { success: false, data: null, error: 'Falha ao buscar indicadores do dashboard' };
    }
}

export async function getLeadsList() {
    try {
        const res = await fetch(`${API_URL}/admin/leads`, { cache: 'no-store' });
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
        const res = await fetch(`${API_URL}/admin/leads/${leadId}`, { cache: 'no-store' });
        return await res.json();
    } catch (error) {
        console.error('Erro ao buscar detalhes do lead:', error);
        return { success: false, data: null, error: 'Falha ao buscar os detalhes do lead solicitado' };
    }
}
