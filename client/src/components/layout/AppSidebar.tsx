"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ListTodo,
    FolderGit2,
    MessageSquare,
    TrendingUp,
    Settings,
    Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

const MENTORADO_LINKS = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Minha Trilha", href: "/dashboard/trilha", icon: FolderGit2 },
    { title: "Tarefas Pendentes", href: "/dashboard/tarefas", icon: ListTodo },
    { title: "Recursos e Biblioteca", href: "/dashboard/recursos", icon: Briefcase },
    { title: "Mensagens", href: "/dashboard/mensagens", icon: MessageSquare },
    { title: "Plano e Metas", href: "/dashboard/indicadores", icon: TrendingUp },
];

const MENTOR_LINKS = [
    { title: "Minha Carteira", href: "/dashboard", icon: LayoutDashboard },
    { title: "Análise de Entregas", href: "/dashboard/analise", icon: ListTodo },
    { title: "Biblioteca Template", href: "/dashboard/templates", icon: FolderGit2 },
    { title: "Mensagens", href: "/dashboard/mensagens", icon: MessageSquare },
    { title: "Acompanhamento", href: "/dashboard/acompanhamento", icon: TrendingUp },
    { title: "Configurações", href: "/dashboard/config", icon: Settings },
];

interface AppSidebarProps {
    userRole: 'mentor' | 'mentorado';
    userName?: string;
}

export function AppSidebar({ userRole, userName = "Usuário Teste" }: AppSidebarProps) {
    const pathname = usePathname();
    const links = userRole === "mentorado" ? MENTORADO_LINKS : MENTOR_LINKS;

    return (
        <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border hidden md:flex transition-all duration-300">
            {/* Logo Area */}
            <div className="flex h-16 items-center border-b border-sidebar-border/50 px-6 font-semibold bg-sidebar/95">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center font-bold text-white shadow-sm">
                        C
                    </div>
                    <span className="tracking-tight text-white">Mentoria Cluster</span>
                </div>
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-1 px-3">
                    <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                        {userRole === "mentorado" ? "Sua Jornada" : "Gestão da Mentoria"}
                    </div>
                    
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors font-medium text-sm",
                                    isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.title}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User Bottom Info */}
            <div className="border-t border-sidebar-border/50 p-4">
                <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
                    <div className="h-9 w-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center font-bold text-sidebar-primary">
                        {userName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold truncate text-white max-w-[120px]" title={userName}>
                            {userName}
                        </span>
                        <span className="text-xs text-sidebar-foreground/70 uppercase tracking-widest">{userRole}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
