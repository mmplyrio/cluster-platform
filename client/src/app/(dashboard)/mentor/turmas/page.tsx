import MentorDashboard from "@/components/mentor/cards";
import { TableTurmas, Turmas } from "@/components/mentor/TableTurmas";
import { ProgramDistributionChart, ChartData } from "@/components/mentor/ProgramDistributionChart";
import { BottleneckChart, BottleneckData } from "@/components/mentor/BottleneckChart";
import { NovaTurmaSheet } from "@/components/mentor/NovaTurmaSheet";

const turmas: Turmas[] = [
    { id: "1", nome: "Turma de Abril", qtdAlunos: "10", status: "Em Andamento" },
    { id: "2", nome: "Turma de Maio", qtdAlunos: "12", status: "Inscrições Abertas" },
    { id: "3", nome: "Turma de Junho", qtdAlunos: "15", status: "Concluída" },
];
const chartData: ChartData[] = [
    { name: "Turma 1", value: 400 },
    { name: "Turma 2", value: 300 },
    { name: "Turma 3", value: 200 },
    { name: "Turma 4", value: 100 },
];

const bottleneckData: BottleneckData[] = [
    { etapa: "Diagnóstico", alunosTravados: 12 },
    { etapa: "Planejamento", alunosTravados: 8 },
    { etapa: "Execução", alunosTravados: 15 },
    { etapa: "Validação", alunosTravados: 5 },
];


export default function MentorPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Turmas</h1>
                    <p className="text-slate-600">Visulize as turmas ativas e progressos.</p>
                </div>
                <NovaTurmaSheet />
            </div>
            <MentorDashboard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TableTurmas data={turmas} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ProgramDistributionChart data={chartData} />
                    <BottleneckChart data={bottleneckData} />
                </div>

            </div>

        </div>
    );
}