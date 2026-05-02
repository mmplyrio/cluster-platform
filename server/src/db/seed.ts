import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

const connectionString = (process.env.DATABASE_URL || '').replace(/%(?![0-9a-fA-F]{2})/g, '%25');
const seedUrl = connectionString.replace(':6543', ':5432');
const client = postgres(seedUrl, { ssl: 'require', prepare: false });
const db = drizzle(client, { schema });

async function main() {
    console.log('🌱 Iniciando injeção de dados de Teste (Seed)...');
    try {
        // 1. Inserindo as Roles essenciais
        const defaultRoles = ['master', 'admin', 'mentor', 'mentorado', 'colaborador'];
        
        console.log('Roles...');
        for (const roleName of defaultRoles) {
            const existing = await db.select().from(schema.roles).where(eq(schema.roles.name, roleName));
            if (existing.length === 0) {
                await db.insert(schema.roles).values({ name: roleName });
            }
        }

        const rolesMap: Record<string, string> = {};
        const allRoles = await db.select().from(schema.roles);
        allRoles.forEach(r => { rolesMap[r.name] = r.id; });

        // 2. Criando Usuários (Senha padrão: Senha123!)
        console.log('Usuários...');
        const passwordHash = await bcrypt.hash('Senha123!', 10);
        const usersToCreate = [
            { email: 'admin@cluster.com', fullName: 'Super Administrador', roleName: 'admin' },
            { email: 'mentor@cluster.com', fullName: 'Especialista Teste', roleName: 'mentor' },
            { email: 'mentorado@cluster.com', fullName: 'Sócio da Empresa Teste', roleName: 'mentorado' }
        ];

        for (const u of usersToCreate) {
            const existing = await db.select().from(schema.users).where(eq(schema.users.email, u.email));
            if (existing.length === 0 && rolesMap[u.roleName]) {
                await db.insert(schema.users).values({
                    fullName: u.fullName,
                    email: u.email,
                    passwordHash,
                    roleId: rolesMap[u.roleName]
                });
            }
        }

        // 3. Criando Casos e Empresas
        console.log('Mockando Empresa e Vínculos de Mentoria...');
        const mentor = await db.select().from(schema.users).where(eq(schema.users.email, 'mentor@cluster.com')).then(r => r[0]);
        const mentorado = await db.select().from(schema.users).where(eq(schema.users.email, 'mentorado@cluster.com')).then(r => r[0]);

        if (mentor && mentorado) {
            // Cria um Diagnóstico Antigo Fake (Lead de Origem)
            const [newLead] = await db.insert(schema.leads).values({
                nome: mentorado.fullName,
                empresa: 'Tech Invert Solutions - Teste',
                segmento: 'Tecnologia',
                faturamentoFaixa: 'De R$ 50k a 150k',
                email: mentorado.email,
                origem: 'Seed Automático'
            }).returning();

            if (newLead) {
                // Instancia a Empresa originada do Lead atribuído ao Mentor Teste
                const [newCompany] = await db.insert(schema.companies).values({
                    nome: newLead.empresa || 'Empresa Teste',
                    segmento: newLead.segmento,
                    leadId: newLead.id,
                    mentorId: mentor.id,
                    statusPrograma: 'active'
                }).returning();

                if (newCompany) {
                    // Liga explicitamente o login "mentorado@cluster" à permissão dentro deste company
                    await db.insert(schema.companyUsers).values({
                        companyId: newCompany.id,
                        userId: mentorado.id,
                        papelNoCaso: 'socio'
                    });

                    // Instancia a Trilha da empresa (A Jornada "Mentorado")
                    const [journey] = await db.insert(schema.journeys).values({
                        companyId: newCompany.id,
                        etapaAtual: 'Módulo 1: Primeiros Passos'
                    }).returning();

                    if (journey) {
                        const [module] = await db.insert(schema.modules).values({
                            journeyId: journey.id,
                            ordem: 1,
                            titulo: 'Preenchimento do DRE',
                            status: 'active'
                        }).returning();

                        // Cria tarefa pendente ao lado do Mentorado
                        await db.insert(schema.tasks).values({
                            journeyId: journey.id,
                            moduleId: module.id,
                            titulo: 'Subir Planilha DRE Padrão',
                            descricao: 'Baixe nossa planilha, preencha as despesas e anexe a entrega.',
                            responsavelId: mentorado.id,
                            prioridade: 'high',
                            status: 'pending'
                        });
                    }
                }
            }
        }

        // 4. Criando Chat Inicial
        console.log('Mockando Chat Inicial...');
        if (mentor && mentorado) {
            const [conv] = await db.insert(schema.conversations).values({
                titulo: null, // Individual usa o nome do outro participante
                tipo: 'INDIVIDUAL'
            }).returning();

            await db.insert(schema.conversationParticipants).values([
                { conversationId: conv.id, userId: mentor.id },
                { conversationId: conv.id, userId: mentorado.id }
            ]);

            await db.insert(schema.messages).values({
                conversationId: conv.id,
                senderId: mentor.id,
                content: 'Olá! Seja bem-vindo à mentoria Cluster. Já viu o material do Módulo 1?'
            });
        }

        console.log('✅ Seed finalizado! O banco está populado e pronto para uso visual.');
    } catch (error) {
        console.error('❌ Falha no Seed:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
