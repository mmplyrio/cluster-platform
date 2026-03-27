"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("./db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = require("./db/schema");
const app = (0, express_1.default)();
const port = 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Pontuações
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
// 1. getDashboardKPIs()
app.get('/api/admin/kpis', async (req, res) => {
    try {
        const [totalLeadsResult] = await db_1.db
            .select({ value: (0, drizzle_orm_1.count)(schema_1.leads.id) })
            .from(schema_1.leads);
        const [totalDiagnosticsResult] = await db_1.db
            .select({ value: (0, drizzle_orm_1.count)(schema_1.scores.id) })
            .from(schema_1.scores);
        const [totalAppointmentsResult] = await db_1.db
            .select({ value: (0, drizzle_orm_1.count)(schema_1.appointments.id) })
            .from(schema_1.appointments);
        res.json({
            success: true,
            data: {
                totalLeads: totalLeadsResult?.value || 0,
                totalDiagnostics: totalDiagnosticsResult?.value || 0,
                totalAppointments: totalAppointmentsResult?.value || 0,
            },
            error: null,
        });
    }
    catch (error) {
        console.error('Erro ao buscar KPIs do dashboard:', error);
        res.status(500).json({ success: false, data: null, error: 'Falha ao buscar indicadores' });
    }
});
// 2. getLeadsList()
app.get('/api/admin/leads', async (req, res) => {
    try {
        const list = await db_1.db
            .select({
            id: schema_1.leads.id,
            nome: schema_1.leads.nome,
            empresa: schema_1.leads.empresa,
            telefone: schema_1.leads.whatsapp,
            perfil: schema_1.scores.perfil,
            temperaturaComercial: schema_1.leads.interesseAnalise,
            createdAt: schema_1.leads.createdAt,
        })
            .from(schema_1.leads)
            .leftJoin(schema_1.scores, (0, drizzle_orm_1.eq)(schema_1.leads.id, schema_1.scores.leadId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.leads.createdAt));
        res.json({ success: true, data: list, error: null });
    }
    catch (error) {
        console.error('Erro ao buscar lista de leads:', error);
        res.status(500).json({ success: false, data: null, error: 'Falha ao carregar lista' });
    }
});
// 3. getLeadDetails(leadId)
app.get('/api/admin/leads/:id', async (req, res) => {
    const leadId = req.params.id;
    if (!leadId) {
        res.status(400).json({ success: false, data: null, error: 'ID is required' });
        return;
    }
    try {
        const details = await db_1.db
            .select({
            lead: schema_1.leads,
            responses: schema_1.responses,
            scores: schema_1.scores,
        })
            .from(schema_1.leads)
            .leftJoin(schema_1.responses, (0, drizzle_orm_1.eq)(schema_1.leads.id, schema_1.responses.leadId))
            .leftJoin(schema_1.scores, (0, drizzle_orm_1.eq)(schema_1.leads.id, schema_1.scores.leadId))
            .where((0, drizzle_orm_1.eq)(schema_1.leads.id, leadId));
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
    }
    catch (error) {
        console.error('Erro ao buscar detalhes:', error);
        res.status(500).json({ success: false, data: null, error: 'Server error' });
    }
});
// 4. submitDiagnosis()
app.post('/api/diagnosis', async (req, res) => {
    const { lead: leadData, answers } = req.body;
    try {
        const [newLead] = await db_1.db.insert(schema_1.leads).values({
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
        if (!newLead?.id)
            throw new Error('Falha ao inserir lead.');
        const leadId = newLead.id;
        await db_1.db.insert(schema_1.responses).values({
            leadId,
            q1: answers.q1, q2: answers.q2, q3: answers.q3, q4: answers.q4, q5: answers.q5,
            q6: answers.q6, q7: answers.q7, q8: answers.q8, q9: answers.q9, q10: answers.q10,
        });
        const result = calcularScore(answers);
        await db_1.db.insert(schema_1.scores).values({
            leadId,
            scoreTotal: result.total,
            scoreInterpretacao: result.interpretacao,
            scoreCriterio: result.criterio,
            scoreRotina: result.rotina,
            perfil: result.perfil,
            gargaloPrincipal: result.gargalo,
        });
        await db_1.db.insert(schema_1.funnelEvents).values({
            leadId,
            eventName: 'form_completed',
            eventValue: result.perfil,
        });
        res.json({
            success: true,
            data: { leadId, perfil: result.perfil, scoreTotal: result.total },
            error: null,
        });
    }
    catch (error) {
        console.error('Erro no diagnóstico:', error);
        res.status(500).json({ success: false, data: null, error: 'Falha ao processar' });
    }
});
// 5. Autenticação e Setup
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
app.post('/api/auth/setup', async (req, res) => {
    try {
        const existingRoles = await db_1.db.select().from(schema_1.roles);
        if (existingRoles.length === 0) {
            await db_1.db.insert(schema_1.roles).values([{ name: 'master' }, { name: 'user' }]);
        }
        const masterRole = await db_1.db.select().from(schema_1.roles).where((0, drizzle_orm_1.eq)(schema_1.roles.name, 'master')).then(r => r[0]);
        if (!masterRole)
            throw new Error('Master role not found');
        const existingMaster = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, 'master@cluster.com')).then(r => r[0]);
        if (!existingMaster) {
            const hash = await bcryptjs_1.default.hash('Senha123!', 10);
            await db_1.db.insert(schema_1.users).values({
                fullName: 'Master Admin',
                email: 'master@cluster.com',
                passwordHash: hash,
                roleId: masterRole.id,
            });
            res.json({ success: true, message: 'Setup completed. Master user generated: master@cluster.com / Senha123!' });
        }
        else {
            res.json({ success: true, message: 'Setup already performed.' });
        }
    }
    catch (error) {
        console.error('Erro no setup auth:', error);
        res.status(500).json({ success: false, error: 'Falha no setup' });
    }
});
app.post('/api/auth/check-email', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ success: false, error: 'Email é obrigatório' });
        return;
    }
    try {
        const [user] = await db_1.db
            .select({
            id: schema_1.users.id,
            email: schema_1.users.email,
            lastLogin: schema_1.users.lastLogin,
        })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
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
    }
    catch (error) {
        console.error('Erro no check-email:', error);
        res.status(500).json({ success: false, error: 'Erro interno no servidor' });
    }
});
app.post('/api/auth/set-password', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email e senha são obrigatórios' });
        return;
    }
    try {
        const [user] = await db_1.db
            .select({
            id: schema_1.users.id,
            email: schema_1.users.email,
            lastLogin: schema_1.users.lastLogin,
            roleName: schema_1.roles.name,
            fullName: schema_1.users.fullName,
        })
            .from(schema_1.users)
            .leftJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.roleId, schema_1.roles.id))
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (!user) {
            res.status(404).json({ success: false, error: 'Usuário não encontrado' });
            return;
        }
        if (user.lastLogin) {
            res.status(400).json({ success: false, error: 'Este usuário já configurou sua senha. Faça login normalmente.' });
            return;
        }
        const hash = await bcryptjs_1.default.hash(password, 10);
        await db_1.db.update(schema_1.users)
            .set({
            passwordHash: hash,
            lastLogin: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, user.id));
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.roleName }, JWT_SECRET, { expiresIn: '24h' });
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
    }
    catch (error) {
        console.error('Erro no set-password:', error);
        res.status(500).json({ success: false, error: 'Erro interno no servidor' });
    }
});
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email e senha são obrigatórios' });
        return;
    }
    try {
        const [user] = await db_1.db
            .select({
            id: schema_1.users.id,
            email: schema_1.users.email,
            passwordHash: schema_1.users.passwordHash,
            fullName: schema_1.users.fullName,
            roleName: schema_1.roles.name,
        })
            .from(schema_1.users)
            .leftJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.roleId, schema_1.roles.id))
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (!user) {
            res.status(401).json({ success: false, error: 'Credenciais inválidas' });
            return;
        }
        const validPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!validPassword) {
            res.status(401).json({ success: false, error: 'Credenciais inválidas' });
            return;
        }
        await db_1.db.update(schema_1.users).set({ lastLogin: new Date() }).where((0, drizzle_orm_1.eq)(schema_1.users.id, user.id));
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.roleName }, JWT_SECRET, { expiresIn: '24h' });
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
    }
    catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ success: false, error: 'Erro interno no servidor' });
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
