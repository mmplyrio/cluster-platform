"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionPlanItemsRelations = exports.indicatorsRelations = exports.commentsRelations = exports.deliverablesRelations = exports.tasksRelations = exports.modulesRelations = exports.journeysRelations = exports.companyUsersRelations = exports.usersRelations = exports.rolesRelations = exports.appointmentsRelations = exports.funnelEventsRelations = exports.scoresRelations = exports.responsesRelations = exports.leadsRelations = exports.componentsRelations = exports.actionPlanItems = exports.indicators = exports.comments = exports.deliverables = exports.tasks = exports.modules = exports.journeys = exports.companyUsers = exports.companies = exports.users = exports.roles = exports.appointments = exports.funnelEvents = exports.scores = exports.responses = exports.leads = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// 1. Leads
exports.leads = (0, pg_core_1.pgTable)('leads', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    nome: (0, pg_core_1.text)('nome'),
    empresa: (0, pg_core_1.text)('empresa'),
    segmento: (0, pg_core_1.text)('segmento'),
    faturamentoFaixa: (0, pg_core_1.text)('faturamento_faixa'),
    colaboradoresFaixa: (0, pg_core_1.text)('colaboradores_faixa'),
    email: (0, pg_core_1.text)('email'),
    whatsapp: (0, pg_core_1.text)('whatsapp'),
    origem: (0, pg_core_1.text)('origem'),
    interesseAnalise: (0, pg_core_1.text)('interesse_analise'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// 2. Responses
exports.responses = (0, pg_core_1.pgTable)('responses', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    leadId: (0, pg_core_1.uuid)('lead_id').references(() => exports.leads.id, { onDelete: 'cascade' }),
    q1: (0, pg_core_1.text)('q1'),
    q2: (0, pg_core_1.text)('q2'),
    q3: (0, pg_core_1.text)('q3'),
    q4: (0, pg_core_1.text)('q4'),
    q5: (0, pg_core_1.text)('q5'),
    q6: (0, pg_core_1.text)('q6'),
    q7: (0, pg_core_1.text)('q7'),
    q8: (0, pg_core_1.text)('q8'),
    q9: (0, pg_core_1.text)('q9'),
    q10: (0, pg_core_1.text)('q10'),
    submittedAt: (0, pg_core_1.timestamp)('submitted_at').defaultNow().notNull(),
});
// 3. Scores
exports.scores = (0, pg_core_1.pgTable)('scores', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    leadId: (0, pg_core_1.uuid)('lead_id').references(() => exports.leads.id, { onDelete: 'cascade' }),
    scoreTotal: (0, pg_core_1.integer)('score_total'),
    scoreInterpretacao: (0, pg_core_1.integer)('score_interpretacao'),
    scoreCriterio: (0, pg_core_1.integer)('score_criterio'),
    scoreRotina: (0, pg_core_1.integer)('score_rotina'),
    perfil: (0, pg_core_1.text)('perfil'),
    gargaloPrincipal: (0, pg_core_1.text)('gargalo_principal'),
});
// 4. Funnel Events
exports.funnelEvents = (0, pg_core_1.pgTable)('funnel_events', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    leadId: (0, pg_core_1.uuid)('lead_id').references(() => exports.leads.id, { onDelete: 'cascade' }),
    eventName: (0, pg_core_1.text)('event_name'),
    eventValue: (0, pg_core_1.text)('event_value'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// 5. Appointments
exports.appointments = (0, pg_core_1.pgTable)('appointments', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    leadId: (0, pg_core_1.uuid)('lead_id').references(() => exports.leads.id, { onDelete: 'cascade' }),
    status: (0, pg_core_1.text)('status'),
    scheduledAt: (0, pg_core_1.timestamp)('scheduled_at'),
    source: (0, pg_core_1.text)('source'),
});
// 6. Roles
exports.roles = (0, pg_core_1.pgTable)('roles', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)('name').notNull().unique(), // e.g. 'admin', 'mentor', 'mentorado', 'colaborador'
});
// 7. Users
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    fullName: (0, pg_core_1.text)('full_name').notNull(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    phone: (0, pg_core_1.text)('phone'),
    roleId: (0, pg_core_1.uuid)('role_id').references(() => exports.roles.id, { onDelete: 'set null' }),
    passwordHash: (0, pg_core_1.text)('password_hash'),
    lastLogin: (0, pg_core_1.timestamp)('last_login'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at'),
    resetPasswordToken: (0, pg_core_1.text)('reset_password_token'),
    resetPasswordExpires: (0, pg_core_1.timestamp)('reset_password_expires'),
});
// --- Mentorship Execution Environment ---
// 8. Companies (Mentorship Clients)
exports.companies = (0, pg_core_1.pgTable)('companies', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    nome: (0, pg_core_1.text)('nome').notNull(),
    segmento: (0, pg_core_1.text)('segmento'),
    porte: (0, pg_core_1.text)('porte'),
    mentorId: (0, pg_core_1.uuid)('mentor_id').references(() => exports.users.id, { onDelete: 'set null' }),
    leadId: (0, pg_core_1.uuid)('lead_id').references(() => exports.leads.id, { onDelete: 'set null' }), // Link back to diagnostic
    statusPrograma: (0, pg_core_1.text)('status_programa'), // active, paused, finished
    cnpj: (0, pg_core_1.text)('cnpj'),
    notes: (0, pg_core_1.text)('notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// 9. Company Users (Many-to-Many relationship between Users and Companies)
exports.companyUsers = (0, pg_core_1.pgTable)('company_users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    companyId: (0, pg_core_1.uuid)('company_id').references(() => exports.companies.id, { onDelete: 'cascade' }).notNull(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    papelNoCaso: (0, pg_core_1.text)('papel_no_caso'), // socio, gestor, financeiro
});
// 10. Journeys (Mentorship track instances per company)
exports.journeys = (0, pg_core_1.pgTable)('journeys', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    companyId: (0, pg_core_1.uuid)('company_id').references(() => exports.companies.id, { onDelete: 'cascade' }).notNull(),
    templateId: (0, pg_core_1.text)('template_id'),
    etapaAtual: (0, pg_core_1.text)('etapa_atual'),
    progresso: (0, pg_core_1.integer)('progresso').default(0), // 0 to 100
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// 11. Modules (Steps of the journey)
exports.modules = (0, pg_core_1.pgTable)('modules', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    journeyId: (0, pg_core_1.uuid)('journey_id').references(() => exports.journeys.id, { onDelete: 'cascade' }).notNull(),
    ordem: (0, pg_core_1.integer)('ordem').notNull(),
    titulo: (0, pg_core_1.text)('titulo').notNull(),
    objetivo: (0, pg_core_1.text)('objetivo'),
    regraLiberacao: (0, pg_core_1.text)('regra_liberacao'), // manual, data, conclusao
    status: (0, pg_core_1.text)('status').default('locked'), // locked, active, completed
});
// 12. Tasks
exports.tasks = (0, pg_core_1.pgTable)('tasks', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    journeyId: (0, pg_core_1.uuid)('journey_id').references(() => exports.journeys.id, { onDelete: 'cascade' }).notNull(),
    moduleId: (0, pg_core_1.uuid)('module_id').references(() => exports.modules.id, { onDelete: 'set null' }),
    titulo: (0, pg_core_1.text)('titulo').notNull(),
    descricao: (0, pg_core_1.text)('descricao'),
    prazo: (0, pg_core_1.timestamp)('prazo'),
    prioridade: (0, pg_core_1.text)('prioridade'), // high, medium, low
    status: (0, pg_core_1.text)('status').default('pending'), // pending, in_progress, review, completed
    responsavelId: (0, pg_core_1.uuid)('responsavel_id').references(() => exports.users.id, { onDelete: 'set null' }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// 13. Deliverables (Evidences uploaded for a task)
exports.deliverables = (0, pg_core_1.pgTable)('deliverables', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    taskId: (0, pg_core_1.uuid)('task_id').references(() => exports.tasks.id, { onDelete: 'cascade' }).notNull(),
    tipo: (0, pg_core_1.text)('tipo'),
    arquivoUrl: (0, pg_core_1.text)('arquivo_url'),
    versao: (0, pg_core_1.integer)('versao').default(1),
    status: (0, pg_core_1.text)('status').default('submitted'), // submitted, approved, rejected
    enviadoPor: (0, pg_core_1.uuid)('enviado_por').references(() => exports.users.id, { onDelete: 'set null' }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// 14. Comments (Contextual chat on tasks or deliverables)
exports.comments = (0, pg_core_1.pgTable)('comments', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    autorId: (0, pg_core_1.uuid)('autor_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    alvoTipo: (0, pg_core_1.text)('alvo_tipo'), // 'task', 'deliverable', 'module'
    alvoId: (0, pg_core_1.uuid)('alvo_id').notNull(), // Polimorphic ID
    texto: (0, pg_core_1.text)('texto').notNull(),
    criadoEm: (0, pg_core_1.timestamp)('criado_em').defaultNow().notNull(),
});
// 15. Initial Indicators (Essential painel)
exports.indicators = (0, pg_core_1.pgTable)('indicators', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    companyId: (0, pg_core_1.uuid)('company_id').references(() => exports.companies.id, { onDelete: 'cascade' }).notNull(),
    nome: (0, pg_core_1.text)('nome').notNull(),
    periodicidade: (0, pg_core_1.text)('periodicidade'), // mensal, trimestral
    meta: (0, pg_core_1.text)('meta'),
    valorAtual: (0, pg_core_1.text)('valor_atual'),
    ultimaAtualizacao: (0, pg_core_1.timestamp)('ultima_atualizacao').defaultNow(),
});
// 16. Action Plan Items (Plano de 90 dias)
exports.actionPlanItems = (0, pg_core_1.pgTable)('action_plan_items', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    companyId: (0, pg_core_1.uuid)('company_id').references(() => exports.companies.id, { onDelete: 'cascade' }).notNull(),
    janela: (0, pg_core_1.text)('janela'), // '0-30', '30-60', '60-90'
    acao: (0, pg_core_1.text)('acao').notNull(),
    responsavel: (0, pg_core_1.text)('responsavel'),
    prazo: (0, pg_core_1.timestamp)('prazo'),
    status: (0, pg_core_1.text)('status').default('pending'), // pending, done
});
// Relacionamentos
exports.componentsRelations = (0, drizzle_orm_1.relations)(exports.companies, ({ one, many }) => ({
    lead: one(exports.leads, { fields: [exports.companies.leadId], references: [exports.leads.id] }),
    mentor: one(exports.users, { fields: [exports.companies.mentorId], references: [exports.users.id] }),
    companyUsers: many(exports.companyUsers),
    journeys: many(exports.journeys),
    indicators: many(exports.indicators),
    actionPlanItems: many(exports.actionPlanItems),
}));
exports.leadsRelations = (0, drizzle_orm_1.relations)(exports.leads, ({ many, one }) => ({
    responses: many(exports.responses),
    scores: many(exports.scores),
    funnelEvents: many(exports.funnelEvents),
    appointments: many(exports.appointments),
    company: one(exports.companies, { fields: [exports.leads.id], references: [exports.companies.leadId] }),
}));
exports.responsesRelations = (0, drizzle_orm_1.relations)(exports.responses, ({ one }) => ({
    lead: one(exports.leads, { fields: [exports.responses.leadId], references: [exports.leads.id] }),
}));
exports.scoresRelations = (0, drizzle_orm_1.relations)(exports.scores, ({ one }) => ({
    lead: one(exports.leads, { fields: [exports.scores.leadId], references: [exports.leads.id] }),
}));
exports.funnelEventsRelations = (0, drizzle_orm_1.relations)(exports.funnelEvents, ({ one }) => ({
    lead: one(exports.leads, { fields: [exports.funnelEvents.leadId], references: [exports.leads.id] }),
}));
exports.appointmentsRelations = (0, drizzle_orm_1.relations)(exports.appointments, ({ one }) => ({
    lead: one(exports.leads, { fields: [exports.appointments.leadId], references: [exports.leads.id] }),
}));
exports.rolesRelations = (0, drizzle_orm_1.relations)(exports.roles, ({ many }) => ({
    users: many(exports.users),
}));
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ one, many }) => ({
    role: one(exports.roles, { fields: [exports.users.roleId], references: [exports.roles.id] }),
    companyUsers: many(exports.companyUsers),
    tasksAssigned: many(exports.tasks),
}));
exports.companyUsersRelations = (0, drizzle_orm_1.relations)(exports.companyUsers, ({ one }) => ({
    company: one(exports.companies, { fields: [exports.companyUsers.companyId], references: [exports.companies.id] }),
    user: one(exports.users, { fields: [exports.companyUsers.userId], references: [exports.users.id] }),
}));
exports.journeysRelations = (0, drizzle_orm_1.relations)(exports.journeys, ({ one, many }) => ({
    company: one(exports.companies, { fields: [exports.journeys.companyId], references: [exports.companies.id] }),
    modules: many(exports.modules),
    tasks: many(exports.tasks),
}));
exports.modulesRelations = (0, drizzle_orm_1.relations)(exports.modules, ({ one, many }) => ({
    journey: one(exports.journeys, { fields: [exports.modules.journeyId], references: [exports.journeys.id] }),
    tasks: many(exports.tasks),
}));
exports.tasksRelations = (0, drizzle_orm_1.relations)(exports.tasks, ({ one, many }) => ({
    journey: one(exports.journeys, { fields: [exports.tasks.journeyId], references: [exports.journeys.id] }),
    module: one(exports.modules, { fields: [exports.tasks.moduleId], references: [exports.modules.id] }),
    responsavel: one(exports.users, { fields: [exports.tasks.responsavelId], references: [exports.users.id] }),
    deliverables: many(exports.deliverables),
}));
exports.deliverablesRelations = (0, drizzle_orm_1.relations)(exports.deliverables, ({ one }) => ({
    task: one(exports.tasks, { fields: [exports.deliverables.taskId], references: [exports.tasks.id] }),
    enviadoPor: one(exports.users, { fields: [exports.deliverables.enviadoPor], references: [exports.users.id] }),
}));
exports.commentsRelations = (0, drizzle_orm_1.relations)(exports.comments, ({ one }) => ({
    autor: one(exports.users, { fields: [exports.comments.autorId], references: [exports.users.id] }),
}));
exports.indicatorsRelations = (0, drizzle_orm_1.relations)(exports.indicators, ({ one }) => ({
    company: one(exports.companies, { fields: [exports.indicators.companyId], references: [exports.companies.id] }),
}));
exports.actionPlanItemsRelations = (0, drizzle_orm_1.relations)(exports.actionPlanItems, ({ one }) => ({
    company: one(exports.companies, { fields: [exports.actionPlanItems.companyId], references: [exports.companies.id] }),
}));
