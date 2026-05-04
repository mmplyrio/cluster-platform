"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorService = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const brevo_service_1 = require("./brevo.service");
class MentorService {
    static async getDashboard(mentorId) {
        // Obter as empresas/alunos vinculados a este mentor
        const menteesList = await db_1.db.select({
            id: schema_1.companies.id,
            nome: schema_1.companies.nome,
            status: schema_1.companies.statusPrograma,
            turma: schema_1.journeys.createdAt,
            templateId: schema_1.journeys.templateId,
            journeyId: schema_1.journeys.id
        }).from(schema_1.companies)
            .leftJoin(schema_1.journeys, (0, drizzle_orm_1.eq)(schema_1.companies.id, schema_1.journeys.companyId))
            .where((0, drizzle_orm_1.eq)(schema_1.companies.mentorId, mentorId));
        // Calcular Turmas Ativas (quantos templates distintos em andamento)
        const activeTurmas = new Set(menteesList.filter(m => m.status === 'active' && m.templateId).map(m => m.templateId));
        // Calcular Alunos Ativos
        const alunosAtivos = menteesList.filter(m => m.status === 'active').length;
        // Calcular revisões pendentes (tasks com status 'review' para as jornadas desses alunos)
        let revisoesPendentes = 0;
        const journeyIds = menteesList.filter(m => m.journeyId).map(m => m.journeyId);
        if (journeyIds.length > 0) {
            // Fazer a query de tasks
            const pendentesDb = await db_1.db.select().from(schema_1.tasks)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.tasks.status, 'review')
            // idéalmente IN(journeyIds) mas Drizzle tem um inArray()
            ));
            revisoesPendentes = pendentesDb.filter(t => journeyIds.includes(t.journeyId)).length;
        }
        // Sessões na semana (Mocked temporário, pois não há filtro de semana em 'appointments' fácil sem mais libs)
        const sessoesSemana = 0;
        // Avisos: Avaliações recentes ou entregas
        const avaliacoesRecentes = await db_1.db.select().from(schema_1.funnelEvents)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.funnelEvents.createdAt))
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
    static async getAlunosList(mentorId) {
        const menteesList = await db_1.db.select({
            id: schema_1.companies.id,
            nome: schema_1.companies.nome,
            status: schema_1.companies.statusPrograma,
            turma: schema_1.journeys.createdAt,
            templateId: schema_1.journeys.templateId,
            journeyId: schema_1.journeys.id
        }).from(schema_1.companies)
            .leftJoin(schema_1.journeys, (0, drizzle_orm_1.eq)(schema_1.companies.id, schema_1.journeys.companyId))
            .where((0, drizzle_orm_1.eq)(schema_1.companies.mentorId, mentorId));
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
    static async getTurmas(mentorId) {
        // 1. Fetch real turmas
        const realTurmas = await db_1.db.select({
            id: schema_1.turmas.id,
            nome: schema_1.turmas.nome,
            descricao: schema_1.turmas.descricao,
            status: schema_1.turmas.status,
            preco: schema_1.turmas.preco,
            dataInicio: schema_1.turmas.dataInicio,
            vagas: schema_1.turmas.vagas,
            produto: schema_1.mentorshipTemplates.titulo
        }).from(schema_1.turmas)
            .leftJoin(schema_1.mentorshipTemplates, (0, drizzle_orm_1.eq)(schema_1.turmas.templateId, schema_1.mentorshipTemplates.id))
            .where((0, drizzle_orm_1.eq)(schema_1.turmas.mentorId, mentorId));
        const formattedTurmas = realTurmas.map(t => {
            let statusMapped = "Em Andamento";
            if (t.status === 'planejada')
                statusMapped = "Inscrições Abertas";
            if (t.status === 'concluida')
                statusMapped = "Concluída";
            return {
                id: t.id,
                nome: t.nome,
                qtdAlunos: "0", // Será implementado no futuro via join
                status: statusMapped,
                descricao: t.descricao,
                produto: t.produto || "Sem Produto",
                preco: t.preco ? t.preco.toString() : "0",
                dataInicio: t.dataInicio ? t.dataInicio.toISOString().split('T')[0] : undefined,
                vagas: t.vagas?.toString() || "Ilimitadas"
            };
        });
        // 2. Data for Charts (mantendo lógica anterior provisoriamente)
        const menteesList = await db_1.db.select({
            id: schema_1.companies.id,
            status: schema_1.companies.statusPrograma,
            templateId: schema_1.journeys.templateId,
        }).from(schema_1.companies)
            .leftJoin(schema_1.journeys, (0, drizzle_orm_1.eq)(schema_1.companies.id, schema_1.journeys.companyId))
            .where((0, drizzle_orm_1.eq)(schema_1.companies.mentorId, mentorId));
        const turmasMap = new Map();
        menteesList.forEach(m => {
            const key = m.templateId || 'Sem Turma';
            if (!turmasMap.has(key)) {
                turmasMap.set(key, { id: key, nome: key, qtdAlunos: 0 });
            }
            turmasMap.get(key).qtdAlunos += 1;
        });
        const chartData = Array.from(turmasMap.values()).map(t => ({
            name: t.nome,
            value: t.qtdAlunos
        }));
        // Dados para o Gráfico de Gargalo (Empresas por Etapa Atual)
        const bottleneckRaw = await db_1.db.select({
            etapa: schema_1.journeys.etapaAtual,
        })
            .from(schema_1.companies)
            .innerJoin(schema_1.journeys, (0, drizzle_orm_1.eq)(schema_1.companies.id, schema_1.journeys.companyId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.companies.mentorId, mentorId), (0, drizzle_orm_1.ne)(schema_1.companies.statusPrograma, 'alumni')));
        // Contagem manual para evitar problemas de tipos com o Driver do PG no groupBy
        const bottleneckMap = new Map();
        bottleneckRaw.forEach(b => {
            const etapa = b.etapa || 'Não Iniciado';
            bottleneckMap.set(etapa, (bottleneckMap.get(etapa) || 0) + 1);
        });
        const bottleneckData = Array.from(bottleneckMap.entries()).map(([etapa, count]) => ({
            etapa,
            alunosTravados: count
        }));
        return { turmas: formattedTurmas, chartData, bottleneckData };
    }
    static async getTurmaDetails(mentorId, turmaId) {
        const menteesList = await db_1.db.select({
            id: schema_1.companies.id,
            nome: schema_1.companies.nome,
            status: schema_1.companies.statusPrograma,
            templateId: schema_1.journeys.templateId,
            progresso: schema_1.journeys.progresso
        }).from(schema_1.companies)
            .leftJoin(schema_1.journeys, (0, drizzle_orm_1.eq)(schema_1.companies.id, schema_1.journeys.companyId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.companies.mentorId, mentorId), (0, drizzle_orm_1.eq)(schema_1.journeys.templateId, turmaId)));
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
    static async getBuilder(mentorId) {
        // Obter os templates reais do mentor
        const templates = await db_1.db.select()
            .from(schema_1.mentorshipTemplates)
            .where((0, drizzle_orm_1.eq)(schema_1.mentorshipTemplates.mentorId, mentorId));
        // Se não houver nenhum, podemos criar um inicial para o mentor teste
        if (templates.length === 0) {
            await db_1.db.insert(schema_1.mentorshipTemplates).values({
                mentorId,
                titulo: 'Lucro Estruturado',
                descricao: 'Template padrão de mentoria financeira.',
                status: 'Ativo',
                preco: '15000'
            });
            return this.getBuilder(mentorId);
        }
        const menteesList = await db_1.db.select({
            id: schema_1.companies.id,
            templateId: schema_1.journeys.templateId,
            status: schema_1.companies.statusPrograma
        }).from(schema_1.companies)
            .leftJoin(schema_1.journeys, (0, drizzle_orm_1.eq)(schema_1.companies.id, schema_1.journeys.companyId))
            .where((0, drizzle_orm_1.eq)(schema_1.companies.mentorId, mentorId));
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
    static async getMentorshipTemplate(id, mentorId) {
        const [template] = await db_1.db.select()
            .from(schema_1.mentorshipTemplates)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.mentorshipTemplates.id, id), (0, drizzle_orm_1.eq)(schema_1.mentorshipTemplates.mentorId, mentorId)));
        return template;
    }
    static async updateMentorshipTemplate(id, mentorId, data) {
        const [updated] = await db_1.db.update(schema_1.mentorshipTemplates)
            .set({
            ...data,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.mentorshipTemplates.id, id), (0, drizzle_orm_1.eq)(schema_1.mentorshipTemplates.mentorId, mentorId)))
            .returning();
        return updated;
    }
    static async createMentee(mentorId, data) {
        // 1. Obter informações do mentor
        const [mentor] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, mentorId));
        if (!mentor)
            throw new Error('mentor_not_found');
        // 2. Garantir que o papel ALUNO exista
        const [alunoRole] = await db_1.db.select().from(schema_1.roles).where((0, drizzle_orm_1.eq)(schema_1.roles.name, 'ALUNO'));
        if (!alunoRole)
            throw new Error('aluno_role_not_found');
        // 3. Verificar se usuário já existe por email
        let [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, data.email));
        if (!user) {
            const [newUser] = await db_1.db.insert(schema_1.users).values({
                email: data.email,
                fullName: data.nomeContato,
                phone: data.whatsapp,
                roleId: alunoRole.id,
            }).returning();
            user = newUser;
        }
        // 4. Criar a Empresa
        const [newCompany] = await db_1.db.insert(schema_1.companies).values({
            nome: data.razaoSocial,
            cnpj: data.cnpj || null,
            segmento: data.ramo || null,
            notes: data.anotacoes || null,
            mentorId: mentorId,
            statusPrograma: 'active'
        }).returning();
        // 4.5. Vincular o usuário de contato à Empresa
        await db_1.db.insert(schema_1.companyUsers).values({
            companyId: newCompany.id,
            userId: user.id,
            papelNoCaso: 'contato',
        });
        // 5. Criar a Jornada Inicial
        await db_1.db.insert(schema_1.journeys).values({
            companyId: newCompany.id,
            etapaAtual: 'Diagnóstico',
            progresso: 0,
        });
        // 6. Disparar e-mail de boas-vindas
        brevo_service_1.BrevoService.enviarEmailBoasVindasMentorado(user.fullName, user.email, mentor.fullName).catch(err => {
            console.error('Falha ao enviar boas-vindas mentorado:', err);
        });
        return { success: true, companyId: newCompany.id };
    }
    static async getAlunoDetails(mentorId, alunoId) {
        // 1. Get company
        const [company] = await db_1.db.select().from(schema_1.companies).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.companies.id, alunoId), (0, drizzle_orm_1.eq)(schema_1.companies.mentorId, mentorId)));
        if (!company)
            throw new Error('aluno_not_found');
        // 2. Get the associated contact user via companyUsers
        const [companyUserLink] = await db_1.db.select().from(schema_1.companyUsers).where((0, drizzle_orm_1.eq)(schema_1.companyUsers.companyId, company.id));
        let contatoInfo = { nome: "Sem Contato", email: "-", telefone: "-" };
        if (companyUserLink) {
            const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, companyUserLink.userId));
            if (user) {
                contatoInfo = {
                    nome: user.fullName,
                    email: user.email,
                    telefone: user.phone || "-"
                };
            }
        }
        // 3. Get the journeys (matriculas)
        const matriculasList = await db_1.db.select({
            id: schema_1.journeys.id,
            templateId: schema_1.journeys.templateId,
            status: schema_1.companies.statusPrograma,
            createdAt: schema_1.journeys.createdAt
        }).from(schema_1.journeys).where((0, drizzle_orm_1.eq)(schema_1.journeys.companyId, company.id));
        const matriculas = matriculasList.map(m => ({
            id: m.id,
            turmaNome: m.createdAt ? `Turma ${m.createdAt.toLocaleDateString()}` : "Nova Turma",
            produtoNome: m.templateId || "Mentoria Padrão",
            status: m.status === 'active' ? 'Ativo' : (m.status === 'paused' ? 'Pausado' : 'Concluído')
        }));
        // 4. Get modules for the active/first journey
        let modulesList = [];
        if (matriculasList.length > 0) {
            const activeJourney = matriculasList[0];
            modulesList = await db_1.db.select().from(schema_1.modules).where((0, drizzle_orm_1.eq)(schema_1.modules.journeyId, activeJourney.id)).orderBy(schema_1.modules.ordem);
        }
        const steps = modulesList.map(mod => ({
            id: mod.id,
            title: mod.titulo,
            status: mod.status === 'active' ? 'current' : mod.status // maps from 'locked', 'active', 'completed' to 'locked', 'current', 'completed'
        }));
        return {
            id: company.id,
            empresa: company.nome,
            contato: contatoInfo.nome,
            email: contatoInfo.email,
            telefone: contatoInfo.telefone,
            statusGlobal: company.statusPrograma === 'active' ? 'Ativo' : (company.statusPrograma === 'paused' ? 'Pausado' : 'Alumni'),
            matriculas,
            steps
        };
    }
    static async getMentoresDisponiveis() {
        const mentores = await db_1.db.select({
            id: schema_1.users.id,
            nome: schema_1.users.fullName,
        }).from(schema_1.users)
            .innerJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.roleId, schema_1.roles.id))
            .where((0, drizzle_orm_1.eq)(schema_1.roles.name, 'MENTOR'));
        return mentores.map(m => m.nome);
    }
    static async createTurma(mentorId, data) {
        // Obter os IDs dos mentores com base nos nomes passados
        // Se a API estivesse passando IDs, seria mais fácil, mas para manter o fluxo atual do Combobox que passa nomes:
        let mentorIds = [];
        if (data.mentores && data.mentores.length > 0) {
            const dbMentores = await db_1.db.select({ id: schema_1.users.id, fullName: schema_1.users.fullName })
                .from(schema_1.users)
                .innerJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.roleId, schema_1.roles.id))
                .where((0, drizzle_orm_1.eq)(schema_1.roles.name, 'MENTOR'));
            mentorIds = data.mentores.map((nome) => {
                const found = dbMentores.find(m => m.fullName === nome);
                return found ? found.id : null;
            }).filter(Boolean);
        }
        // Criar a Turma
        const [novaTurma] = await db_1.db.insert(schema_1.turmas).values({
            nome: data.nome,
            descricao: data.descricao,
            templateId: data.templateId,
            preco: data.preco ? data.preco.toString() : '0',
            dataInicio: data.dataInicio ? new Date(data.dataInicio) : null,
            vagas: data.vagas ? parseInt(data.vagas, 10) : null,
            mentorId: mentorId,
            status: 'ativa'
        }).returning();
        // Vincular mentores alocados à turma
        if (mentorIds.length > 0) {
            const insertData = mentorIds.map(mId => ({
                turmaId: novaTurma.id,
                mentorId: mId
            }));
            await db_1.db.insert(schema_1.turmaMentores).values(insertData);
        }
        return { success: true, turmaId: novaTurma.id };
    }
}
exports.MentorService = MentorService;
