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

export async function createMentorshipTemplateAction(data: any) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/builder`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const error = await res.json();
            return { success: false, error: error.error || 'Falha ao criar template' };
        }

        return await res.json();
    } catch (error) {
        console.error('Erro ao criar template:', error);
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

export async function getAlunoDetailsAction(id: string) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/alunos/${id}`, {
            headers,
            cache: 'no-store'
        });

        if (!res.ok) return null;
        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error('Erro ao buscar detalhes do aluno:', error);
        return null;
    }
}

export async function updateModuleStatusAction(id: string, status: string) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/modules/${id}/status`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ status })
        });
        const json = await res.json();
        return json;
    } catch (error) {
        console.error('Erro ao atualizar status do módulo:', error);
        return { success: false, error: 'Erro de conexão' };
    }
}

export async function updateTaskStatusAction(id: string, status: string) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/tasks/${id}/status`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ status })
        });
        const json = await res.json();
        return json;
    } catch (error) {
        console.error('Erro ao atualizar status da tarefa:', error);
        return { success: false, error: 'Erro de conexão' };
    }
}

export async function updateDeliverableStatusAction(id: string, status: string, feedback?: string) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/deliverables/${id}/status`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ status, feedback })
        });
        const json = await res.json();
        return json;
    } catch (error) {
        console.error('Erro ao atualizar status do entregável:', error);
        return { success: false, error: 'Erro de conexão' };
    }
}

export async function createTaskAction(moduleId: string, journeyId: string, titulo: string, descricao: string) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/modules/${moduleId}/tasks`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ journeyId, titulo, descricao })
        });
        const json = await res.json();
        return json;
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        return { success: false, error: 'Erro de conexão' };
    }
}

export async function getMentoresDisponiveisAction() {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/mentores`, {
            headers,
            cache: 'no-store'
        });

        if (!res.ok) return [];
        const json = await res.json();
        return json.success ? json.data : [];
    } catch (error) {
        console.error('Erro ao buscar mentores:', error);
        return [];
    }
}

export async function createTurmaAction(data: any) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/turmas`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const error = await res.json();
            return { success: false, error: error.error || 'Falha ao criar turma' };
        }

        return await res.json();
    } catch (error) {
        console.error('Erro ao criar turma:', error);
        return { success: false, error: 'Erro de comunicação com o servidor' };
    }
}

export async function addAlunoToTurmaAction(turmaId: string, data: any) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/turmas/${turmaId}/alunos`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const error = await res.json();
            return { success: false, error: error.error || 'Falha ao vincular aluno' };
        }

        return await res.json();
    } catch (error) {
        console.error('Erro ao vincular aluno:', error);
        return { success: false, error: 'Erro de comunicação com o servidor' };
    }
}

export async function getAlunosAction() {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/alunos`, {
            headers,
            cache: 'no-store'
        });

        if (!res.ok) return null;
        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        return null;
    }
}

export async function updateActionPlanStatusAction(id: string, status: string) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/action-plan/${id}/status`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ status })
        });
        const json = await res.json();
        return json;
    } catch (error) {
        console.error('Erro ao atualizar status do plano de ação:', error);
        return { success: false, error: 'Erro de conexão' };
    }
}

export async function createActionPlanItemAction(companyId: string, data: any) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/action-plan`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ ...data, companyId })
        });
        const json = await res.json();
        return json;
    } catch (error) {
        console.error('Erro ao criar item do plano de ação:', error);
        return { success: false, error: 'Erro de conexão' };
    }
}

export async function createLogbookEntryAction(companyId: string, texto: string) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/logbook`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ companyId, texto })
        });
        const json = await res.json();
        return json;
    } catch (error) {
        console.error('Erro ao criar entrada no prontuário:', error);
        return { success: false, error: 'Erro de conexão' };
    }
}

export async function updateCompanyNotesAction(id: string, notes: string) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/companies/${id}/notes`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ notes })
        });
        const json = await res.json();
        return json;
    } catch (error) {
        console.error('Erro ao atualizar notas da empresa:', error);
        return { success: false, error: 'Erro de conexão' };
    }
}

export async function updateDiagnosisAction(alunoId: string, data: any) {
    const API_URL = getApiUrl();
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/mentor/diagnosis/${alunoId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data)
        });
        const json = await res.json();
        return json;
    } catch (error) {
        console.error('Erro ao atualizar diagnóstico:', error);
        return { success: false, error: 'Erro de conexão' };
    }
}
