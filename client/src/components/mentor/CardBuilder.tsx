"use client";

import { StatCard } from "./StatCard";
import { TrendingUp, Users, Settings } from "lucide-react";

interface CardBuilderProps {
    stats: {
        totalFaturamento: string;
        totalAlunos: number;
        produtosAtivos: string;
    }
}

export function CardBuilder({ stats }: CardBuilderProps) {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title="Faturamento Total"
                value={stats.totalFaturamento}
                description="Soma do valor de todos os contratos"
                icon={TrendingUp}
                iconColor="text-emerald-600"
                linkText="Ver Financeiro"
                linkUrl="/mentor/financeiro"
            />
            <StatCard
                title="Total de Alunos"
                value={stats.totalAlunos}
                description="Alunos matriculados na base"
                icon={Users}
                iconColor="text-[#f84f08]"
                linkText="Ver CRM"
                linkUrl="/mentor/crm"
            />
            <StatCard
                title="Produtos Ativos"
                value={stats.produtosAtivos}
                description="Status do portfólio atual"
                icon={Settings}
                iconColor="text-blue-600"
                linkText="Gerenciar"
                linkUrl="/mentor/builder"
            />
        </div>
    );
}
