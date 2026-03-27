import express, { Request, Response } from 'express';
import cors from 'cors';
import { desc, eq, count } from 'drizzle-orm';
import { db } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { leads, scores, responses, appointments, funnelEvents, users, roles } from './db/schema';

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// Pontuações
const SCORING: Record<string, Record<string, number>> = {
    q1:  { A: 2, B: 4, C: 1, D: 2 },
    q2:  { A: 2, B: 1, C: 4, D: 2 },
    q3:  { A: 4, B: 2, C: 1, D: 2 },
    q4:  { A: 2, B: 4, C: 1, D: 1 },
    q5:  { A: 1, B: 2, C: 4, D: 1 },
    q6:  { A: 2, B: 4, C: 1, D: 1 },
    q7:  { A: 2, B: 4, C: 1, D: 1 },
    q8:  { A: 2, B: 2, C: 4, D: 1 },
    q9:  { A: 1, B: 2, C: 4, D: 1 },
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

// 1. getDashboardKPIs()
app.get('/api/admin/kpis', async (req: Request, res: Response) => {
    try {
        const [totalLeadsResult] = await db
            .select({ value: count(leads.id) })
            .from(leads);

        const [totalDiagnosticsResult] = await db
            .select({ value: count(scores.id) })
            .from(scores);

        const [totalAppointmentsResult] = await db
            .select({ value: count(appointments.id) })
            .from(appointments);

        res.json({
            success: true,
            data: {
                totalLeads: totalLeadsResult?.value || 0,
                totalDiagnostics: totalDiagnosticsResult?.value || 0,
                totalAppointments: totalAppointmentsResult?.value || 0,
            },
            error: null,
        });
    } catch (error) {
        console.error('Erro ao buscar KPIs do dashboard:', error);
        res.status(500).json({ success: false, data: null, error: 'Falha ao buscar indicadores' });
    }
});

// 2. getLeadsList()
app.get('/api/admin/leads', async (req: Request, res: Response) => {
    try {
        const list = await db
            .select({
                id: leads.id,
                nome: leads.nome,
                empresa: leads.empresa,
                telefone: leads.whatsapp,
                perfil: scores.perfil,
                temperaturaComercial: leads.interesseAnalise,
                createdAt: leads.createdAt,
            })
            .from(leads)
            .leftJoin(scores, eq(leads.id, scores.leadId))
            .orderBy(desc(leads.createdAt));

        res.json({ success: true, data: list, error: null });
    } catch (error) {
        console.error('Erro ao buscar lista de leads:', error);
        res.status(500).json({ success: false, data: null, error: 'Falha ao carregar lista' });
    }
});

// 3. getLeadDetails(leadId)
app.get('/api/admin/leads/:id', async (req: Request, res: Response) => {
    const leadId = req.params.id as string;
    if (!leadId) {
        res.status(400).json({ success: false, data: null, error: 'ID is required' });
        return;
    }

    try {
        const details = await db
            .select({
                lead: leads,
                responses: responses,
                scores: scores,
            })
            .from(leads)
            .leftJoin(responses, eq(leads.id, responses.leadId))
            .leftJoin(scores, eq(leads.id, scores.leadId))
            .where(eq(leads.id, leadId));

        if (!details || details.length === 0) {
            res.status(404).json({ success: false, data: null, error: 'Lead not found' });
            return;
        }

        const leadData = details[0];

        res.json({
            success: true,
            data: {
                ...leadData.lead,
                respostas: leadData.responses ? {
                    q1: leadData.responses.q1,
                    q2: leadData.responses.q2,
                    q3: leadData.responses.q3,
                    q4: leadData.responses.q4,
                    q5: leadData.responses.q5,
                    q6: leadData.responses.q6,
                    q7: leadData.responses.q7,
                    q8: leadData.responses.q8,
                    q9: leadData.responses.q9,
                    q10: leadData.responses.q10,
                    submittedAt: leadData.responses.submittedAt,
                } : null,
                pontuacoes: leadData.scores ? {
                    scoreTotal: leadData.scores.scoreTotal,
                    scoreInterpretacao: leadData.scores.scoreInterpretacao,
                    scoreCriterio: leadData.scores.scoreCriterio,
                    scoreRotina: leadData.scores.scoreRotina,
                    perfil: leadData.scores.perfil,
                    gargaloPrincipal: leadData.scores.gargaloPrincipal,
                } : null,
            },
            error: null,
        });
    } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
        res.status(500).json({ success: false, data: null, error: 'Server error' });
    }
});

// 4. submitDiagnosis()
app.post('/api/diagnosis', async (req: Request, res: Response) => {
    const { lead: leadData, answers } = req.body;

    try {
        const [newLead] = await db.insert(leads).values({
            nome: leadData.nome,
            empresa: leadData.empresa,
            segmento: leadData.segmento ?? null,
            faturamentoFaixa: leadData.faturamentoFaixa,
            colaboradoresFaixa: leadData.colaboradoresFaixa ?? null,
            email: leadData.email,
            whatsapp: leadData.whatsapp,
            interesseAnalise: leadData.interesseAnalise,
            origem: 'diagnostico-financeiro',
        }).returning();

        if (!newLead?.id) throw new Error('Falha ao inserir lead.');

        const leadId = newLead.id;

        await db.insert(responses).values({
            leadId,
            q1: answers.q1, q2: answers.q2, q3: answers.q3, q4: answers.q4, q5: answers.q5,
            q6: answers.q6, q7: answers.q7, q8: answers.q8, q9: answers.q9, q10: answers.q10,
        });

        const result = calcularScore(answers);

        await db.insert(scores).values({
            leadId,
            scoreTotal: result.total,
            scoreInterpretacao: result.interpretacao,
            scoreCriterio: result.criterio,
            scoreRotina: result.rotina,
            perfil: result.perfil,
            gargaloPrincipal: result.gargalo,
        });

        await db.insert(funnelEvents).values({
            leadId,
            eventName: 'form_completed',
            eventValue: result.perfil,
        });

        res.json({
            success: true,
            data: { leadId, perfil: result.perfil, scoreTotal: result.total },
            error: null,
        });
    } catch (error) {
        console.error('Erro no diagnóstico:', error);
        res.status(500).json({ success: false, data: null, error: 'Falha ao processar' });
    }
});

// 5. Autenticação e Setup
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';

app.post('/api/auth/setup', async (req: Request, res: Response) => {
    try {
        const existingRoles = await db.select().from(roles);
        if (existingRoles.length === 0) {
            await db.insert(roles).values([{ name: 'master' }, { name: 'user' }]);
        }
        
        const masterRole = await db.select().from(roles).where(eq(roles.name, 'master')).then(r => r[0]);
        if (!masterRole) throw new Error('Master role not found');

        const existingMaster = await db.select().from(users).where(eq(users.email, 'master@cluster.com')).then(r => r[0]);
        if (!existingMaster) {
            const hash = await bcrypt.hash('Senha123!', 10);
            await db.insert(users).values({
                fullName: 'Master Admin',
                email: 'master@cluster.com',
                passwordHash: hash,
                roleId: masterRole.id,
            });
            res.json({ success: true, message: 'Setup completed. Master user generated: master@cluster.com / Senha123!' });
        } else {
            res.json({ success: true, message: 'Setup already performed.' });
        }
    } catch (error) {
        console.error('Erro no setup auth:', error);
        res.status(500).json({ success: false, error: 'Falha no setup' });
    }
});

app.post('/api/auth/check-email', async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ success: false, error: 'Email é obrigatório' });
        return;
    }

    try {
        const [user] = await db
            .select({
                id: users.id,
                email: users.email,
                lastLogin: users.lastLogin,
            })
            .from(users)
            .where(eq(users.email, email));

        if (!user) {
            res.status(404).json({ success: false, error: 'Usuário não encontrado' });
            return;
        }

        res.json({
            success: true,
            data: {
                exists: true,
                isFirstAccess: !user.lastLogin,
            }
        });
    } catch (error) {
        console.error('Erro no check-email:', error);
        res.status(500).json({ success: false, error: 'Erro interno no servidor' });
    }
});

app.post('/api/auth/set-password', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email e senha são obrigatórios' });
        return;
    }

    try {
        const [user] = await db
            .select({
                id: users.id,
                email: users.email,
                lastLogin: users.lastLogin,
                roleName: roles.name,
                fullName: users.fullName,
            })
            .from(users)
            .leftJoin(roles, eq(users.roleId, roles.id))
            .where(eq(users.email, email));

        if (!user) {
            res.status(404).json({ success: false, error: 'Usuário não encontrado' });
            return;
        }

        if (user.lastLogin) {
            res.status(400).json({ success: false, error: 'Este usuário já configurou sua senha. Faça login normalmente.' });
            return;
        }

        const hash = await bcrypt.hash(password, 10);
        
        await db.update(users)
            .set({ 
                passwordHash: hash,
                lastLogin: new Date() 
            })
            .where(eq(users.id, user.id));

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.roleName },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.roleName,
                }
            }
        });
    } catch (error) {
        console.error('Erro no set-password:', error);
        res.status(500).json({ success: false, error: 'Erro interno no servidor' });
    }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email e senha são obrigatórios' });
        return;
    }

    try {
        const [user] = await db
            .select({
                id: users.id,
                email: users.email,
                passwordHash: users.passwordHash,
                fullName: users.fullName,
                roleName: roles.name,
            })
            .from(users)
            .leftJoin(roles, eq(users.roleId, roles.id))
            .where(eq(users.email, email));

        if (!user) {
            res.status(401).json({ success: false, error: 'Credenciais inválidas' });
            return;
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            res.status(401).json({ success: false, error: 'Credenciais inválidas' });
            return;
        }

        await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, user.id));

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.roleName },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.roleName,
                }
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ success: false, error: 'Erro interno no servidor' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
