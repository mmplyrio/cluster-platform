import { StatCard } from "@/components/mentor/StatCard";
import { NotebookPen, Users, FileWarning, Calendar } from "lucide-react";

export default function MentorDashboard() {
    // Array de dados simulando o que virá do seu banco de dados (Drizzle/Supabase)
    const metricas = [
        {
            title: "Turmas Ativas",
            value: 4,
            description: "Mentorias em andamento",
            icon: NotebookPen,
            iconColor: "text-[#f84f08]", // Sua cor original mantida aqui!
            linkText: "Ver todas as turmas",
            linkUrl: "/mentor/turmas"
        },
        {
            title: "Alunos Ativos",
            value: 28,
            description: "Acessaram nos últimos 7 dias",
            icon: Users,
            iconColor: "text-blue-500",
            linkText: "Gerenciar alunos",
            linkUrl: "/mentor/alunos"
        },
        {
            title: "Revisões Pendentes",
            value: 12,
            description: "Aguardando sua análise",
            icon: FileWarning,
            iconColor: "text-amber-500",
            linkText: "Ir para Inbox",
            linkUrl: "/mentor/comunicacao"
        },
        {
            title: "Sessões na Semana",
            value: 3,
            description: "Próxima hoje, 14h",
            icon: Calendar,
            iconColor: "text-emerald-500",
            linkText: "Ver agenda",
            linkUrl: "/mentor/turmas"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {metricas.map((item, index) => (
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