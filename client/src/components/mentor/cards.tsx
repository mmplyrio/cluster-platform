import { StatCard } from "@/components/mentor/StatCard";
import { NotebookPen, Users, FileWarning, Calendar } from "lucide-react";

export interface MetricaDash {
    title: string;
    value: number | string;
    description: string;
}

export default function MentorDashboard({ metricas }: { metricas?: MetricaDash[] }) {
    // Valores padrão ou os passados pelo backend
    const defaultMetricas = [
        {
            title: "Turmas Ativas",
            value: 0,
            description: "Mentorias em andamento",
            icon: NotebookPen,
            iconColor: "text-[#f84f08]",
            linkText: "Ver todas as turmas",
            linkUrl: "/mentor/turmas"
        },
        {
            title: "Alunos Ativos",
            value: 0,
            description: "Acessaram nos últimos 7 dias",
            icon: Users,
            iconColor: "text-blue-500",
            linkText: "Gerenciar alunos",
            linkUrl: "/mentor/alunos"
        },
        {
            title: "Revisões Pendentes",
            value: 0,
            description: "Aguardando sua análise",
            icon: FileWarning,
            iconColor: "text-amber-500",
            linkText: "Ir para Inbox",
            linkUrl: "/mentor/comunicacao"
        },
        {
            title: "Sessões na Semana",
            value: 0,
            description: "Próxima hoje, 14h",
            icon: Calendar,
            iconColor: "text-emerald-500",
            linkText: "Ver agenda",
            linkUrl: "/mentor/turmas"
        }
    ];

    const displayMetricas = defaultMetricas.map(dm => {
        const found = metricas?.find(m => m.title === dm.title);
        if (found) {
            return { ...dm, value: found.value, description: found.description || dm.description };
        }
        return dm;
    });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {displayMetricas.map((item, index) => (
                    <StatCard
                        key={index}
                        title={item.title}
                        value={item.value}
                        description={item.description}
                        icon={item.icon}
                        iconColor={item.iconColor}
                        linkText={item.linkText}
                        linkUrl={item.linkUrl}
                    />
                ))}
            </div>
        </div>
    );
}