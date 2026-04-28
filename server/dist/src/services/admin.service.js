"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const SCORING = {
    q1: { A: 2, B: 4, C: 1, D: 2 },
    q2: { A: 2, B: 1, C: 4, D: 2 },
    q3: { A: 4, B: 2, C: 1, D: 2 },
    q4: { A: 2, B: 4, C: 1, D: 1 },
    q5: { A: 1, B: 2, C: 4, D: 1 },
    q6: { A: 2, B: 4, C: 1, D: 1 },
    q7: { A: 2, B: 4, C: 1, D: 1 },
    q8: { A: 2, B: 2, C: 4, D: 1 },
    q9: { A: 1, B: 2, C: 4, D: 1 },
    q10: { A: 4, B: 2, C: 1, D: 2 },
};
function calcularScore(answersMap) {
    const interpretacao = ['q1', 'q3', 'q6']
        .reduce((acc, q) => acc + (SCORING[q]?.[answersMap[q]] ?? 0), 0);
    const criterio = ['q2', 'q4', 'q5', 'q8', 'q10']
        .reduce((acc, q) => acc + (SCORING[q]?.[answersMap[q]] ?? 0), 0);
    const rotina = ['q7', 'q9']
        .reduce((acc, q) => acc + (SCORING[q]?.[answersMap[q]] ?? 0), 0);
    const total = interpretacao + criterio + rotina;
    let perfil = 'Gestão Reativa';
    if (total >= 34)
        perfil = 'Gestão Orientada por Inteligência';
    else if (total >= 26)
        perfil = 'Gestão em Estruturação';
    else if (total >= 18)
        perfil = 'Gestão Parcial';
    const eixos = [
        { name: 'Interpretação', score: interpretacao, max: 12 },
        { name: 'Critério de Decisão', score: criterio, max: 20 },
        { name: 'Rotina Gerencial', score: rotina, max: 8 },
    ];
    const gargalo = eixos.reduce((prev, curr) => (curr.score / curr.max) < (prev.score / prev.max) ? curr : prev).name;
    return { total, interpretacao, criterio, rotina, perfil, gargalo };
}
class AdminService {
    static async getKPIs() {
        const [totalLeadsResult] = await db_1.db.select({ value: (0, drizzle_orm_1.count)(schema_1.leads.id) }).from(schema_1.leads);
        const [totalDiagnosticsResult] = await db_1.db.select({ value: (0, drizzle_orm_1.count)(schema_1.scores.id) }).from(schema_1.scores);
        const [totalAppointmentsResult] = await db_1.db.select({ value: (0, drizzle_orm_1.count)(schema_1.appointments.id) }).from(schema_1.appointments);
        return {
            totalLeads: totalLeadsResult?.value || 0,
            totalDiagnostics: totalDiagnosticsResult?.value || 0,
            totalAppointments: totalAppointmentsResult?.value || 0,
        };
    }
    static async getMentors() {
        const [mentorRole] = await db_1.db.select().from(schema_1.roles).where((0, drizzle_orm_1.eq)(schema_1.roles.name, 'MENTOR'));
        if (!mentorRole)
            return [];
        return await db_1.db.select({
            id: schema_1.users.id,
            fullName: schema_1.users.fullName,
            email: schema_1.users.email
        }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.roleId, mentorRole.id));
    }
    static async getLeads() {
        return await db_1.db.select({
            id: schema_1.leads.id,
            nome: schema_1.leads.nome,
            empresa: schema_1.leads.empresa,
            telefone: schema_1.leads.whatsapp,
            perfil: schema_1.scores.perfil,
            temperaturaComercial: schema_1.leads.interesseAnalise,
            createdAt: schema_1.leads.createdAt,
        }).from(schema_1.leads)
            .leftJoin(schema_1.scores, (0, drizzle_orm_1.eq)(schema_1.leads.id, schema_1.scores.leadId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.leads.createdAt));
    }
    static async getLeadDetails(leadId) {
        const details = await db_1.db.select({
            lead: schema_1.leads, responses: schema_1.responses, scores: schema_1.scores,
        }).from(schema_1.leads)
            .leftJoin(schema_1.responses, (0, drizzle_orm_1.eq)(schema_1.leads.id, schema_1.responses.leadId))
            .leftJoin(schema_1.scores, (0, drizzle_orm_1.eq)(schema_1.leads.id, schema_1.scores.leadId))
            .where((0, drizzle_orm_1.eq)(schema_1.leads.id, leadId));
        if (!details || details.length === 0)
            return null;
        const leadData = details[0];
        return {
            ...leadData.lead,
            respostas: leadData.responses ? {
                q1: leadData.responses.q1, q2: leadData.responses.q2, q3: leadData.responses.q3,
                q4: leadData.responses.q4, q5: leadData.responses.q5, q6: leadData.responses.q6,
                q7: leadData.responses.q7, q8: leadData.responses.q8, q9: leadData.responses.q9,
                q10: leadData.responses.q10, submittedAt: leadData.responses.submittedAt,
            } : null,
            pontuacoes: leadData.scores ? {
                scoreTotal: leadData.scores.scoreTotal, scoreInterpretacao: leadData.scores.scoreInterpretacao,
                scoreCriterio: leadData.scores.scoreCriterio, scoreRotina: leadData.scores.scoreRotina,
                perfil: leadData.scores.perfil, gargaloPrincipal: leadData.scores.gargaloPrincipal,
            } : null,
        };
    }
    static async getDiagnosisResult(leadId) {
        const details = await db_1.db.select({
            nome: schema_1.leads.nome,
            scores: schema_1.scores,
        }).from(schema_1.leads)
            .leftJoin(schema_1.scores, (0, drizzle_orm_1.eq)(schema_1.leads.id, schema_1.scores.leadId))
            .where((0, drizzle_orm_1.eq)(schema_1.leads.id, leadId));
        if (!details || details.length === 0)
            return null;
        const leadData = details[0];
        return {
            nome: leadData.nome,
            pontuacoes: leadData.scores ? {
                scoreTotal: leadData.scores.scoreTotal,
                scoreInterpretacao: leadData.scores.scoreInterpretacao,
                scoreCriterio: leadData.scores.scoreCriterio,
                scoreRotina: leadData.scores.scoreRotina,
                perfil: leadData.scores.perfil,
                gargaloPrincipal: leadData.scores.gargaloPrincipal,
            } : null,
        };
    }
    static async submitDiagnosis(leadData, answers) {
        const [newLead] = await db_1.db.insert(schema_1.leads).values({
            nome: leadData.nome, empresa: leadData.empresa, segmento: leadData.segmento ?? null,
            faturamentoFaixa: leadData.faturamentoFaixa, colaboradoresFaixa: leadData.colaboradoresFaixa ?? null,
            email: leadData.email, whatsapp: leadData.whatsapp, interesseAnalise: leadData.interesseAnalise,
            origem: 'diagnostico-financeiro',
        }).returning();
        if (!newLead?.id)
            throw new Error('Falha ao inserir lead.');
        const leadId = newLead.id;
        await db_1.db.insert(schema_1.responses).values({
            leadId, q1: answers.q1, q2: answers.q2, q3: answers.q3, q4: answers.q4, q5: answers.q5,
            q6: answers.q6, q7: answers.q7, q8: answers.q8, q9: answers.q9, q10: answers.q10,
        });
        const result = calcularScore(answers);
        await db_1.db.insert(schema_1.scores).values({
            leadId, scoreTotal: result.total, scoreInterpretacao: result.interpretacao,
            scoreCriterio: result.criterio, scoreRotina: result.rotina,
            perfil: result.perfil, gargaloPrincipal: result.gargalo,
        });
        await db_1.db.insert(schema_1.funnelEvents).values({
            leadId, eventName: 'form_completed', eventValue: result.perfil,
        });
        return { leadId, perfil: result.perfil, scoreTotal: result.total };
    }
    static async createTeamMember({ email, fullName, roleName }) {
        const [roleObj] = await db_1.db.select().from(schema_1.roles).where((0, drizzle_orm_1.eq)(schema_1.roles.name, roleName));
        if (!roleObj)
            throw new Error('role_not_found');
        const [existing] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (existing)
            throw new Error('email_in_use');
        const [newUser] = await db_1.db.insert(schema_1.users).values({
            email,
            fullName,
            roleId: roleObj.id,
        }).returning();
        return newUser;
    }
    static async transformLeadToAluno(leadId, mentorId) {
        const leadDetails = await this.getLeadDetails(leadId);
        if (!leadDetails)
            throw new Error('lead_not_found');
        let finalMentorId = mentorId;
        if (mentorId === 'dummy-will-update') {
            const [mentorRole] = await db_1.db.select().from(schema_1.roles).where((0, drizzle_orm_1.eq)(schema_1.roles.name, 'MENTOR'));
            if (mentorRole) {
                const [firstMentor] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.roleId, mentorRole.id));
                if (firstMentor)
                    finalMentorId = firstMentor.id;
            }
        }
        const [alunoRole] = await db_1.db.select().from(schema_1.roles).where((0, drizzle_orm_1.eq)(schema_1.roles.name, 'ALUNO'));
        let [existingUser] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, leadDetails.email));
        if (!existingUser) {
            const [newUser] = await db_1.db.insert(schema_1.users).values({
                email: leadDetails.email,
                fullName: leadDetails.nome,
                phone: leadDetails.whatsapp,
                roleId: alunoRole.id,
            }).returning();
            existingUser = newUser;
        }
        const [newCompany] = await db_1.db.insert(schema_1.companies).values({
            nome: leadDetails.empresa || 'Empresa Sem Nome',
            segmento: leadDetails.segmento,
            porte: leadDetails.colaboradoresFaixa,
            leadId: leadId,
            mentorId: finalMentorId,
            statusPrograma: 'active'
        }).returning();
        const [newJourney] = await db_1.db.insert(schema_1.journeys).values({
            companyId: newCompany.id,
            etapaAtual: 'Início',
            progresso: 0,
        }).returning();
        return { user: existingUser, company: newCompany, journey: newJourney };
    }
}
exports.AdminService = AdminService;
