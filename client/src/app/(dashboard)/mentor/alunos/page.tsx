import { Building2, Users, AlertTriangle, Trophy } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

// Importações dos nossos componentes
import { StatCard } from "@/components/mentor/StatCard";
import { CadAlunoSheet } from "@/components/mentor/CadAlunoSheet";
import { NovoAvisoSheet } from "@/components/mentor/NovoAvisoSheet";
import { CRMFiltros } from "@/components/mentor/CRMFiltros";
import { TableCRM, CRMClient } from "@/components/mentor/TableCRM";

export default function GestaoDeAlunos() {

    // Dados simulados para a tabela não ficar vazia
    const clientesGlobais: CRMClient[] = [
        { id: "1", empresa: "Tech Solutions Ltda", contato: "João Paulo", turmaAtual: "Agosto 2026 - Lucro Estruturado", ultimoAcesso: "Hoje, 10:30", status: "Ativo" },
        { id: "2", empresa: "Comercial Silva", contato: "Maria Silva", turmaAtual: "Agosto 2026 - Lucro Estruturado", ultimoAcesso: "Há 3 dias", status: "Pausado" },
        { id: "3", empresa: "Padaria do João", contato: "João Pedro", turmaAtual: null, ultimoAcesso: "Há 2 meses", status: "Alumni" },
    ];

    return (
        <div className="space-y-6">
            {/* Header com Ações */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Meus Alunos (CRM)</h1>
                    <p className="text-slate-500">Gestão global de empresas e contatos.</p>
                </div>
                <div className="flex gap-2">
                    <NovoAvisoSheet />
                    <CadAlunoSheet />
                </div>
            </div>

            {/* Linha de Métricas - CORRIGIDO: Adicionado a propriedade 'description' */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total de Empresas"
                    value="42"
                    description="Cadastradas na base"
                    icon={Building2}
                />
                <StatCard
                    title="Em Mentoria Ativa"
                    value="28"
                    description="Vinculadas a turmas"
                    icon={Users}
                    iconColor="text-emerald-500"
                />
                <StatCard
                    title="Atenção Necessária"
                    value="3"
                    description="Alunos pausados/risco"
                    icon={AlertTriangle}
                    iconColor="text-amber-500"
                />
                <StatCard
                    title="Taxa de Conclusão"
                    value="85%"
                    description="Histórico geral"
                    icon={Trophy}
                    iconColor="text-blue-500"
                />
            </div>

            {/* Área da Tabela */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-4 bg-white rounded-t-xl">
                    <CRMFiltros />
                </CardHeader>
                <CardContent className="p-0">
                    <TableCRM data={clientesGlobais} />
                </CardContent>
            </Card>
        </div>
    );
}