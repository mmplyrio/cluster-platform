import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { eq, inArray, or } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL || '';
const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function cleanup() {
    console.log('🧹 Iniciando limpeza de dados (Leads e Alunos)...');

    try {
        // 1. Identificar roles de aluno/mentorado
        const rolesList = await db.select().from(schema.roles);
        const menteeRoleIds = rolesList
            .filter(r => ['mentorado', 'ALUNO', 'colaborador'].includes(r.name))
            .map(r => r.id);

        console.log('Deletando dados de execução e templates...');
        
        // Deletar em ordem de dependência (filhos primeiro)
        await db.delete(schema.turmaMentores);
        await db.delete(schema.turmas);
        await db.delete(schema.mentorshipTemplateObjectives);
        await db.delete(schema.mentorshipTemplateModules);
        await db.delete(schema.mentorshipTemplates);
        await db.delete(schema.deliverables);
        await db.delete(schema.comments);
        await db.delete(schema.tasks);
        await db.delete(schema.modules);
        await db.delete(schema.indicators);
        await db.delete(schema.actionPlanItems);
        await db.delete(schema.journeys);
        await db.delete(schema.companyUsers);
        await db.delete(schema.companies);
        
        console.log('Deletando dados de leads...');
        await db.delete(schema.scores);
        await db.delete(schema.responses);
        await db.delete(schema.funnelEvents);
        await db.delete(schema.appointments);
        await db.delete(schema.leads);

        console.log('Deletando mensagens e conversas...');
        await db.delete(schema.messages);
        await db.delete(schema.conversationParticipants);
        await db.delete(schema.conversations);

        if (menteeRoleIds.length > 0) {
            console.log('Deletando usuários com perfil de aluno...');
            await db.delete(schema.users).where(inArray(schema.users.roleId, menteeRoleIds as any));
        }

        console.log('✅ Limpeza concluída com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante a limpeza:', error);
    } finally {
        await client.end();
    }
}

cleanup();
