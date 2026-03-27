'use server';

import { revalidatePath } from 'next/cache';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

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
    try {
        const res = await fetch(`${API_URL}/diagnosis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
        });

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
