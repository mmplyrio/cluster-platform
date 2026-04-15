import Link from "next/link";
import { ArrowLeft, Users, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/mentor/StatCard";
import { TableMentee, Mentee } from "@/components/mentor/TableMentee"; // Reutilizando nosso componente!
import { AdicionarAlunoSheet } from "@/components/mentor/NovoAlunoSheet";
import { NovoAvisoSheet } from "@/components/mentor/NovoAvisoSheet";
// 1. Tipagem para receber o ID dinâmico da URL
interface TurmaDetalheProps {
    params: {
        turmaId: string;
    };
}

export default function TurmaDetalhePage({ params }: TurmaDetalheProps) {
    // 2. Extraímos o ID que veio na URL
    const { turmaId } = params;

    // No futuro: const turma = await db.query.turmas.findFirst({ where: { id: turmaId } })
    // Por enquanto, simulamos os dados baseados no ID
    const nomeDaTurma = turmaId === 'agosto-2026' ? 'Turma Agosto 2026' : `Turma ${turmaId}`;

    // Simulando os alunos desta turma específica
    const alunosDestaTurma: Mentee[] = [
        { id: "A01", nome: "Empresa XPTO Ltda", turma: nomeDaTurma, status: "Ativo" },
        { id: "A02", nome: "Comercial Silva", turma: nomeDaTurma, status: "Pausado" },
    ];

    return (
        <div className="space-y-6">
            {/* CABEÇALHO COM BOTÃO DE VOLTAR */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <Button variant="ghost" size="sm" className="mb-2 -ml-3 text-slate-500 hover:text-slate-900" asChild>
                        <Link href="/mentor/turmas">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Turmas
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-800">{nomeDaTurma}</h1>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            Em Andamento
                        </span>
                    </div>
                    <p className="text-slate-500 mt-1">Mentoria: Lucro Estruturado</p>
                </div>

                <div className="flex gap-2">
                    <NovoAvisoSheet />
                    <AdicionarAlunoSheet />
                </div>
            </div>

            {/* MÉTRICAS ESPECÍFICAS DA TURMA (Reutilizando o StatCard!) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Alunos Matriculados"
                    value="15"
                    description="2 vagas restantes"
                    icon={Users}
                />
                <StatCard
                    title="Progresso Médio"
                    value="45%"
                    description="Módulo 3: Prever"
                    icon={CheckCircle}
                    iconColor="text-emerald-500"
                />
                <StatCard
                    title="Próxima Sessão"
                    value="18/Ago"
                    description="Revisão de Fluxo de Caixa"
                    icon={Clock}
                    iconColor="text-[#f84f08]"
                />
            </div>

            {/* TABELA DE ALUNOS (Reutilizando a TableMentee!) */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Empresas Participantes</h2>
                {/* Lembra que fizemos esse componente ser 'burro'? Agora ele brilha! */}
                <TableMentee data={alunosDestaTurma} />
            </div>
        </div>
    );
}