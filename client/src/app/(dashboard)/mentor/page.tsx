import MentorDashboard from "@/components/mentor/cards";
import { TableMentee, Mentee } from "@/components/mentor/TableMentee";
import { AvisosList, Aviso } from "@/components/shared/AvisosList";

const alunosMockados: Mentee[] = [
    { id: "A01", nome: "Empresa XPTO Ltda", turma: "Abril 2026", status: "Ativo" },
    { id: "A02", nome: "Comercial Silva", turma: "Abril 2026", status: "Pausado" },
    { id: "A03", nome: "Tech Solutions", turma: "Janeiro 2026", status: "Concluído" },
];

const avisosDoMentor: Aviso[] = [
    { id: "1", titulo: "Atualização no Módulo 3", conteudo: "Subi uma nova planilha de DRE para a turma de Abril.", data: "12 Abr 2026", tipo: "info" },
    { id: "2", titulo: "Lembrete: Sessão Extra", conteudo: "Nossa revisão será amanhã às 14h.", data: "11 Abr 2026", tipo: "urgente" },
];

export default function MentorPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Visão Geral</h1>
                <p className="text-slate-600">Bem-vindo ao painel de controle do Mentor.</p>
            </div>
            <MentorDashboard />
            <div className="grid grid-cols-2 gap-4">
                <TableMentee data={alunosMockados} />
                <AvisosList avisos={avisosDoMentor} />
            </div>
        </div>
    );
}