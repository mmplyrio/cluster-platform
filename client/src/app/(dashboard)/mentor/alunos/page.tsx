import { Building2, Users, AlertTriangle, Trophy } from "lucide-react";

// Importações dos nossos componentes
import { StatCard } from "@/components/mentor/StatCard";
import { CadAlunoSheet } from "@/components/mentor/CadAlunoSheet";
import { NovoAvisoSheet } from "@/components/mentor/NovoAvisoSheet";
import { CRMContent } from "@/components/mentor/CRMContent";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getAlunosData() {
    const token = (await cookies()).get('session')?.value;
    if (!token) redirect('/login');

    const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${apiUrl}/mentor/alunos`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
    });

    if (!res.ok) {
        return { stats: null, clientes: [] };
    }

    const json = await res.json();
    return json.data || { stats: null, clientes: [] };
}

export default async function GestaoDeAlunos() {
    const { stats, clientes } = await getAlunosData();

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

            {/* Linha de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total de Empresas"
                    value={stats?.totalEmpresas || 0}
                    description="Cadastradas na base"
                    icon={Building2}
                />
                <StatCard
                    title="Em Mentoria Ativa"
                    value={stats?.emMentoriaAtiva || 0}
                    description="Vinculadas a turmas"
                    icon={Users}
                    iconColor="text-emerald-500"
                />
                <StatCard
                    title="Atenção Necessária"
                    value={stats?.atencaoNecessaria || 0}
                    description="Alunos pausados/risco"
                    icon={AlertTriangle}
                    iconColor="text-amber-500"
                />
                <StatCard
                    title="Taxa de Conclusão"
                    value={stats?.taxaConclusao || "0%"}
                    description="Histórico geral"
                    icon={Trophy}
                    iconColor="text-blue-500"
                />
            </div>

            {/* Área da Tabela com Filtros Funcionais */}
            <CRMContent clientes={clientes} />
        </div>
    );
}