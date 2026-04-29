import { db } from '../db';
import { companies, journeys, modules, tasks, actionPlanItems, companyUsers } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export class MenteeService {
    static async getTrilha(userId: string) {
        // Find company associated with the user
        const companyUserRecord = await db.select().from(companyUsers)
            .where(eq(companyUsers.userId, userId))
            .limit(1);
        
        if (companyUserRecord.length === 0) {
            return { modulos: [] };
        }

        const companyId = companyUserRecord[0].companyId;

        // Find active journey
        const activeJourney = await db.select().from(journeys)
            .where(eq(journeys.companyId, companyId))
            .limit(1);

        if (activeJourney.length === 0) {
            return { modulos: [] };
        }

        const journeyId = activeJourney[0].id;

        // Find modules for this journey
        const journeyModules = await db.select().from(modules)
            .where(eq(modules.journeyId, journeyId))
            .orderBy(modules.ordem);

        const formattedModules = journeyModules.map(m => ({
            id: m.id,
            titulo: m.titulo,
            objetivo: m.objetivo || '',
            statusInicial: m.status === 'completed' ? 'concluido' : (m.status === 'locked' ? 'bloqueado' : 'andamento')
        }));

        // Se não tiver nenhum módulo no banco, usamos os mockados mas processados pelo backend
        if (formattedModules.length === 0) {
             const MODULOS_BASE = [
                { id: "mod1", titulo: "1. Diagnosticar", objetivo: "Análise situacional e saúde financeira.", statusInicial: "concluido" },
                { id: "mod2", titulo: "2. Organizar", objetivo: "Estruturação de processos e fluxos operacionais.", statusInicial: "concluido" },
                { id: "mod3", titulo: "3. Prever", objetivo: "Projeção de fluxo de caixa e cenários futuros.", statusInicial: "andamento" },
                { id: "mod4", titulo: "4. Calibrar", objetivo: "Ajuste de precificação e margens de lucro.", statusInicial: "bloqueado" },
                { id: "mod5", titulo: "5. Rotinizar", objetivo: "Criação de rotinas de gestão e dashboards.", statusInicial: "bloqueado" },
                { id: "mod6", titulo: "6. Crescer", objetivo: "Escalabilidade e novos canais de venda.", statusInicial: "bloqueado" },
            ];
            return { modulos: MODULOS_BASE };
        }

        return { modulos: formattedModules };
    }

    static async getPlanoAcao(userId: string) {
        // Find company associated with the user
        const companyUserRecord = await db.select().from(companyUsers)
            .where(eq(companyUsers.userId, userId))
            .limit(1);
        
        if (companyUserRecord.length === 0) {
            return { tarefas: [] };
        }

        const companyId = companyUserRecord[0].companyId;

        // For now, we will merge tasks from ActionPlanItems and mock them slightly since full integration would need more schema for "tarefa" UI
        const planItems = await db.select().from(actionPlanItems)
            .where(eq(actionPlanItems.companyId, companyId));

        let tarefas = planItems.map(p => ({
            id: p.id,
            titulo: p.acao,
            objetivo: "Ação de Mentoria",
            etapa: p.janela === '0-30' ? "0-30 Dias (Emergencial)" : (p.janela === '30-60' ? "31-60 Dias (Estruturação)" : "61-90 Dias (Otimização)"),
            prioridade: "Média",
            responsavel: p.responsavel || "Aluno",
            indicador: "Conclusão",
            prazo: p.prazo ? p.prazo.toISOString().split('T')[0] : "2026-12-31",
            status: p.status === 'done' ? "Concluído" : "Pendente",
            detalhamento: "",
            subtarefas: [] as { id: string; texto: string; concluida: boolean }[],
            notaExecucao: "",
            origem: "MENTOR"
        }));

        if (tarefas.length === 0) {
            tarefas = [
                {
                    id: "t1", titulo: "Renegociar dívida fornecedor X", objetivo: "Reduzir passivo de curto prazo",
                    etapa: "0-30 Dias (Emergencial)", prioridade: "Alta", responsavel: "Financeiro",
                    indicador: "Novo contrato assinado com desconto", prazo: "2026-04-20", status: "Pendente",
                    detalhamento: "Entrar em contato com o gerente e pedir revisão das taxas.",
                    subtarefas: [
                        { id: "sub1", texto: "Levantar histórico de compras", concluida: true }
                    ],
                    notaExecucao: "",
                    origem: "MENTOR"
                },
                {
                    id: "sub-1", titulo: "Coletar propostas comerciais de ERPs", objetivo: "Iniciativa Interna da Equipe",
                    etapa: "31-60 Dias (Estruturação)", prioridade: "Média", responsavel: "Eu (Aluno)",
                    indicador: "Conclusão da atividade", prazo: "2026-04-28", status: "Pendente",
                    detalhamento: "Ligar para 3 fornecedores.",
                    subtarefas: [],
                    notaExecucao: "",
                    origem: "ALUNO"
                }
            ];
        }

        return { tarefas };
    }
}
