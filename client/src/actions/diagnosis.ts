'use server';

import { revalidatePath } from 'next/cache';

function getApiUrl(): string {
    const url = process.env.INTERNAL_API_URL;
    if (!url) {
        console.error('[diagnosis] INTERNAL_API_URL não está configurada! Usando fallback localhost.');
    }
    return url || 'http://localhost:4000/api';
}

export type SubmitDiagnosisInput = {
    lead: {
        nome: string;
        empresa: string;
        segmento?: string;
        faturamentoFaixa: string;
        colaboradoresFaixa?: string;
        email: string;
        whatsapp: string;
        interesseAnalise: string;
    };
    answers: Record<string, string>;
};

export async function submitDiagnosis(input: SubmitDiagnosisInput) {
    const API_URL = getApiUrl();
    try {
        const res = await fetch(`${API_URL}/admin/diagnosis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
        });

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await res.text();
            console.error('[diagnosis] Resposta não-JSON da API:', res.status, textResponse.substring(0, 200));
            throw new Error(`A API retornou um formato inválido (${res.status}). Esperado JSON.`);
        }

        const json = await res.json();

        if (json.success) {
            revalidatePath('/admin/leads');
        }

        return json;
    } catch (error) {
        console.error('Erro ao processar diagnóstico:', error);
        return {
            success: false,
            data: null,
            error: 'Falha ao processar o diagnóstico. Tente novamente.',
        };
    }
}

export async function getDiagnosisResult(leadId: string) {
    if (!leadId) {
        return { success: false, data: null, error: 'ID é obrigatório' };
    }

    const API_URL = getApiUrl();
    try {
        const res = await fetch(`${API_URL}/admin/diagnosis/${leadId}`, { cache: 'no-store' });
        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await res.text();
            console.error('[diagnosis] Resposta não-JSON ao buscar resultado:', res.status, textResponse.substring(0, 200));
            throw new Error(`A API retornou um formato inválido (${res.status}). Esperado JSON.`);
        }

        return await res.json();
    } catch (error) {
        console.error('Erro ao buscar resultado do diagnóstico:', error);
        return { success: false, data: null, error: 'Falha ao buscar o resultado' };
    }
}
