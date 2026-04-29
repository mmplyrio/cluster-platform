import { pgTable, text, timestamp, uuid, integer, boolean } from 'drizzle-orm/pg-core';
import { relations, InferSelectModel, InferInsertModel } from 'drizzle-orm';

// 1. Leads
export const leads = pgTable('leads', {
    id: uuid('id').primaryKey().defaultRandom(),
    nome: text('nome'),
    empresa: text('empresa'),
    segmento: text('segmento'),
    faturamentoFaixa: text('faturamento_faixa'),
    colaboradoresFaixa: text('colaboradores_faixa'),
    email: text('email'),
    whatsapp: text('whatsapp'),
    origem: text('origem'),
    interesseAnalise: text('interesse_analise'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Responses
export const responses = pgTable('responses', {
    id: uuid('id').primaryKey().defaultRandom(),
    leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'cascade' }),
    q1: text('q1'),
    q2: text('q2'),
    q3: text('q3'),
    q4: text('q4'),
    q5: text('q5'),
    q6: text('q6'),
    q7: text('q7'),
    q8: text('q8'),
    q9: text('q9'),
    q10: text('q10'),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

// 3. Scores
export const scores = pgTable('scores', {
    id: uuid('id').primaryKey().defaultRandom(),
    leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'cascade' }),
    scoreTotal: integer('score_total'),
    scoreInterpretacao: integer('score_interpretacao'),
    scoreCriterio: integer('score_criterio'),
    scoreRotina: integer('score_rotina'),
    perfil: text('perfil'),
    gargaloPrincipal: text('gargalo_principal'),
});

// 4. Funnel Events
export const funnelEvents = pgTable('funnel_events', {
    id: uuid('id').primaryKey().defaultRandom(),
    leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'cascade' }),
    eventName: text('event_name'),
    eventValue: text('event_value'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Appointments
export const appointments = pgTable('appointments', {
    id: uuid('id').primaryKey().defaultRandom(),
    leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'cascade' }),
    status: text('status'),
    scheduledAt: timestamp('scheduled_at'),
    source: text('source'),
});

// 6. Roles
export const roles = pgTable('roles', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(), // e.g. 'admin', 'mentor', 'mentorado', 'colaborador'
});

// 7. Users
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    fullName: text('full_name').notNull(),
    email: text('email').notNull().unique(),
    phone: text('phone'),
    roleId: uuid('role_id').references(() => roles.id, { onDelete: 'set null' }),
    passwordHash: text('password_hash'),
    lastLogin: timestamp('last_login'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at'),
    resetPasswordToken: text('reset_password_token'),
    resetPasswordExpires: timestamp('reset_password_expires'),
});

// --- Mentorship Execution Environment ---

// 8. Companies (Mentorship Clients)
export const companies = pgTable('companies', {
    id: uuid('id').primaryKey().defaultRandom(),
    nome: text('nome').notNull(),
    segmento: text('segmento'),
    porte: text('porte'),
    mentorId: uuid('mentor_id').references(() => users.id, { onDelete: 'set null' }),
    leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'set null' }), // Link back to diagnostic
    statusPrograma: text('status_programa'), // active, paused, finished
    cnpj: text('cnpj'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 9. Company Users (Many-to-Many relationship between Users and Companies)
export const companyUsers = pgTable('company_users', {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id').references(() => companies.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    papelNoCaso: text('papel_no_caso'), // socio, gestor, financeiro
});

// 10. Journeys (Mentorship track instances per company)
export const journeys = pgTable('journeys', {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id').references(() => companies.id, { onDelete: 'cascade' }).notNull(),
    templateId: text('template_id'),
    etapaAtual: text('etapa_atual'),
    progresso: integer('progresso').default(0), // 0 to 100
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 11. Modules (Steps of the journey)
export const modules = pgTable('modules', {
    id: uuid('id').primaryKey().defaultRandom(),
    journeyId: uuid('journey_id').references(() => journeys.id, { onDelete: 'cascade' }).notNull(),
    ordem: integer('ordem').notNull(),
    titulo: text('titulo').notNull(),
    objetivo: text('objetivo'),
    regraLiberacao: text('regra_liberacao'), // manual, data, conclusao
    status: text('status').default('locked'), // locked, active, completed
});

// 12. Tasks
export const tasks = pgTable('tasks', {
    id: uuid('id').primaryKey().defaultRandom(),
    journeyId: uuid('journey_id').references(() => journeys.id, { onDelete: 'cascade' }).notNull(),
    moduleId: uuid('module_id').references(() => modules.id, { onDelete: 'set null' }),
    titulo: text('titulo').notNull(),
    descricao: text('descricao'),
    prazo: timestamp('prazo'),
    prioridade: text('prioridade'), // high, medium, low
    status: text('status').default('pending'), // pending, in_progress, review, completed
    responsavelId: uuid('responsavel_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 13. Deliverables (Evidences uploaded for a task)
export const deliverables = pgTable('deliverables', {
    id: uuid('id').primaryKey().defaultRandom(),
    taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }).notNull(),
    tipo: text('tipo'),
    arquivoUrl: text('arquivo_url'),
    versao: integer('versao').default(1),
    status: text('status').default('submitted'), // submitted, approved, rejected
    enviadoPor: uuid('enviado_por').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 14. Comments (Contextual chat on tasks or deliverables)
export const comments = pgTable('comments', {
    id: uuid('id').primaryKey().defaultRandom(),
    autorId: uuid('autor_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    alvoTipo: text('alvo_tipo'), // 'task', 'deliverable', 'module'
    alvoId: uuid('alvo_id').notNull(), // Polimorphic ID
    texto: text('texto').notNull(),
    criadoEm: timestamp('criado_em').defaultNow().notNull(),
});

// 15. Initial Indicators (Essential painel)
export const indicators = pgTable('indicators', {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id').references(() => companies.id, { onDelete: 'cascade' }).notNull(),
    nome: text('nome').notNull(),
    periodicidade: text('periodicidade'), // mensal, trimestral
    meta: text('meta'),
    valorAtual: text('valor_atual'),
    ultimaAtualizacao: timestamp('ultima_atualizacao').defaultNow(),
});

// 16. Action Plan Items (Plano de 90 dias)
export const actionPlanItems = pgTable('action_plan_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id').references(() => companies.id, { onDelete: 'cascade' }).notNull(),
    janela: text('janela'), // '0-30', '30-60', '60-90'
    acao: text('acao').notNull(),
    responsavel: text('responsavel'),
    prazo: timestamp('prazo'),
    status: text('status').default('pending'), // pending, done
});


// Relacionamentos

export const componentsRelations = relations(companies, ({ one, many }) => ({
    lead: one(leads, { fields: [companies.leadId], references: [leads.id] }),
    mentor: one(users, { fields: [companies.mentorId], references: [users.id] }),
    companyUsers: many(companyUsers),
    journeys: many(journeys),
    indicators: many(indicators),
    actionPlanItems: many(actionPlanItems),
}));

export const leadsRelations = relations(leads, ({ many, one }) => ({
    responses: many(responses),
    scores: many(scores),
    funnelEvents: many(funnelEvents),
    appointments: many(appointments),
    company: one(companies, { fields: [leads.id], references: [companies.leadId]}),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
    lead: one(leads, { fields: [responses.leadId], references: [leads.id] }),
}));

export const scoresRelations = relations(scores, ({ one }) => ({
    lead: one(leads, { fields: [scores.leadId], references: [leads.id] }),
}));

export const funnelEventsRelations = relations(funnelEvents, ({ one }) => ({
    lead: one(leads, { fields: [funnelEvents.leadId], references: [leads.id] }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
    lead: one(leads, { fields: [appointments.leadId], references: [leads.id] }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
    users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
    role: one(roles, { fields: [users.roleId], references: [roles.id] }),
    companyUsers: many(companyUsers),
    tasksAssigned: many(tasks),
}));

export const companyUsersRelations = relations(companyUsers, ({ one }) => ({
    company: one(companies, { fields: [companyUsers.companyId], references: [companies.id] }),
    user: one(users, { fields: [companyUsers.userId], references: [users.id] }),
}));

export const journeysRelations = relations(journeys, ({ one, many }) => ({
    company: one(companies, { fields: [journeys.companyId], references: [companies.id] }),
    modules: many(modules),
    tasks: many(tasks),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
    journey: one(journeys, { fields: [modules.journeyId], references: [journeys.id] }),
    tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
    journey: one(journeys, { fields: [tasks.journeyId], references: [journeys.id] }),
    module: one(modules, { fields: [tasks.moduleId], references: [modules.id] }),
    responsavel: one(users, { fields: [tasks.responsavelId], references: [users.id] }),
    deliverables: many(deliverables),
}));

export const deliverablesRelations = relations(deliverables, ({ one }) => ({
    task: one(tasks, { fields: [deliverables.taskId], references: [tasks.id] }),
    enviadoPor: one(users, { fields: [deliverables.enviadoPor], references: [users.id] }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    autor: one(users, { fields: [comments.autorId], references: [users.id] }),
}));

export const indicatorsRelations = relations(indicators, ({ one }) => ({
    company: one(companies, { fields: [indicators.companyId], references: [companies.id] }),
}));

export const actionPlanItemsRelations = relations(actionPlanItems, ({ one }) => ({
    company: one(companies, { fields: [actionPlanItems.companyId], references: [companies.id] }),
}));

// Tipagens - Exportando com InferSelectModel e InferInsertModel

export type Lead = InferSelectModel<typeof leads>;
export type NewLead = InferInsertModel<typeof leads>;

export type Response = InferSelectModel<typeof responses>;
export type NewResponse = InferInsertModel<typeof responses>;

export type Score = InferSelectModel<typeof scores>;
export type NewScore = InferInsertModel<typeof scores>;

export type FunnelEvent = InferSelectModel<typeof funnelEvents>;
export type NewFunnelEvent = InferInsertModel<typeof funnelEvents>;

export type Appointment = InferSelectModel<typeof appointments>;
export type NewAppointment = InferInsertModel<typeof appointments>;

export type Role = InferSelectModel<typeof roles>;
export type NewRole = InferInsertModel<typeof roles>;

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Company = InferSelectModel<typeof companies>;
export type NewCompany = InferInsertModel<typeof companies>;

export type CompanyUser = InferSelectModel<typeof companyUsers>;
export type NewCompanyUser = InferInsertModel<typeof companyUsers>;

export type Journey = InferSelectModel<typeof journeys>;
export type NewJourney = InferInsertModel<typeof journeys>;

export type Module = InferSelectModel<typeof modules>;
export type NewModule = InferInsertModel<typeof modules>;

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;

export type Deliverable = InferSelectModel<typeof deliverables>;
export type NewDeliverable = InferInsertModel<typeof deliverables>;

export type Indicator = InferSelectModel<typeof indicators>;
export type NewIndicator = InferInsertModel<typeof indicators>;

export type ActionPlanItem = InferSelectModel<typeof actionPlanItems>;
export type NewActionPlanItem = InferInsertModel<typeof actionPlanItems>;
