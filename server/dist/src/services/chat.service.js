"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
class ChatService {
    static async getConversations(userId) {
        const userConvs = await db_1.db.select({
            id: schema_1.conversations.id,
            titulo: schema_1.conversations.titulo,
            tipo: schema_1.conversations.tipo,
            createdAt: schema_1.conversations.createdAt,
        })
            .from(schema_1.conversations)
            .innerJoin(schema_1.conversationParticipants, (0, drizzle_orm_1.eq)(schema_1.conversations.id, schema_1.conversationParticipants.conversationId))
            .where((0, drizzle_orm_1.eq)(schema_1.conversationParticipants.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.conversations.createdAt));
        const result = await Promise.all(userConvs.map(async (conv) => {
            const lastMsg = await db_1.db.select()
                .from(schema_1.messages)
                .where((0, drizzle_orm_1.eq)(schema_1.messages.conversationId, conv.id))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.messages.createdAt))
                .limit(1);
            let displayName = conv.titulo;
            let targetId = null;
            if (conv.tipo === 'INDIVIDUAL') {
                const other = await db_1.db.select({
                    fullName: schema_1.users.fullName,
                    userId: schema_1.users.id
                })
                    .from(schema_1.conversationParticipants)
                    .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.conversationParticipants.userId, schema_1.users.id))
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.conversationParticipants.conversationId, conv.id), (0, drizzle_orm_1.ne)(schema_1.conversationParticipants.userId, userId)))
                    .limit(1);
                if (other[0]) {
                    displayName = other[0].fullName;
                    // Tentar encontrar a empresa vinculada a este usuário (aluno)
                    const studentCompany = await db_1.db.select({ id: schema_1.companies.id })
                        .from(schema_1.companyUsers)
                        .innerJoin(schema_1.companies, (0, drizzle_orm_1.eq)(schema_1.companyUsers.companyId, schema_1.companies.id))
                        .where((0, drizzle_orm_1.eq)(schema_1.companyUsers.userId, other[0].userId))
                        .limit(1);
                    if (studentCompany[0]) {
                        targetId = studentCompany[0].id;
                    }
                }
            }
            return {
                id: conv.id,
                name: displayName || 'Conversa sem nome',
                type: conv.tipo,
                targetId: targetId,
                lastMessage: lastMsg[0]?.content || '',
                time: lastMsg[0]?.createdAt || conv.createdAt,
                unread: 0 // TODO: Implement unread count
            };
        }));
        return result;
    }
    static async getMessages(conversationId) {
        return await db_1.db.select({
            id: schema_1.messages.id,
            content: schema_1.messages.content,
            senderId: schema_1.messages.senderId,
            createdAt: schema_1.messages.createdAt,
            senderName: schema_1.users.fullName
        })
            .from(schema_1.messages)
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.messages.senderId, schema_1.users.id))
            .where((0, drizzle_orm_1.eq)(schema_1.messages.conversationId, conversationId))
            .orderBy(schema_1.messages.createdAt);
    }
    static async sendMessage(conversationId, senderId, content) {
        const [newMessage] = await db_1.db.insert(schema_1.messages).values({
            conversationId,
            senderId,
            content,
        }).returning();
        return newMessage;
    }
    static async createConversation(participants, titulo, tipo = 'INDIVIDUAL') {
        const [newConv] = await db_1.db.insert(schema_1.conversations).values({
            titulo,
            tipo
        }).returning();
        await db_1.db.insert(schema_1.conversationParticipants).values(participants.map(userId => ({
            conversationId: newConv.id,
            userId
        })));
        return newConv;
    }
    static async getCommunicationOverview(userId) {
        // 1. Mensagens não lidas (excluindo as enviadas pelo próprio usuário)
        const unreadCount = await db_1.db.select()
            .from(schema_1.messages)
            .innerJoin(schema_1.conversationParticipants, (0, drizzle_orm_1.eq)(schema_1.messages.conversationId, schema_1.conversationParticipants.conversationId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.conversationParticipants.userId, userId), (0, drizzle_orm_1.eq)(schema_1.messages.isRead, false), (0, drizzle_orm_1.ne)(schema_1.messages.senderId, userId)));
        // 2. Avisos Recentes
        const recentAnnouncements = await db_1.db.select()
            .from(schema_1.announcements)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.announcements.createdAt))
            .limit(5);
        // 3. Alertas do Radar (Atrasos em tarefas)
        // Buscando tarefas pendentes que já passaram do prazo
        const radarAlerts = await db_1.db.select()
            .from(schema_1.tasks)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.tasks.status, 'pending')))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.tasks.prazo));
        // Filtro manual de data para evitar problemas de tipos com o Driver do PG
        const now = new Date();
        const overdueTasks = radarAlerts.filter(t => t.prazo && new Date(t.prazo) < now);
        return {
            newMessages: unreadCount.length,
            recentAnnouncements: recentAnnouncements,
            radarAlerts: overdueTasks.map(t => ({
                id: t.id,
                title: t.titulo,
                description: `Vencido em ${t.prazo ? new Date(t.prazo).toLocaleDateString() : 'data ignorada'}`,
                category: 'atraso'
            }))
        };
    }
    static async getRadarData(userId) {
        const tasksList = await db_1.db.select({
            id: schema_1.tasks.id,
            titulo: schema_1.tasks.titulo,
            prazo: schema_1.tasks.prazo,
            prioridade: schema_1.tasks.prioridade,
            status: schema_1.tasks.status,
            aluno: schema_1.companies.nome,
            categoria: schema_1.modules.titulo
        })
            .from(schema_1.tasks)
            .leftJoin(schema_1.modules, (0, drizzle_orm_1.eq)(schema_1.tasks.moduleId, schema_1.modules.id))
            .innerJoin(schema_1.journeys, (0, drizzle_orm_1.eq)(schema_1.tasks.journeyId, schema_1.journeys.id))
            .innerJoin(schema_1.companies, (0, drizzle_orm_1.eq)(schema_1.journeys.companyId, schema_1.companies.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.companies.mentorId, userId), (0, drizzle_orm_1.ne)(schema_1.tasks.status, 'completed')));
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);
        const sevenDaysLater = new Date(now);
        sevenDaysLater.setDate(now.getDate() + 7);
        return tasksList.map(t => {
            const prazoDate = t.prazo ? new Date(t.prazo) : null;
            let bucket = 'futuro';
            if (prazoDate) {
                if (prazoDate < startOfToday)
                    bucket = 'atrasado';
                else if (prazoDate >= startOfToday && prazoDate <= endOfToday)
                    bucket = 'hoje';
                else if (prazoDate > endOfToday && prazoDate <= sevenDaysLater)
                    bucket = 'semana';
            }
            return {
                id: t.id,
                titulo: t.titulo,
                aluno: t.aluno,
                prazo: t.prazo ? new Date(t.prazo).toISOString().split('T')[0] : null,
                prioridade: t.prioridade === 'high' ? 'Alta' : (t.prioridade === 'medium' ? 'Média' : 'Baixa'),
                categoria: t.categoria || 'Geral',
                status: bucket === 'atrasado' ? 'Atrasado' : 'Pendente',
                bucket
            };
        });
    }
}
exports.ChatService = ChatService;
