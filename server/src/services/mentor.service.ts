import { db } from '../db';
import { companies, leads, journeys, funnelEvents, tasks, deliverables, users, roles, mentorshipTemplates, companyUsers, modules, turmas, turmaMentores, mentorshipTemplateModules, mentorshipTemplateObjectives, actionPlanItems, responses, comments, scores } from '../db/schema';
import { eq, desc, and, isNull, ne, sql, or, inArray } from 'drizzle-orm';
import { BrevoService } from './brevo.service';

export class MentorService {
    static async getDashboard(mentorId: string) {
        // Obter as empresas/alunos vinculados a este mentor
        const rawMentees = await db.select({
            id: companies.id,
            nome: companies.nome,
            status: companies.statusPrograma,
            turma: journeys.createdAt,
            templateId: journeys.templateId,
            journeyId: journeys.id
        }).from(companies)
        .leftJoin(journeys, eq(companies.id, journeys.companyId))
        .leftJoin(turmas, eq(journeys.turmaId, turmas.id))
        .leftJoin(turmaMentores, eq(turmas.id, turmaMentores.turmaId))
        .where(or(
            eq(companies.mentorId, mentorId),
            eq(turmas.mentorId, mentorId),
            eq(turmaMentores.mentorId, mentorId)
        ));

        // Deduplicar para métricas
        const menteesList = rawMentees.reduce((acc: any[], current) => {
            if (!acc.find(item => item.id === current.id)) acc.push(current);
            return acc;
        }, []);

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
        const rawList = await db.select({
            id: companies.id,
            nome: companies.nome,
            status: companies.statusPrograma,
            turma: journeys.createdAt,
            templateId: journeys.templateId,
            templateTitulo: mentorshipTemplates.titulo,
            journeyId: journeys.id
        }).from(companies)
        .leftJoin(journeys, eq(companies.id, journeys.companyId))
        .leftJoin(turmas, eq(journeys.turmaId, turmas.id))
        .leftJoin(mentorshipTemplates, eq(turmas.templateId, mentorshipTemplates.id))
        .leftJoin(turmaMentores, eq(turmas.id, turmaMentores.turmaId))
        .where(or(
            eq(companies.mentorId, mentorId),
            eq(turmas.mentorId, mentorId),
            eq(turmaMentores.mentorId, mentorId)
        ));


        // Deduplicar por ID de empresa (mantendo a jornada mais recente se houver duplicatas)
        const deduplicated = rawList.reduce((acc: any[], current) => {
            const existing = acc.find(item => item.id === current.id);
            if (!existing) {
                acc.push(current);
            } else if (!existing.journeyId && current.journeyId) {
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

    static async getTurmas(mentorId: string) {
        // 1. Fetch real turmas
        const realTurmasRaw = await db.select({
            id: turmas.id,
            nome: turmas.nome,
            descricao: turmas.descricao,
            status: turmas.status,
            preco: turmas.preco,
            dataInicio: turmas.dataInicio,
            vagas: turmas.vagas,
            produto: mentorshipTemplates.titulo
        }).from(turmas)
        .leftJoin(mentorshipTemplates, eq(turmas.templateId, mentorshipTemplates.id))
        .leftJoin(turmaMentores, eq(turmas.id, turmaMentores.turmaId))
        .where(or(
            eq(turmas.mentorId, mentorId),
            eq(turmaMentores.mentorId, mentorId)
        ));

        // Deduplicar turmas (se o mentor estiver em mais de um papel ou duplicado no N:N)
        const realTurmas = realTurmasRaw.reduce((acc: any[], current) => {
            if (!acc.find(t => t.id === current.id)) acc.push(current);
            return acc;
        }, []);

        // 2. Fetch counts of students per turma
        const studentCounts = await db.select({
            turmaId: journeys.turmaId,
            count: sql<number>`count(${journeys.id})::int`
        }).from(journeys)
        .groupBy(journeys.turmaId);

        const countsMap = new Map(studentCounts.map(c => [c.turmaId, c.count]));

        const formattedTurmas = realTurmas.map(t => {
            let statusMapped = "Em Andamento";
            if (t.status === 'planejada') statusMapped = "Inscrições Abertas";
            if (t.status === 'concluida') statusMapped = "Concluída";
            
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
        const bottleneckRaw = await db.select({
            etapa: journeys.etapaAtual,
        })
        .from(companies)
        .innerJoin(journeys, eq(companies.id, journeys.companyId))
        .where(and(
            eq(companies.mentorId, mentorId),
            ne(companies.statusPrograma, 'alumni')
        ));

        const bottleneckMap = new Map<string, number>();
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

    static async getTurmaDetails(mentorId: string, turmaId: string) {
        const [turma] = await db.select({
            id: turmas.id,
            nome: turmas.nome,
            status: turmas.status,
            templateId: turmas.templateId,
            mentoriaNome: mentorshipTemplates.titulo
        }).from(turmas)
        .leftJoin(mentorshipTemplates, eq(turmas.templateId, mentorshipTemplates.id))
        .leftJoin(turmaMentores, eq(turmas.id, turmaMentores.turmaId))
        .where(and(
            eq(turmas.id, turmaId),
            or(
                eq(turmas.mentorId, mentorId),
                eq(turmaMentores.mentorId, mentorId)
            )
        ));

        if (!turma) {
            throw new Error("Turma não encontrada");
        }

        // Busca alunos da turma através do vínculo da jornada com a turma
        // Simplificado para evitar duplicatas causadas pelos joins de mentores
        // Usamos groupBy para garantir que cada empresa apareça apenas uma vez na lista da turma
        const menteesList = await db.select({
            id: companies.id,
            nome: companies.nome,
            status: companies.statusPrograma,
            templateId: sql<string>`max(${journeys.templateId})`,
            progresso: sql<number>`max(${journeys.progresso})`
        }).from(companies)
        .innerJoin(journeys, eq(companies.id, journeys.companyId))
        .where(eq(journeys.turmaId, turmaId))
        .groupBy(companies.id);



        const avgProgress = menteesList.length > 0 
            ? Math.round(menteesList.reduce((acc, curr) => acc + (curr.progresso || 0), 0) / menteesList.length) 
            : 0;

        let statusMapped = "Em Andamento";
        if (turma.status === 'planejada') statusMapped = "Inscrições Abertas";
        if (turma.status === 'concluida') statusMapped = "Concluída";

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

    static async createMentorshipTemplate(mentorId: string, data: any) {
        const { modules: incomingModules, ...templateData } = data;

        const [newTemplate] = await db.insert(mentorshipTemplates).values({
            ...templateData,
            mentorId,
            status: templateData.status || 'Ativo',
            preco: templateData.preco ? templateData.preco.toString() : '0',
        }).returning();

        if (incomingModules && incomingModules.length > 0) {
            for (let mIdx = 0; mIdx < incomingModules.length; mIdx++) {
                const m = incomingModules[mIdx];
                const [newModule] = await db.insert(mentorshipTemplateModules).values({
                    templateId: newTemplate.id,
                    ordem: mIdx + 1,
                    titulo: m.titulo,
                    objetivoMacro: m.objetivoMacro
                }).returning();

                if (m.objectives && m.objectives.length > 0) {
                    await db.insert(mentorshipTemplateObjectives).values(
                        m.objectives.map((obj: any, oIdx: number) => ({
                            moduleId: newModule.id,
                            descricao: typeof obj === 'string' ? obj : (obj.descricao || obj.titulo),
                            ordem: oIdx + 1
                        }))
                    );
                }
            }
        }

        return newTemplate;
    }

    static async getMentorshipTemplate(id: string, mentorId: string) {
        const template = await db.query.mentorshipTemplates.findFirst({
            where: and(
                eq(mentorshipTemplates.id, id),
                eq(mentorshipTemplates.mentorId, mentorId)
            ),
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

    static async updateMentorshipTemplate(id: string, mentorId: string, data: any) {
        const { modules: incomingModules, ...templateData } = data;

        // 1. Update the template basic info
        const [updated] = await db.update(mentorshipTemplates)
            .set({
                ...templateData,
                updatedAt: new Date()
            })
            .where(and(
                eq(mentorshipTemplates.id, id),
                eq(mentorshipTemplates.mentorId, mentorId)
            ))
            .returning();

        if (!updated) return null;

        // 2. Handle modules if provided
        if (incomingModules) {
            // Simple approach: delete and recreate modules/objectives for the template
            // In production, we'd want a more surgical sync, but for now this works.
            await db.delete(mentorshipTemplateModules).where(eq(mentorshipTemplateModules.templateId, id));

            for (let mIdx = 0; mIdx < incomingModules.length; mIdx++) {
                const m = incomingModules[mIdx];
                const [newModule] = await db.insert(mentorshipTemplateModules).values({
                    templateId: id,
                    ordem: mIdx + 1,
                    titulo: m.titulo,
                    objetivoMacro: m.objetivoMacro
                }).returning();

                if (m.objectives && m.objectives.length > 0) {
                    await db.insert(mentorshipTemplateObjectives).values(
                        m.objectives.map((obj: any, oIdx: number) => ({
                            moduleId: newModule.id,
                            descricao: typeof obj === 'string' ? obj : obj.descricao,
                            ordem: oIdx + 1
                        }))
                    );
                }
            }
        }

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

        // 4.5. Vincular o usuário de contato à Empresa
        await db.insert(companyUsers).values({
            companyId: newCompany.id,
            userId: user.id,
            papelNoCaso: 'contato',
        });

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

    static async getAlunoDetails(mentorId: string, alunoId: string) {
        // ── Passo 1: Busca a empresa pelo ID ────────────────────────────────────
        const [company] = await db.select().from(companies).where(eq(companies.id, alunoId));
        if (!company) {
            throw new Error('aluno_not_found');
        }

        // ── Passo 2: Verificação de autorização ──────────────────────────────────
        let isAuthorized = company.mentorId === mentorId;

        if (!isAuthorized) {
            const journeyList = await db.select({ turmaId: journeys.turmaId })
                .from(journeys)
                .where(and(eq(journeys.companyId, alunoId)));

            const turmaIds = journeyList
                .filter(j => j.turmaId != null)
                .map(j => j.turmaId as string);

            console.log(`[DEBUG] journeys found: ${journeyList.length} | turmaIds with link: ${turmaIds}`);

            if (turmaIds.length > 0) {
                const turmaList = await db.select({ id: turmas.id, mentorId: turmas.mentorId })
                    .from(turmas)
                    .where(inArray(turmas.id, turmaIds));

                console.log(`[DEBUG] turmas found:`, turmaList.map(t => `id=${t.id} mentorId=${t.mentorId}`));
                isAuthorized = turmaList.some(t => t.mentorId === mentorId);

                if (!isAuthorized) {
                    const tmList = await db.select({ mentorId: turmaMentores.mentorId })
                        .from(turmaMentores)
                        .where(inArray(turmaMentores.turmaId, turmaIds));

                    console.log(`[DEBUG] turmaMentores found:`, tmList.map(tm => `mentorId=${tm.mentorId}`));
                    isAuthorized = tmList.some(tm => tm.mentorId === mentorId);
                }
            }
        }

        console.log(`[DEBUG] isAuthorized: ${isAuthorized}`);
        if (!isAuthorized) throw new Error('aluno_not_found');

        // 2. Get the associated contact user via companyUsers
        const [companyUserLink] = await db.select().from(companyUsers).where(eq(companyUsers.companyId, company.id));
        let contatoInfo = { nome: "Sem Contato", email: "-", telefone: "-" };
        if (companyUserLink) {
            const [user] = await db.select().from(users).where(eq(users.id, companyUserLink.userId));
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
        const matriculasList = await db.select()
            .from(journeys)
            .where(eq(journeys.companyId, company.id))
            .orderBy(desc(journeys.createdAt));

        const matriculas = [];
        for (const m of matriculasList) {
            let produtoNome = "Mentoria Padrão";
            if (m.templateId) {
                try {
                    const [template] = await db.select({ titulo: mentorshipTemplates.titulo })
                        .from(mentorshipTemplates)
                        .where(eq(mentorshipTemplates.id, m.templateId as any));
                    if (template) produtoNome = template.titulo;
                } catch(e) {}
            }

            matriculas.push({
                id: m.id,
                turmaNome: m.turmaId ? `Envolvido em Turma` : "Diagnóstico/Avulso",
                produtoNome,
                status: company.statusPrograma === 'active' ? 'Ativo' : (company.statusPrograma === 'paused' ? 'Pausado' : 'Concluído')
            });
        }


        // 4. Get modules for ALL journeys, Action Plans and Diagnostics
        const journeysData: Record<string, any> = {};
        for (const m of matriculasList) {
            const journeyModules = await db.select().from(modules).where(eq(modules.journeyId, m.id)).orderBy(modules.ordem);
            
            const enrichedModules = [];
            for (const mod of journeyModules) {
                const modTasks = await db.select().from(tasks).where(eq(tasks.moduleId, mod.id));
                
                const tasksWithDeliverables = [];
                for (const t of modTasks) {
                    const taskDeliverables = await db.select().from(deliverables).where(eq(deliverables.taskId, t.id));
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

            journeysData[m.id] = {
                modules: enrichedModules
            };
        }

        let templateStructure: any = null;
        const firstJourney = matriculasList[0];
        if (firstJourney?.turmaId) {
            const turma = await db.query.turmas.findFirst({
                where: eq(turmas.id, firstJourney.turmaId),
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
        } else {
            // Se for avulso, podemos tentar pegar o template vinculado à jornada
            const journey = await db.query.journeys.findFirst({
                where: eq(journeys.companyId, company.id),
            });
            if (journey?.templateId) {
                templateStructure = await db.query.mentorshipTemplates.findFirst({
                    where: eq(mentorshipTemplates.id, journey.templateId),
                    with: {
                        modules: {
                            with: {
                                objectives: true
                            }
                        }
                    }
                });
            }
        }
        
        let actionPlan: any[] = [];
        try {
            actionPlan = await db.select().from(actionPlanItems).where(eq(actionPlanItems.companyId, company.id));
        } catch(e: any) { }

        let diagnostico: any[] = [];
        let score: any = null;
        if (company.leadId) {
            try {
                diagnostico = await db.select().from(responses).where(eq(responses.leadId, company.leadId));
                const allScores = await db.select().from(scores).where(eq(scores.leadId, company.leadId));
                score = allScores[0] || null;
            } catch(e: any) { }
        }

        let logbook: any[] = [];
        try {
            logbook = await db.select({
                id: comments.id,
                texto: comments.texto,
                createdAt: comments.criadoEm,
                autorNome: users.fullName
            }).from(comments)
            .leftJoin(users, eq(comments.autorId, users.id))
            .where(and(eq(comments.alvoTipo, 'company'), eq(comments.alvoId, company.id)))
            .orderBy(desc(comments.criadoEm));
        } catch(e: any) {}

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
        const mentores = await db.select({
            id: users.id,
            nome: users.fullName,
        }).from(users)
        .innerJoin(roles, eq(users.roleId, roles.id))
        .where(eq(roles.name, 'MENTOR'));

        return mentores.map(m => m.nome);
    }

    static async createTurma(mentorId: string, data: any) {
        // Obter os IDs dos mentores com base nos nomes passados
        // Se a API estivesse passando IDs, seria mais fácil, mas para manter o fluxo atual do Combobox que passa nomes:
        let mentorIds = [];
        if (data.mentores && data.mentores.length > 0) {
            const dbMentores = await db.select({ id: users.id, fullName: users.fullName })
                .from(users)
                .innerJoin(roles, eq(users.roleId, roles.id))
                .where(eq(roles.name, 'MENTOR'));
            
            mentorIds = data.mentores.map((nome: string) => {
                const found = dbMentores.find(m => m.fullName === nome);
                return found ? found.id : null;
            }).filter(Boolean);
        }

        // Criar a Turma
        const [novaTurma] = await db.insert(turmas).values({
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
            const insertData = mentorIds.map((mId: string) => ({
                turmaId: novaTurma.id,
                mentorId: mId
            }));
            await db.insert(turmaMentores).values(insertData);
        }

        return { success: true, turmaId: novaTurma.id };
    }

    static async addAlunoToTurma(turmaId: string, companyId: string, data: any) {
        // Obter turma para copiar templateId
        const [turma] = await db.select().from(turmas).where(eq(turmas.id, turmaId));
        if (!turma) throw new Error("Turma não encontrada");

        // Verificar se já está matriculado nesta turma para evitar duplicatas
        const [exists] = await db.select().from(journeys).where(and(
            eq(journeys.companyId, companyId),
            eq(journeys.turmaId, turmaId)
        ));
        if (exists) return exists;

        // 1. Criar a nova jornada vinculada à turma
        const [novaJornada] = await db.insert(journeys).values({
            companyId: companyId,
            turmaId: turmaId,
            templateId: turma.templateId,
            etapaAtual: "Pendente",
            progresso: 0
        }).returning();

        // 2. Se a turma tiver um template, copiar os módulos e objetivos
        if (turma.templateId) {
            const templateModules = await db.query.mentorshipTemplateModules.findMany({
                where: eq(mentorshipTemplateModules.templateId, turma.templateId),
                with: {
                    objectives: true
                },
                orderBy: [mentorshipTemplateModules.ordem]
            });

            for (const tMod of templateModules) {
                // Criar o módulo real para esta jornada
                const [newMod] = await db.insert(modules).values({
                    journeyId: novaJornada.id,
                    ordem: tMod.ordem,
                    titulo: tMod.titulo,
                    objetivo: tMod.objetivoMacro,
                    status: tMod.ordem === 1 ? 'active' : 'locked'
                }).returning();

                // Criar as tarefas (objetivos) vinculadas a este módulo
                if (tMod.objectives && tMod.objectives.length > 0) {
                    await db.insert(tasks).values(
                        tMod.objectives.map((tObj: any) => ({
                            journeyId: novaJornada.id,
                            moduleId: newMod.id,
                            titulo: tObj.descricao,
                            status: 'pending',
                        }))
                    );
                }
            }
        }

        return novaJornada;
    }

    static async updateModuleStatus(moduleId: string, status: string) {
        return await db.update(modules)
            .set({ status })
            .where(eq(modules.id, moduleId))
            .returning();
    }

    static async updateTaskStatus(taskId: string, status: string) {
        return await db.update(tasks)
            .set({ status })
            .where(eq(tasks.id, taskId))
            .returning();
    }

    static async updateDeliverableStatus(deliverableId: string, status: string) {
        return await db.update(deliverables)
            .set({ status })
            .where(eq(deliverables.id, deliverableId))
            .returning();
    }

    static async createTask(moduleId: string, journeyId: string, data: any) {
        return await db.insert(tasks).values({
            moduleId,
            journeyId,
            titulo: data.titulo,
            descricao: data.descricao,
            status: 'pending'
        }).returning();
    }

    static async updateActionPlanStatus(itemId: string, status: string) {
        return await db.update(actionPlanItems)
            .set({ status })
            .where(eq(actionPlanItems.id, itemId))
            .returning();
    }

    static async createActionPlanItem(companyId: string, data: any) {
        return await db.insert(actionPlanItems).values({
            companyId,
            janela: data.janela,
            acao: data.acao,
            responsavel: data.responsavel,
            prazo: data.prazo ? new Date(data.prazo) : null,
            status: 'pending'
        }).returning();
    }

    static async createLogbookEntry(autorId: string, companyId: string, texto: string) {
        return await db.insert(comments).values({
            autorId,
            alvoTipo: 'company',
            alvoId: companyId,
            texto,
        }).returning();
    }

    static async updateCompanyNotes(companyId: string, notes: string) {
        return await db.update(companies)
            .set({ notes })
            .where(eq(companies.id, companyId))
            .returning();
    }

    static async updateDiagnosis(alunoId: string, data: any) {
        // Primeiro, tentamos encontrar a empresa para pegar o leadId
        const company = await db.query.companies.findFirst({
            where: eq(companies.id, alunoId)
        });

        let targetLeadId = company?.leadId;

        // Se a empresa não tem um leadId vinculado (foi criada manualmente), 
        // precisamos criar um lead "placeholder" para poder salvar as respostas
        if (!targetLeadId) {
            const [newLead] = await db.insert(leads).values({
                nome: company?.nome || 'Aluno Manual',
                empresa: company?.nome,
                origem: 'Migração/Manual'
            }).returning();
            
            targetLeadId = newLead.id;

            // Atualiza a empresa com este novo leadId para futuras referências
            await db.update(companies)
                .set({ leadId: targetLeadId })
                .where(eq(companies.id, alunoId));
        }

        // Tenta atualizar o registro existente de respostas
        // Garantir que apenas chaves válidas sejam enviadas
        const validData: any = {};
        for (let i = 1; i <= 10; i++) {
            if (data[`q${i}`] !== undefined) {
                validData[`q${i}`] = data[`q${i}`];
            }
        }

        const updated = await db.update(responses)
            .set(validData)
            .where(eq(responses.leadId, targetLeadId))
            .returning();

        // Se não houver nada para atualizar (primeiro diagnóstico deste aluno), nós criamos
        if (!updated || updated.length === 0) {
            return await db.insert(responses).values({
                leadId: targetLeadId,
                ...validData
            }).returning();
        }

        return updated;
    }
}
