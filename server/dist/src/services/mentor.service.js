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
        const rawMentees = await db_1.db.select({
            id: schema_1.companies.id,
            nome: schema_1.companies.nome,
            status: schema_1.companies.statusPrograma,
            turma: schema_1.journeys.createdAt,
            templateId: schema_1.journeys.templateId,
            journeyId: schema_1.journeys.id
        }).from(schema_1.companies)
            .leftJoin(schema_1.journeys, (0, drizzle_orm_1.eq)(schema_1.companies.id, schema_1.journeys.companyId))
            .leftJoin(schema_1.turmas, (0, drizzle_orm_1.eq)(schema_1.journeys.turmaId, schema_1.turmas.id))
            .leftJoin(schema_1.turmaMentores, (0, drizzle_orm_1.eq)(schema_1.turmas.id, schema_1.turmaMentores.turmaId))
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.companies.mentorId, mentorId), (0, drizzle_orm_1.eq)(schema_1.turmas.mentorId, mentorId), (0, drizzle_orm_1.eq)(schema_1.turmaMentores.mentorId, mentorId)));
        // Deduplicar para métricas
        const menteesList = rawMentees.reduce((acc, current) => {
            if (!acc.find(item => item.id === current.id))
                acc.push(current);
            return acc;
        }, []);
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
        const rawList = await db_1.db.select({
            id: schema_1.companies.id,
            nome: schema_1.companies.nome,
            status: schema_1.companies.statusPrograma,
            turma: schema_1.journeys.createdAt,
            templateId: schema_1.journeys.templateId,
            templateTitulo: schema_1.mentorshipTemplates.titulo,
            journeyId: schema_1.journeys.id
        }).from(schema_1.companies)
            .leftJoin(schema_1.journeys, (0, drizzle_orm_1.eq)(schema_1.companies.id, schema_1.journeys.companyId))
            .leftJoin(schema_1.turmas, (0, drizzle_orm_1.eq)(schema_1.journeys.turmaId, schema_1.turmas.id))
            .leftJoin(schema_1.mentorshipTemplates, (0, drizzle_orm_1.eq)(schema_1.turmas.templateId, schema_1.mentorshipTemplates.id))
            .leftJoin(schema_1.turmaMentores, (0, drizzle_orm_1.eq)(schema_1.turmas.id, schema_1.turmaMentores.turmaId))
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.companies.mentorId, mentorId), (0, drizzle_orm_1.eq)(schema_1.turmas.mentorId, mentorId), (0, drizzle_orm_1.eq)(schema_1.turmaMentores.mentorId, mentorId)));
        // Deduplicar por ID de empresa (mantendo a jornada mais recente se houver duplicatas)
        const deduplicated = rawList.reduce((acc, current) => {
            const existing = acc.find(item => item.id === current.id);
            if (!existing) {
                acc.push(current);
            }
            else if (!existing.journeyId && current.journeyId) {
                // Se o existente não tinha jornada e o atual tem, substitui
                const index = acc.indexOf(existing);
                acc[index] = current;
            }
            return acc;
        }, []);
        const totalEmpresas = deduplicated.length;
        const emMentoriaAtiva = deduplicated.filter(m => m.status === 'active').length;
        const atencaoNecessaria = deduplicated.filter(m => m.status === 'paused' || m.status === 'risk').length;
        const crmClientes = deduplicated.map(m => ({
            id: m.id,
            empresa: m.nome,
            contato: m.nome,
            turmaAtual: m.templateTitulo || (m.templateId ? m.templateId.substring(0, 8) + '…' : null),
            ultimoAcesso: "Recente",
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
        const realTurmasRaw = await db_1.db.select({
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
            .leftJoin(schema_1.turmaMentores, (0, drizzle_orm_1.eq)(schema_1.turmas.id, schema_1.turmaMentores.turmaId))
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.turmas.mentorId, mentorId), (0, drizzle_orm_1.eq)(schema_1.turmaMentores.mentorId, mentorId)));
        // Deduplicar turmas (se o mentor estiver em mais de um papel ou duplicado no N:N)
        const realTurmas = realTurmasRaw.reduce((acc, current) => {
            if (!acc.find(t => t.id === current.id))
                acc.push(current);
            return acc;
        }, []);
        // 2. Fetch counts of students per turma
        const studentCounts = await db_1.db.select({
            turmaId: schema_1.journeys.turmaId,
            count: (0, drizzle_orm_1.sql) `count(${schema_1.journeys.id})::int`
        }).from(schema_1.journeys)
            .groupBy(schema_1.journeys.turmaId);
        const countsMap = new Map(studentCounts.map(c => [c.turmaId, c.count]));
        const formattedTurmas = realTurmas.map(t => {
            let statusMapped = "Em Andamento";
            if (t.status === 'planejada')
                statusMapped = "Inscrições Abertas";
            if (t.status === 'concluida')
                statusMapped = "Concluída";
            return {
                id: t.id,
                nome: t.nome,
                qtdAlunos: (countsMap.get(t.id) || 0).toString(),
                status: statusMapped,
                descricao: t.descricao,
                produto: t.produto || "Sem Produto",
                preco: t.preco ? t.preco.toString() : "0",
                dataInicio: t.dataInicio ? t.dataInicio.toISOString().split('T')[0] : undefined,
                vagas: t.vagas?.toString() || "Ilimitadas"
            };
        });
        // 3. Data for Charts
        const chartData = formattedTurmas.map(t => ({
            name: t.nome,
            value: parseInt(t.qtdAlunos, 10)
        }));
        // Dados para o Gráfico de Gargalo (Empresas por Etapa Atual)
        const bottleneckRaw = await db_1.db.select({
            etapa: schema_1.journeys.etapaAtual,
        })
            .from(schema_1.companies)
            .innerJoin(schema_1.journeys, (0, drizzle_orm_1.eq)(schema_1.companies.id, schema_1.journeys.companyId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.companies.mentorId, mentorId), (0, drizzle_orm_1.ne)(schema_1.companies.statusPrograma, 'alumni')));
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
        const [turma] = await db_1.db.select({
            id: schema_1.turmas.id,
            nome: schema_1.turmas.nome,
            status: schema_1.turmas.status,
            templateId: schema_1.turmas.templateId,
            mentoriaNome: schema_1.mentorshipTemplates.titulo
        }).from(schema_1.turmas)
            .leftJoin(schema_1.mentorshipTemplates, (0, drizzle_orm_1.eq)(schema_1.turmas.templateId, schema_1.mentorshipTemplates.id))
            .leftJoin(schema_1.turmaMentores, (0, drizzle_orm_1.eq)(schema_1.turmas.id, schema_1.turmaMentores.turmaId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.turmas.id, turmaId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.turmas.mentorId, mentorId), (0, drizzle_orm_1.eq)(schema_1.turmaMentores.mentorId, mentorId))));
        if (!turma) {
            throw new Error("Turma não encontrada");
        }
        // Busca alunos da turma através do vínculo da jornada com a turma
        // Simplificado para evitar duplicatas causadas pelos joins de mentores
        // Usamos groupBy para garantir que cada empresa apareça apenas uma vez na lista da turma
        const menteesList = await db_1.db.select({
            id: schema_1.companies.id,
            nome: schema_1.companies.nome,
            status: schema_1.companies.statusPrograma,
            templateId: (0, drizzle_orm_1.sql) `max(${schema_1.journeys.templateId})`,
            progresso: (0, drizzle_orm_1.sql) `max(${schema_1.journeys.progresso})`
        }).from(schema_1.companies)
            .innerJoin(schema_1.journeys, (0, drizzle_orm_1.eq)(schema_1.companies.id, schema_1.journeys.companyId))
            .where((0, drizzle_orm_1.eq)(schema_1.journeys.turmaId, turmaId))
            .groupBy(schema_1.companies.id);
        const avgProgress = menteesList.length > 0
            ? Math.round(menteesList.reduce((acc, curr) => acc + (curr.progresso || 0), 0) / menteesList.length)
            : 0;
        let statusMapped = "Em Andamento";
        if (turma.status === 'planejada')
            statusMapped = "Inscrições Abertas";
        if (turma.status === 'concluida')
            statusMapped = "Concluída";
        return {
            nome: turma.nome,
            status: statusMapped,
            mentoria: turma.mentoriaNome || 'Sem Produto',
            metricas: [
                { title: "Alunos Matriculados", value: menteesList.length, description: "Ativos na turma" },
                { title: "Progresso Médio", value: `${avgProgress}%`, description: "Média das jornadas" },
                { title: "Próxima Sessão", value: "A definir", description: "Consulte o calendário" }
            ],
            alunos: menteesList.map(m => ({
                id: m.id,
                nome: m.nome,
                turma: turma.nome,
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
    static async createMentorshipTemplate(mentorId, data) {
        const { modules: incomingModules, ...templateData } = data;
        const [newTemplate] = await db_1.db.insert(schema_1.mentorshipTemplates).values({
            ...templateData,
            mentorId,
            status: templateData.status || 'Ativo',
            preco: templateData.preco ? templateData.preco.toString() : '0',
        }).returning();
        if (incomingModules && incomingModules.length > 0) {
            for (let mIdx = 0; mIdx < incomingModules.length; mIdx++) {
                const m = incomingModules[mIdx];
                const [newModule] = await db_1.db.insert(schema_1.mentorshipTemplateModules).values({
                    templateId: newTemplate.id,
                    ordem: mIdx + 1,
                    titulo: m.titulo,
                    objetivoMacro: m.objetivoMacro
                }).returning();
                if (m.objectives && m.objectives.length > 0) {
                    await db_1.db.insert(schema_1.mentorshipTemplateObjectives).values(m.objectives.map((obj, oIdx) => ({
                        moduleId: newModule.id,
                        descricao: typeof obj === 'string' ? obj : (obj.descricao || obj.titulo),
                        ordem: oIdx + 1
                    })));
                }
            }
        }
        return newTemplate;
    }
    static async getMentorshipTemplate(id, mentorId) {
        const template = await db_1.db.query.mentorshipTemplates.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.mentorshipTemplates.id, id), (0, drizzle_orm_1.eq)(schema_1.mentorshipTemplates.mentorId, mentorId)),
            with: {
                modules: {
                    orderBy: (modules, { asc }) => [asc(modules.ordem)],
                    with: {
                        objectives: {
                            orderBy: (obj, { asc }) => [asc(obj.ordem)]
                        }
                    }
                }
            }
        });
        return template;
    }
    static async updateMentorshipTemplate(id, mentorId, data) {
        const { modules: incomingModules, ...templateData } = data;
        // 1. Update the template basic info
        const [updated] = await db_1.db.update(schema_1.mentorshipTemplates)
            .set({
            ...templateData,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.mentorshipTemplates.id, id), (0, drizzle_orm_1.eq)(schema_1.mentorshipTemplates.mentorId, mentorId)))
            .returning();
        if (!updated)
            return null;
        // 2. Handle modules if provided
        if (incomingModules) {
            // Simple approach: delete and recreate modules/objectives for the template
            // In production, we'd want a more surgical sync, but for now this works.
            await db_1.db.delete(schema_1.mentorshipTemplateModules).where((0, drizzle_orm_1.eq)(schema_1.mentorshipTemplateModules.templateId, id));
            for (let mIdx = 0; mIdx < incomingModules.length; mIdx++) {
                const m = incomingModules[mIdx];
                const [newModule] = await db_1.db.insert(schema_1.mentorshipTemplateModules).values({
                    templateId: id,
                    ordem: mIdx + 1,
                    titulo: m.titulo,
                    objetivoMacro: m.objetivoMacro
                }).returning();
                if (m.objectives && m.objectives.length > 0) {
                    await db_1.db.insert(schema_1.mentorshipTemplateObjectives).values(m.objectives.map((obj, oIdx) => ({
                        moduleId: newModule.id,
                        descricao: typeof obj === 'string' ? obj : obj.descricao,
                        ordem: oIdx + 1
                    })));
                }
            }
        }
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
        // ── Passo 1: Busca a empresa pelo ID ────────────────────────────────────
        const [company] = await db_1.db.select().from(schema_1.companies).where((0, drizzle_orm_1.eq)(schema_1.companies.id, alunoId));
        if (!company) {
            throw new Error('aluno_not_found');
        }
        // ── Passo 2: Verificação de autorização ──────────────────────────────────
        let isAuthorized = company.mentorId === mentorId;
        if (!isAuthorized) {
            const journeyList = await db_1.db.select({ turmaId: schema_1.journeys.turmaId })
                .from(schema_1.journeys)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.journeys.companyId, alunoId)));
            const turmaIds = journeyList
                .filter(j => j.turmaId != null)
                .map(j => j.turmaId);
            console.log(`[DEBUG] journeys found: ${journeyList.length} | turmaIds with link: ${turmaIds}`);
            if (turmaIds.length > 0) {
                const turmaList = await db_1.db.select({ id: schema_1.turmas.id, mentorId: schema_1.turmas.mentorId })
                    .from(schema_1.turmas)
                    .where((0, drizzle_orm_1.inArray)(schema_1.turmas.id, turmaIds));
                console.log(`[DEBUG] turmas found:`, turmaList.map(t => `id=${t.id} mentorId=${t.mentorId}`));
                isAuthorized = turmaList.some(t => t.mentorId === mentorId);
                if (!isAuthorized) {
                    const tmList = await db_1.db.select({ mentorId: schema_1.turmaMentores.mentorId })
                        .from(schema_1.turmaMentores)
                        .where((0, drizzle_orm_1.inArray)(schema_1.turmaMentores.turmaId, turmaIds));
                    console.log(`[DEBUG] turmaMentores found:`, tmList.map(tm => `mentorId=${tm.mentorId}`));
                    isAuthorized = tmList.some(tm => tm.mentorId === mentorId);
                }
            }
        }
        console.log(`[DEBUG] isAuthorized: ${isAuthorized}`);
        if (!isAuthorized)
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
        // ── Passo 4: Buscar matriculas sem JOIN (evitando erro de tipo text vs uuid) ─────
        const matriculasList = await db_1.db.select()
            .from(schema_1.journeys)
            .where((0, drizzle_orm_1.eq)(schema_1.journeys.companyId, company.id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.journeys.createdAt));
        const matriculas = [];
        for (const m of matriculasList) {
            let produtoNome = "Mentoria Padrão";
            if (m.templateId) {
                try {
                    const [template] = await db_1.db.select({ titulo: schema_1.mentorshipTemplates.titulo })
                        .from(schema_1.mentorshipTemplates)
                        .where((0, drizzle_orm_1.eq)(schema_1.mentorshipTemplates.id, m.templateId));
                    if (template)
                        produtoNome = template.titulo;
                }
                catch (e) { }
            }
            matriculas.push({
                id: m.id,
                turmaNome: m.turmaId ? `Envolvido em Turma` : "Diagnóstico/Avulso",
                produtoNome,
                status: company.statusPrograma === 'active' ? 'Ativo' : (company.statusPrograma === 'paused' ? 'Pausado' : 'Concluído')
            });
        }
        // 4. Get modules for ALL journeys, Action Plans and Diagnostics
        const journeysData = {};
        for (const m of matriculasList) {
            const journeyModules = await db_1.db.select().from(schema_1.modules).where((0, drizzle_orm_1.eq)(schema_1.modules.journeyId, m.id)).orderBy(schema_1.modules.ordem);
            const enrichedModules = [];
            for (const mod of journeyModules) {
                const modTasks = await db_1.db.select().from(schema_1.tasks).where((0, drizzle_orm_1.eq)(schema_1.tasks.moduleId, mod.id));
                const tasksWithDeliverables = [];
                for (const t of modTasks) {
                    const taskDeliverables = await db_1.db.select().from(schema_1.deliverables).where((0, drizzle_orm_1.eq)(schema_1.deliverables.taskId, t.id));
                    tasksWithDeliverables.push({
                        ...t,
                        deliverables: taskDeliverables
                    });
                }
                enrichedModules.push({
                    id: mod.id,
                    title: mod.titulo,
                    objective: mod.objetivo,
                    status: mod.status === 'active' ? 'current' : mod.status,
                    tasks: tasksWithDeliverables
                });
            }
            let templateStructure = null;
            if (m.turmaId) {
                const turma = await db_1.db.query.turmas.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.turmas.id, m.turmaId),
                    with: {
                        template: {
                            with: {
                                modules: {
                                    with: {
                                        objectives: true
                                    }
                                }
                            }
                        }
                    }
                });
                if (turma?.template) {
                    templateStructure = turma.template;
                }
            }
            else if (m.templateId) {
                templateStructure = await db_1.db.query.mentorshipTemplates.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.mentorshipTemplates.id, m.templateId),
                    with: {
                        modules: {
                            with: {
                                objectives: true
                            }
                        }
                    }
                });
            }
            journeysData[m.id] = {
                modules: enrichedModules,
                templateStructure
            };
        }
        let templateStructure = null;
        if (matriculasList.length > 0 && journeysData[matriculasList[0].id]?.templateStructure) {
            templateStructure = journeysData[matriculasList[0].id].templateStructure;
        }
        let actionPlan = [];
        try {
            actionPlan = await db_1.db.select().from(schema_1.actionPlanItems).where((0, drizzle_orm_1.eq)(schema_1.actionPlanItems.companyId, company.id));
        }
        catch (e) { }
        let diagnostico = [];
        let score = null;
        if (company.leadId) {
            try {
                diagnostico = await db_1.db.select().from(schema_1.responses).where((0, drizzle_orm_1.eq)(schema_1.responses.leadId, company.leadId));
                const allScores = await db_1.db.select().from(schema_1.scores).where((0, drizzle_orm_1.eq)(schema_1.scores.leadId, company.leadId));
                score = allScores[0] || null;
            }
            catch (e) { }
        }
        let logbook = [];
        try {
            logbook = await db_1.db.select({
                id: schema_1.comments.id,
                texto: schema_1.comments.texto,
                createdAt: schema_1.comments.criadoEm,
                autorNome: schema_1.users.fullName
            }).from(schema_1.comments)
                .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.comments.autorId, schema_1.users.id))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.comments.alvoTipo, 'company'), (0, drizzle_orm_1.eq)(schema_1.comments.alvoId, company.id)))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.comments.criadoEm));
        }
        catch (e) { }
        const firstJourneyData = matriculasList.length > 0 ? journeysData[matriculasList[0].id] : { modules: [] };
        return {
            id: company.id,
            empresa: company.nome,
            contato: contatoInfo?.nome || "Sem Contato",
            email: contatoInfo?.email || "-",
            telefone: contatoInfo?.telefone || "-",
            statusGlobal: company.statusPrograma === 'active' ? 'Ativo' : (company.statusPrograma === 'paused' ? 'Pausado' : 'Alumni'),
            matriculas,
            steps: firstJourneyData.modules,
            journeysData,
            actionPlan,
            logbook,
            diagnostico,
            score,
            templateStructure
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
            const insertData = mentorIds.map((mId) => ({
                turmaId: novaTurma.id,
                mentorId: mId
            }));
            await db_1.db.insert(schema_1.turmaMentores).values(insertData);
        }
        return { success: true, turmaId: novaTurma.id };
    }
    static async addAlunoToTurma(turmaId, companyId, data) {
        // Obter turma para copiar templateId
        const [turma] = await db_1.db.select().from(schema_1.turmas).where((0, drizzle_orm_1.eq)(schema_1.turmas.id, turmaId));
        if (!turma)
            throw new Error("Turma não encontrada");
        // Verificar se já está matriculado nesta turma para evitar duplicatas
        const [exists] = await db_1.db.select().from(schema_1.journeys).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.journeys.companyId, companyId), (0, drizzle_orm_1.eq)(schema_1.journeys.turmaId, turmaId)));
        if (exists)
            return exists;
        // 1. Criar a nova jornada vinculada à turma
        const [novaJornada] = await db_1.db.insert(schema_1.journeys).values({
            companyId: companyId,
            turmaId: turmaId,
            templateId: turma.templateId,
            etapaAtual: "Pendente",
            progresso: 0
        }).returning();
        // 2. Se a turma tiver um template, copiar os módulos e objetivos
        if (turma.templateId) {
            const templateModules = await db_1.db.query.mentorshipTemplateModules.findMany({
                where: (0, drizzle_orm_1.eq)(schema_1.mentorshipTemplateModules.templateId, turma.templateId),
                with: {
                    objectives: true
                },
                orderBy: [schema_1.mentorshipTemplateModules.ordem]
            });
            for (const tMod of templateModules) {
                // Criar o módulo real para esta jornada
                const [newMod] = await db_1.db.insert(schema_1.modules).values({
                    journeyId: novaJornada.id,
                    ordem: tMod.ordem,
                    titulo: tMod.titulo,
                    objetivo: tMod.objetivoMacro,
                    status: tMod.ordem === 1 ? 'active' : 'locked'
                }).returning();
                // Criar as tarefas (objetivos) vinculadas a este módulo
                if (tMod.objectives && tMod.objectives.length > 0) {
                    await db_1.db.insert(schema_1.tasks).values(tMod.objectives.map((tObj) => ({
                        journeyId: novaJornada.id,
                        moduleId: newMod.id,
                        titulo: tObj.descricao,
                        status: 'pending',
                    })));
                }
            }
        }
        return novaJornada;
    }
    static async updateModuleStatus(moduleId, status) {
        return await db_1.db.update(schema_1.modules)
            .set({ status })
            .where((0, drizzle_orm_1.eq)(schema_1.modules.id, moduleId))
            .returning();
    }
    static async updateTaskStatus(taskId, status) {
        return await db_1.db.update(schema_1.tasks)
            .set({ status })
            .where((0, drizzle_orm_1.eq)(schema_1.tasks.id, taskId))
            .returning();
    }
    static async updateDeliverableStatus(deliverableId, status) {
        return await db_1.db.update(schema_1.deliverables)
            .set({ status })
            .where((0, drizzle_orm_1.eq)(schema_1.deliverables.id, deliverableId))
            .returning();
    }
    static async createTask(moduleId, journeyId, data) {
        return await db_1.db.insert(schema_1.tasks).values({
            moduleId,
            journeyId,
            titulo: data.titulo,
            descricao: data.descricao,
            status: 'pending'
        }).returning();
    }
    static async updateActionPlanStatus(itemId, status) {
        return await db_1.db.update(schema_1.actionPlanItems)
            .set({ status })
            .where((0, drizzle_orm_1.eq)(schema_1.actionPlanItems.id, itemId))
            .returning();
    }
    static async createActionPlanItem(companyId, data) {
        return await db_1.db.insert(schema_1.actionPlanItems).values({
            companyId,
            janela: data.janela,
            acao: data.acao,
            responsavel: data.responsavel,
            prazo: data.prazo ? new Date(data.prazo) : null,
            status: 'pending'
        }).returning();
    }
    static async createLogbookEntry(autorId, companyId, texto) {
        return await db_1.db.insert(schema_1.comments).values({
            autorId,
            alvoTipo: 'company',
            alvoId: companyId,
            texto,
        }).returning();
    }
    static async updateCompanyNotes(companyId, notes) {
        return await db_1.db.update(schema_1.companies)
            .set({ notes })
            .where((0, drizzle_orm_1.eq)(schema_1.companies.id, companyId))
            .returning();
    }
    static async updateDiagnosis(alunoId, data) {
        // Primeiro, tentamos encontrar a empresa para pegar o leadId
        const company = await db_1.db.query.companies.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.companies.id, alunoId)
        });
        let targetLeadId = company?.leadId;
        // Se a empresa não tem um leadId vinculado (foi criada manualmente), 
        // precisamos criar um lead "placeholder" para poder salvar as respostas
        if (!targetLeadId) {
            const [newLead] = await db_1.db.insert(schema_1.leads).values({
                nome: company?.nome || 'Aluno Manual',
                empresa: company?.nome,
                origem: 'Migração/Manual'
            }).returning();
            targetLeadId = newLead.id;
            // Atualiza a empresa com este novo leadId para futuras referências
            await db_1.db.update(schema_1.companies)
                .set({ leadId: targetLeadId })
                .where((0, drizzle_orm_1.eq)(schema_1.companies.id, alunoId));
        }
        // Tenta atualizar o registro existente de respostas
        // Garantir que apenas chaves válidas sejam enviadas
        const validData = {};
        for (let i = 1; i <= 10; i++) {
            if (data[`q${i}`] !== undefined) {
                validData[`q${i}`] = data[`q${i}`];
            }
        }
        const updated = await db_1.db.update(schema_1.responses)
            .set(validData)
            .where((0, drizzle_orm_1.eq)(schema_1.responses.leadId, targetLeadId))
            .returning();
        // Se não houver nada para atualizar (primeiro diagnóstico deste aluno), nós criamos
        if (!updated || updated.length === 0) {
            return await db_1.db.insert(schema_1.responses).values({
                leadId: targetLeadId,
                ...validData
            }).returning();
        }
        return updated;
    }
}
exports.MentorService = MentorService;
