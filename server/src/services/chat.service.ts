import { db } from '../db';
import { conversations, conversationParticipants, messages, users, announcements, tasks, companies, journeys, modules, companyUsers } from '../db/schema';
import { eq, and, desc, ne } from 'drizzle-orm';

export class ChatService {
    static async getConversations(userId: string) {
        const userConvs = await db.select({
            id: conversations.id,
            titulo: conversations.titulo,
            tipo: conversations.tipo,
            createdAt: conversations.createdAt,
        })
        .from(conversations)
        .innerJoin(conversationParticipants, eq(conversations.id, conversationParticipants.conversationId))
        .where(eq(conversationParticipants.userId, userId))
        .orderBy(desc(conversations.createdAt));

        const result = await Promise.all(userConvs.map(async (conv) => {
            const lastMsg = await db.select()
                .from(messages)
                .where(eq(messages.conversationId, conv.id))
                .orderBy(desc(messages.createdAt))
                .limit(1);

            let displayName = conv.titulo;
            let targetId = null;

            if (conv.tipo === 'INDIVIDUAL') {
                const other = await db.select({
                    fullName: users.fullName,
                    userId: users.id
                })
                .from(conversationParticipants)
                .innerJoin(users, eq(conversationParticipants.userId, users.id))
                .where(and(
                    eq(conversationParticipants.conversationId, conv.id),
                    ne(conversationParticipants.userId, userId)
                ))
                .limit(1);
                
                if (other[0]) {
                    displayName = other[0].fullName;
                    
                    // Tentar encontrar a empresa vinculada a este usuário (aluno)
                    const studentCompany = await db.select({ id: companies.id })
                        .from(companyUsers)
                        .innerJoin(companies, eq(companyUsers.companyId, companies.id))
                        .where(eq(companyUsers.userId, other[0].userId))
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

    static async getMessages(conversationId: string) {
        return await db.select({
            id: messages.id,
            content: messages.content,
            senderId: messages.senderId,
            createdAt: messages.createdAt,
            senderName: users.fullName
        })
        .from(messages)
        .innerJoin(users, eq(messages.senderId, users.id))
        .where(eq(messages.conversationId, conversationId))
        .orderBy(messages.createdAt);
    }

    static async sendMessage(conversationId: string, senderId: string, content: string) {
        const [newMessage] = await db.insert(messages).values({
            conversationId,
            senderId,
            content,
        }).returning();

        return newMessage;
    }

    static async createConversation(participants: string[], titulo?: string, tipo: 'INDIVIDUAL' | 'GRUPO' = 'INDIVIDUAL') {
        const [newConv] = await db.insert(conversations).values({
            titulo,
            tipo
        }).returning();

        await db.insert(conversationParticipants).values(
            participants.map(userId => ({
                conversationId: newConv.id,
                userId
            }))
        );

        return newConv;
    }

    static async getCommunicationOverview(userId: string) {
        // 1. Mensagens não lidas (excluindo as enviadas pelo próprio usuário)
        const unreadCount = await db.select()
            .from(messages)
            .innerJoin(conversationParticipants, eq(messages.conversationId, conversationParticipants.conversationId))
            .where(and(
                eq(conversationParticipants.userId, userId),
                eq(messages.isRead, false),
                ne(messages.senderId, userId)
            ));

        // 2. Avisos Recentes
        const recentAnnouncements = await db.select()
            .from(announcements)
            .orderBy(desc(announcements.createdAt))
            .limit(5);

        // 3. Alertas do Radar (Atrasos em tarefas)
        // Buscando tarefas pendentes que já passaram do prazo
        const radarAlerts = await db.select()
            .from(tasks)
            .where(and(
                eq(tasks.status, 'pending'),
                // lt(tasks.prazo, new Date()) // Drizzle lt needs a specific way sometimes
            ))
            .orderBy(desc(tasks.prazo));
        
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

    static async getRadarData(userId: string) {
        const tasksList = await db.select({
            id: tasks.id,
            titulo: tasks.titulo,
            prazo: tasks.prazo,
            prioridade: tasks.prioridade,
            status: tasks.status,
            aluno: companies.nome,
            categoria: modules.titulo
        })
        .from(tasks)
        .leftJoin(modules, eq(tasks.moduleId, modules.id))
        .innerJoin(journeys, eq(tasks.journeyId, journeys.id))
        .innerJoin(companies, eq(journeys.companyId, companies.id))
        .where(and(
            eq(companies.mentorId, userId),
            ne(tasks.status, 'completed')
        ));

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
                if (prazoDate < startOfToday) bucket = 'atrasado';
                else if (prazoDate >= startOfToday && prazoDate <= endOfToday) bucket = 'hoje';
                else if (prazoDate > endOfToday && prazoDate <= sevenDaysLater) bucket = 'semana';
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
