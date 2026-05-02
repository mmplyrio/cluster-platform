import { db } from '../db';
import { companies, journeys, funnelEvents, tasks, deliverables, users, roles, mentorshipTemplates } from '../db/schema';
import { eq, desc, and, isNull, ne } from 'drizzle-orm';
import { BrevoService } from './brevo.service';

export class MentorService {
    static async getDashboard(mentorId: string) {
        // Obter as empresas/alunos vinculados a este mentor
        const menteesList = await db.select({
            id: companies.id,
            nome: companies.nome,
            status: companies.statusPrograma,
            turma: journeys.createdAt,
            templateId: journeys.templateId,
            journeyId: journeys.id
        }).from(companies)
        .leftJoin(journeys, eq(companies.id, journeys.companyId))
        .where(eq(companies.mentorId, mentorId));

        // Calcular Turmas Ativas (quantos templates distintos em andamento)
        const activeTurmas = new Set(menteesList.filter(m => m.status === 'active' && m.templateId).map(m => m.templateId));

        // Calcular Alunos Ativos
        const alunosAtivos = menteesList.filter(m => m.status === 'active').length;

        // Calcular revisões pendentes (tasks com status 'review' para as jornadas desses alunos)
        let revisoesPendentes = 0;
        const journeyIds = menteesList.filter(m => m.journeyId).map(m => m.journeyId) as string[];
        if (journeyIds.length > 0) {
            // Fazer a query de tasks
            const pendentesDb = await db.select().from(tasks)
                .where(and(
                    eq(tasks.status, 'review')
                    // idéalmente IN(journeyIds) mas Drizzle tem um inArray()
                ));
            revisoesPendentes = pendentesDb.filter(t => journeyIds.includes(t.journeyId)).length;
        }

        // Sessões na semana (Mocked temporário, pois não há filtro de semana em 'appointments' fácil sem mais libs)
        const sessoesSemana = 0; 

        // Avisos: Avaliações recentes ou entregas
        const avaliacoesRecentes = await db.select().from(funnelEvents)
            .orderBy(desc(funnelEvents.createdAt))
            .limit(5);

        const avisosList = avaliacoesRecentes.map(e => ({
            id: e.id,
            titulo: 'Atualização de Lead',
            conteudo: `Lead mudou estágio: ${e.eventValue}`,
            data: e.createdAt.toLocaleDateString(),
            tipo: 'info'
        }));

        return {
            metricas: [
                {
                    title: "Turmas Ativas",
                    value: activeTurmas.size || menteesList.length > 0 ? 1 : 0,
                    description: "Mentorias em andamento",
                },
                {
                    title: "Alunos Ativos",
                    value: alunosAtivos,
                    description: "Em mentoria ativa",
                },
                {
                    title: "Revisões Pendentes",
                    value: revisoesPendentes,
                    description: "Aguardando sua análise",
                },
                {
                    title: "Sessões na Semana",
                    value: sessoesSemana,
                    description: "Agendamentos futuros",
                }
            ],
            alunos: menteesList.map(m => ({
                id: m.id,
                nome: m.nome,
                turma: m.turma ? m.turma.toLocaleDateString() : 'Nova Turma',
                status: m.status === 'active' ? 'Ativo' : 'Pausado',
            })),
            avisos: avisosList.length > 0 ? avisosList : [
                { id: 'av1', titulo: 'Sem novidades', conteudo: 'Nenhum evento recente.', data: new Date().toLocaleDateString(), tipo: 'info' }
            ]
        };
    }

    static async getAlunosList(mentorId: string) {
        const menteesList = await db.select({
            id: companies.id,
            nome: companies.nome,
            status: companies.statusPrograma,
            turma: journeys.createdAt,
            templateId: journeys.templateId,
            journeyId: journeys.id
        }).from(companies)
        .leftJoin(journeys, eq(companies.id, journeys.companyId))
        .where(eq(companies.mentorId, mentorId));

        const totalEmpresas = menteesList.length;
        const emMentoriaAtiva = menteesList.filter(m => m.status === 'active').length;
        const atencaoNecessaria = menteesList.filter(m => m.status === 'paused' || m.status === 'risk').length;
        
        const crmClientes = menteesList.map(m => ({
            id: m.id,
            empresa: m.nome,
            contato: m.nome, // Ideally we fetch users from companyUsers
            turmaAtual: m.templateId || "Padrão",
            ultimoAcesso: "Recente", // Need user last login
            status: m.status === 'active' ? 'Ativo' : (m.status === 'paused' ? 'Pausado' : 'Alumni')
        }));

        return {
            stats: {
                totalEmpresas,
                emMentoriaAtiva,
                atencaoNecessaria,
                taxaConclusao: "0%" // Mockado ou calculado se tivermos 'finished'
            },
            clientes: crmClientes
        };
    }

    static async getTurmas(mentorId: string) {
        const menteesList = await db.select({
            id: companies.id,
            status: companies.statusPrograma,
            templateId: journeys.templateId,
        }).from(companies)
        .leftJoin(journeys, eq(companies.id, journeys.companyId))
        .where(eq(companies.mentorId, mentorId));

        // Group by templateId
        const turmasMap = new Map();
        menteesList.forEach(m => {
            const key = m.templateId || 'Sem Turma';
            if (!turmasMap.has(key)) {
                turmasMap.set(key, { id: key, nome: key, qtdAlunos: 0, status: 'Em Andamento' });
            }
            turmasMap.get(key).qtdAlunos += 1;
        });

        const turmas = Array.from(turmasMap.values());
        
        const chartData = turmas.map(t => ({
            name: t.nome,
            value: t.qtdAlunos
        }));

        // Dados para o Gráfico de Gargalo (Empresas por Etapa Atual)
        const bottleneckRaw = await db.select({
            etapa: journeys.etapaAtual,
        })
        .from(companies)
        .innerJoin(journeys, eq(companies.id, journeys.companyId))
        .where(and(
            eq(companies.mentorId, mentorId),
            ne(companies.statusPrograma, 'alumni')
        ));

        // Contagem manual para evitar problemas de tipos com o Driver do PG no groupBy
        const bottleneckMap = new Map<string, number>();
        bottleneckRaw.forEach(b => {
            const etapa = b.etapa || 'Não Iniciado';
            bottleneckMap.set(etapa, (bottleneckMap.get(etapa) || 0) + 1);
        });

        const bottleneckData = Array.from(bottleneckMap.entries()).map(([etapa, count]) => ({
            etapa,
            alunosTravados: count
        }));

        return { turmas, chartData, bottleneckData };
    }

    static async getTurmaDetails(mentorId: string, turmaId: string) {
        const menteesList = await db.select({
            id: companies.id,
            nome: companies.nome,
            status: companies.statusPrograma,
            templateId: journeys.templateId,
            progresso: journeys.progresso
        }).from(companies)
        .leftJoin(journeys, eq(companies.id, journeys.companyId))
        .where(and(
            eq(companies.mentorId, mentorId),
            eq(journeys.templateId, turmaId)
        ));

        const avgProgress = menteesList.length > 0 
            ? Math.round(menteesList.reduce((acc, curr) => acc + (curr.progresso || 0), 0) / menteesList.length) 
            : 0;

        return {
            nome: turmaId,
            status: 'Em Andamento',
            mentoria: 'Lucro Estruturado',
            metricas: [
                { title: "Alunos Matriculados", value: menteesList.length, description: "Ativos na turma" },
                { title: "Progresso Médio", value: `${avgProgress}%`, description: "Média das jornadas" },
                { title: "Próxima Sessão", value: "A definir", description: "Consulte o calendário" }
            ],
            alunos: menteesList.map(m => ({
                id: m.id,
                nome: m.nome,
                turma: m.templateId || 'Padrão',
                status: m.status === 'active' ? 'Ativo' : (m.status === 'paused' ? 'Pausado' : 'Alumni'),
            }))
        };
    }

    static async getBuilder(mentorId: string): Promise<any> {
        // Obter os templates reais do mentor
        const templates = await db.select()
            .from(mentorshipTemplates)
            .where(eq(mentorshipTemplates.mentorId, mentorId));

        // Se não houver nenhum, podemos criar um inicial para o mentor teste
        if (templates.length === 0) {
            await db.insert(mentorshipTemplates).values({
                mentorId,
                titulo: 'Lucro Estruturado',
                descricao: 'Template padrão de mentoria financeira.',
                status: 'Ativo',
                preco: '15000'
            });
            return this.getBuilder(mentorId);
        }

        const menteesList = await db.select({
            id: companies.id,
            templateId: journeys.templateId,
            status: companies.statusPrograma
        }).from(companies)
        .leftJoin(journeys, eq(companies.id, journeys.companyId))
        .where(eq(companies.mentorId, mentorId));

        const mentorias = templates.map(t => {
            // Verifica alunos vinculados a este template
            const alunosDesteTemplate = menteesList.filter(m => m.templateId === t.titulo);
            const alunosAtivos = alunosDesteTemplate.filter(m => m.status === 'active').length;
            const faturamento = Number(t.preco) * alunosDesteTemplate.length;
            
            return {
                id: t.id,
                titulo: t.titulo,
                status: t.status,
                alunosAtivos: alunosAtivos,
                faturamentoRaw: faturamento,
                faturamentoTotal: `R$ ${faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                ultimaAtualizacao: t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : 'há pouco'
            };
        });

        const totalFaturamento = mentorias.reduce((acc, curr) => acc + curr.faturamentoRaw, 0);
        const totalAlunos = menteesList.length;
        const ativosCount = mentorias.filter(m => m.status === 'Ativo').length;

        return {
            stats: {
                totalFaturamento: `R$ ${totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                totalAlunos: totalAlunos,
                produtosAtivos: `${ativosCount}/${mentorias.length}`
            },
            mentorias
        };
    }

    static async getMentorshipTemplate(id: string, mentorId: string) {
        const [template] = await db.select()
            .from(mentorshipTemplates)
            .where(and(
                eq(mentorshipTemplates.id, id),
                eq(mentorshipTemplates.mentorId, mentorId)
            ));
        return template;
    }

    static async updateMentorshipTemplate(id: string, mentorId: string, data: any) {
        const [updated] = await db.update(mentorshipTemplates)
            .set({
                ...data,
                updatedAt: new Date()
            })
            .where(and(
                eq(mentorshipTemplates.id, id),
                eq(mentorshipTemplates.mentorId, mentorId)
            ))
            .returning();
        return updated;
    }

    static async createMentee(mentorId: string, data: any) {
        // 1. Obter informações do mentor
        const [mentor] = await db.select().from(users).where(eq(users.id, mentorId));
        if (!mentor) throw new Error('mentor_not_found');

        // 2. Garantir que o papel ALUNO exista
        const [alunoRole] = await db.select().from(roles).where(eq(roles.name, 'ALUNO'));
        if (!alunoRole) throw new Error('aluno_role_not_found');

        // 3. Verificar se usuário já existe por email
        let [user] = await db.select().from(users).where(eq(users.email, data.email));

        if (!user) {
            const [newUser] = await db.insert(users).values({
                email: data.email,
                fullName: data.nomeContato,
                phone: data.whatsapp,
                roleId: alunoRole.id,
            }).returning();
            user = newUser;
        }

        // 4. Criar a Empresa
        const [newCompany] = await db.insert(companies).values({
            nome: data.razaoSocial,
            cnpj: data.cnpj || null,
            segmento: data.ramo || null,
            notes: data.anotacoes || null,
            mentorId: mentorId,
            statusPrograma: 'active'
        }).returning();

        // 5. Criar a Jornada Inicial
        await db.insert(journeys).values({
            companyId: newCompany.id,
            etapaAtual: 'Diagnóstico',
            progresso: 0,
        });

        // 6. Disparar e-mail de boas-vindas
        BrevoService.enviarEmailBoasVindasMentorado(user.fullName, user.email, mentor.fullName).catch(err => {
            console.error('Falha ao enviar boas-vindas mentorado:', err);
        });

        return { success: true, companyId: newCompany.id };
    }
}
