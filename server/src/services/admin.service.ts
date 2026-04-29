import { db } from '../db';
import { leads, scores, responses, appointments, funnelEvents, users, roles, companies, journeys } from '../db/schema';
import { eq, desc, count } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { BrevoService } from './brevo.service';

const SCORING: Record<string, Record<string, number>> = {
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

function calcularScore(answersMap: Record<string, string>) {
    const interpretacao = ['q1', 'q3', 'q6']
        .reduce((acc, q) => acc + (SCORING[q]?.[answersMap[q]] ?? 0), 0);

    const criterio = ['q2', 'q4', 'q5', 'q8', 'q10']
        .reduce((acc, q) => acc + (SCORING[q]?.[answersMap[q]] ?? 0), 0);

    const rotina = ['q7', 'q9']
        .reduce((acc, q) => acc + (SCORING[q]?.[answersMap[q]] ?? 0), 0);

    const total = interpretacao + criterio + rotina;

    let perfil = 'Gestão Reativa';
    if (total >= 34) perfil = 'Gestão Orientada por Inteligência';
    else if (total >= 26) perfil = 'Gestão em Estruturação';
    else if (total >= 18) perfil = 'Gestão Parcial';

    const eixos = [
        { name: 'Interpretação', score: interpretacao, max: 12 },
        { name: 'Critério de Decisão', score: criterio, max: 20 },
        { name: 'Rotina Gerencial', score: rotina, max: 8 },
    ];
    const gargalo = eixos.reduce((prev, curr) =>
        (curr.score / curr.max) < (prev.score / prev.max) ? curr : prev
    ).name;

    return { total, interpretacao, criterio, rotina, perfil, gargalo };
}

export class AdminService {
    static async getKPIs() {
        const [totalLeadsResult] = await db.select({ value: count(leads.id) }).from(leads);
        const [totalDiagnosticsResult] = await db.select({ value: count(scores.id) }).from(scores);
        const [totalAppointmentsResult] = await db.select({ value: count(appointments.id) }).from(appointments);

        return {
            totalLeads: totalLeadsResult?.value || 0,
            totalDiagnostics: totalDiagnosticsResult?.value || 0,
            totalAppointments: totalAppointmentsResult?.value || 0,
        };
    }

    static async getMentors() {
        const [mentorRole] = await db.select().from(roles).where(eq(roles.name, 'MENTOR'));
        if (!mentorRole) return [];
        return await db.select({
            id: users.id,
            fullName: users.fullName,
            email: users.email
        }).from(users).where(eq(users.roleId, mentorRole.id));
    }

    static async getLeads() {
        return await db.select({
            id: leads.id,
            nome: leads.nome,
            empresa: leads.empresa,
            telefone: leads.whatsapp,
            perfil: scores.perfil,
            temperaturaComercial: leads.interesseAnalise,
            createdAt: leads.createdAt,
        }).from(leads)
            .leftJoin(scores, eq(leads.id, scores.leadId))
            .orderBy(desc(leads.createdAt));
    }

    static async getLeadDetails(leadId: string) {
        const details = await db.select({
            lead: leads, responses: responses, scores: scores,
        }).from(leads)
            .leftJoin(responses, eq(leads.id, responses.leadId))
            .leftJoin(scores, eq(leads.id, scores.leadId))
            .where(eq(leads.id, leadId));

        if (!details || details.length === 0) return null;

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

    static async getDiagnosisResult(leadId: string) {
        const details = await db.select({
            nome: leads.nome,
            scores: scores,
        }).from(leads)
            .leftJoin(scores, eq(leads.id, scores.leadId))
            .where(eq(leads.id, leadId));

        if (!details || details.length === 0) return null;

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

    static async submitDiagnosis(leadData: any, answers: any) {
        const [newLead] = await db.insert(leads).values({
            nome: leadData.nome, empresa: leadData.empresa, segmento: leadData.segmento ?? null,
            faturamentoFaixa: leadData.faturamentoFaixa, colaboradoresFaixa: leadData.colaboradoresFaixa ?? null,
            email: leadData.email, whatsapp: leadData.whatsapp, interesseAnalise: leadData.interesseAnalise,
            origem: 'diagnostico-financeiro',
        }).returning();

        if (!newLead?.id) throw new Error('Falha ao inserir lead.');
        const leadId = newLead.id;

        await db.insert(responses).values({
            leadId, q1: answers.q1, q2: answers.q2, q3: answers.q3, q4: answers.q4, q5: answers.q5,
            q6: answers.q6, q7: answers.q7, q8: answers.q8, q9: answers.q9, q10: answers.q10,
        });

        const result = calcularScore(answers);

        await db.insert(scores).values({
            leadId, scoreTotal: result.total, scoreInterpretacao: result.interpretacao,
            scoreCriterio: result.criterio, scoreRotina: result.rotina,
            perfil: result.perfil, gargaloPrincipal: result.gargalo,
        });

        await db.insert(funnelEvents).values({
            leadId, eventName: 'form_completed', eventValue: result.perfil,
        });

        return { leadId, perfil: result.perfil, scoreTotal: result.total };
    }

    static async createTeamMember({ email, fullName, roleName }: { email: string, fullName: string, roleName: 'MENTOR' | 'COMERCIAL' }) {
        const [roleObj] = await db.select().from(roles).where(eq(roles.name, roleName));
        if (!roleObj) throw new Error('role_not_found');

        const [existing] = await db.select().from(users).where(eq(users.email, email));
        if (existing) throw new Error('email_in_use');

        const [newUser] = await db.insert(users).values({
            email,
            fullName,
            roleId: roleObj.id,
        }).returning();

        // Envia e-mail de boas-vindas em background
        BrevoService.enviarEmailBoasVindasEquipe(fullName, email).catch(err => {
            console.error('Falha ao enviar e-mail de boas-vindas para equipe:', err);
        });

        return newUser;
    }

    static async transformLeadToAluno(leadId: string, mentorId: string) {
        const leadDetails = await this.getLeadDetails(leadId);
        if (!leadDetails) throw new Error('lead_not_found');

        let finalMentorId = mentorId;
        if (mentorId === 'dummy-will-update') {
            const [mentorRole] = await db.select().from(roles).where(eq(roles.name, 'MENTOR'));
            if (mentorRole) {
                const [firstMentor] = await db.select().from(users).where(eq(users.roleId, mentorRole.id));
                if (firstMentor) finalMentorId = firstMentor.id;
            }
        }

        const [alunoRole] = await db.select().from(roles).where(eq(roles.name, 'ALUNO'));

        let [existingUser] = await db.select().from(users).where(eq(users.email, leadDetails.email!));

        if (!existingUser) {
            const [newUser] = await db.insert(users).values({
                email: leadDetails.email!,
                fullName: leadDetails.nome!,
                phone: leadDetails.whatsapp!,
                roleId: alunoRole.id,
            }).returning();
            existingUser = newUser;
        }

        const [newCompany] = await db.insert(companies).values({
            nome: leadDetails.empresa || 'Empresa Sem Nome',
            segmento: leadDetails.segmento,
            porte: leadDetails.colaboradoresFaixa,
            leadId: leadId,
            mentorId: finalMentorId,
            statusPrograma: 'active'
        }).returning();

        const [newJourney] = await db.insert(journeys).values({
            companyId: newCompany.id,
            etapaAtual: 'Início',
            progresso: 0,
        }).returning();

        return { user: existingUser, company: newCompany, journey: newJourney };
    }
}
