"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenteeService = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
class MenteeService {
    static async getTrilha(userId) {
        // Find company associated with the user
        const companyUserRecord = await db_1.db.select().from(schema_1.companyUsers)
            .where((0, drizzle_orm_1.eq)(schema_1.companyUsers.userId, userId))
            .limit(1);
        if (companyUserRecord.length === 0) {
            return { modulos: [] };
        }
        const companyId = companyUserRecord[0].companyId;
        // Find active journey
        const activeJourney = await db_1.db.select().from(schema_1.journeys)
            .where((0, drizzle_orm_1.eq)(schema_1.journeys.companyId, companyId))
            .limit(1);
        if (activeJourney.length === 0) {
            return { modulos: [] };
        }
        const journeyId = activeJourney[0].id;
        // Find modules for this journey
        const journeyModules = await db_1.db.select().from(schema_1.modules)
            .where((0, drizzle_orm_1.eq)(schema_1.modules.journeyId, journeyId))
            .orderBy(schema_1.modules.ordem);
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
    static async getPlanoAcao(userId) {
        // Find company associated with the user
        const companyUserRecord = await db_1.db.select().from(schema_1.companyUsers)
            .where((0, drizzle_orm_1.eq)(schema_1.companyUsers.userId, userId))
            .limit(1);
        if (companyUserRecord.length === 0) {
            return { tarefas: [] };
        }
        const companyId = companyUserRecord[0].companyId;
        // For now, we will merge tasks from ActionPlanItems and mock them slightly since full integration would need more schema for "tarefa" UI
        const planItems = await db_1.db.select().from(schema_1.actionPlanItems)
            .where((0, drizzle_orm_1.eq)(schema_1.actionPlanItems.companyId, companyId));
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
            subtarefas: [],
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
exports.MenteeService = MenteeService;
