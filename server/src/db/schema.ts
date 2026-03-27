import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
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
    name: text('name').notNull().unique(), // e.g. 'master', 'user'
});

// 7. Users
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    fullName: text('full_name').notNull(),
    email: text('email').notNull().unique(),
    phone: text('phone'),
    roleId: uuid('role_id').references(() => roles.id, { onDelete: 'set null' }),
    passwordHash: text('password_hash').notNull(),
    lastLogin: timestamp('last_login'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at'),
});

// Relacionamentos
export const leadsRelations = relations(leads, ({ many }) => ({
    responses: many(responses),
    scores: many(scores),
    funnelEvents: many(funnelEvents),
    appointments: many(appointments),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
    lead: one(leads, {
        fields: [responses.leadId],
        references: [leads.id],
    }),
}));

export const scoresRelations = relations(scores, ({ one }) => ({
    lead: one(leads, {
        fields: [scores.leadId],
        references: [leads.id],
    }),
}));

export const funnelEventsRelations = relations(funnelEvents, ({ one }) => ({
    lead: one(leads, {
        fields: [funnelEvents.leadId],
        references: [leads.id],
    }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
    lead: one(leads, {
        fields: [appointments.leadId],
        references: [leads.id],
    }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
    users: many(users),
}));

export const usersRelations = relations(users, ({ one }) => ({
    role: one(roles, {
        fields: [users.roleId],
        references: [roles.id],
    }),
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
