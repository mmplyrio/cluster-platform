import Link from "next/link";
import { ArrowLeft, Users, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/mentor/StatCard";
import { TableCRM } from "@/components/mentor/TableCRM";
import { AdicionarAlunoSheet } from "@/components/mentor/NovoAlunoSheet";
import { NovoAvisoSheet } from "@/components/mentor/NovoAvisoSheet";
import { getTurmaDetailsAction } from "@/actions/mentor";
import { notFound } from "next/navigation";

// 1. Tipagem para receber o ID dinâmico da URL
interface TurmaDetalheProps {
    params: {
        turmaId: string;
    };
}

export default async function TurmaDetalhePage({ params }: TurmaDetalheProps) {
    // 2. Extraímos o ID que veio na URL
    const { turmaId } = await params;
    
    // Buscar dados reais do backend
    const data = await getTurmaDetailsAction(turmaId);

    if (!data) {
        notFound();
    }

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
                        <h1 className="text-2xl font-bold text-slate-800">{data.nome}</h1>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            {data.status}
                        </span>
                    </div>
                    <p className="text-slate-500 mt-1">Mentoria: {data.mentoria}</p>
                </div>

                <div className="flex gap-2">
                    <NovoAvisoSheet />
                    <AdicionarAlunoSheet turmaId={turmaId} />
                </div>
            </div>

            {/* MÉTRICAS ESPECÍFICAS DA TURMA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.metricas.map((stat: any) => {
                    const isProgress = stat.title.includes('Progresso');
                    const isSession = stat.title.includes('Sessão');
                    const isStudents = stat.title.includes('Alunos');
                    
                    return (
                        <StatCard
                            key={stat.title}
                            title={stat.title}
                            value={stat.value}
                            description={stat.description}
                            icon={isStudents ? Users : (isProgress ? CheckCircle : Clock)}
                            iconColor={isProgress ? "text-emerald-500" : (isSession ? "text-[#f84f08]" : "text-slate-400")}
                        />
                    );
                })}
            </div>

            {/* TABELA DE ALUNOS */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Empresas Participantes</h2>
                <TableCRM variant="dashboard" data={data.alunos} />
            </div>
        </div>
    );
}