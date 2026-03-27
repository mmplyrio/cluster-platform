"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRelations = exports.rolesRelations = exports.appointmentsRelations = exports.funnelEventsRelations = exports.scoresRelations = exports.responsesRelations = exports.leadsRelations = exports.users = exports.roles = exports.appointments = exports.funnelEvents = exports.scores = exports.responses = exports.leads = void 0;
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
    name: (0, pg_core_1.text)('name').notNull().unique(), // e.g. 'master', 'user'
});
// 7. Users
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    fullName: (0, pg_core_1.text)('full_name').notNull(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    phone: (0, pg_core_1.text)('phone'),
    roleId: (0, pg_core_1.uuid)('role_id').references(() => exports.roles.id, { onDelete: 'set null' }),
    passwordHash: (0, pg_core_1.text)('password_hash').notNull(),
    lastLogin: (0, pg_core_1.timestamp)('last_login'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at'),
});
// Relacionamentos
exports.leadsRelations = (0, drizzle_orm_1.relations)(exports.leads, ({ many }) => ({
    responses: many(exports.responses),
    scores: many(exports.scores),
    funnelEvents: many(exports.funnelEvents),
    appointments: many(exports.appointments),
}));
exports.responsesRelations = (0, drizzle_orm_1.relations)(exports.responses, ({ one }) => ({
    lead: one(exports.leads, {
        fields: [exports.responses.leadId],
        references: [exports.leads.id],
    }),
}));
exports.scoresRelations = (0, drizzle_orm_1.relations)(exports.scores, ({ one }) => ({
    lead: one(exports.leads, {
        fields: [exports.scores.leadId],
        references: [exports.leads.id],
    }),
}));
exports.funnelEventsRelations = (0, drizzle_orm_1.relations)(exports.funnelEvents, ({ one }) => ({
    lead: one(exports.leads, {
        fields: [exports.funnelEvents.leadId],
        references: [exports.leads.id],
    }),
}));
exports.appointmentsRelations = (0, drizzle_orm_1.relations)(exports.appointments, ({ one }) => ({
    lead: one(exports.leads, {
        fields: [exports.appointments.leadId],
        references: [exports.leads.id],
    }),
}));
exports.rolesRelations = (0, drizzle_orm_1.relations)(exports.roles, ({ many }) => ({
    users: many(exports.users),
}));
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ one }) => ({
    role: one(exports.roles, {
        fields: [exports.users.roleId],
        references: [exports.roles.id],
    }),
}));
