"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    MessageSquare,
    Megaphone,
    Radar,
    Search,
    Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    {
        title: "Mensagens",
        href: "/mentor/comunicacao/inbox",
        icon: MessageSquare,
        description: "Chat com alunos e turmas"
    },
    {
        title: "Mural de Avisos",
        href: "/mentor/comunicacao/broadcast",
        icon: Megaphone,
        description: "Comunicados e notícias"
    },
    {
        title: "Radar de Prazos",
        href: "/mentor/comunicacao/radar",
        icon: Radar,
        description: "Vencimentos e cobranças"
    },
];

export default function ComunicacaoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">

            {/* SIDEBAR DESKTOP - PRESERVADA INTACTA */}
            <aside className="hidden lg:flex w-80 border-r border-slate-100 flex-col bg-slate-50/50 shrink-0">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-800">Comunicação</h2>
                    <p className="text-xs text-slate-500 mt-1">Central de interação da Cluster</p>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-start gap-3 p-3 rounded-xl transition-all group",
                                    isActive
                                        ? "bg-white shadow-sm border border-slate-200 text-[#f84f08]"
                                        : "text-slate-600 hover:bg-slate-100/80"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 mt-0.5",
                                    isActive ? "text-[#f84f08]" : "text-slate-400 group-hover:text-slate-600"
                                )} />
                                <div>
                                    <span className="block text-sm font-bold">{item.title}</span>
                                    <span className="block text-[10px] opacity-70 font-medium">
                                        {item.description}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* BOTÃO DE CONFIGURAÇÕES DE NOTIFICAÇÃO (OPCIONAL) */}
                <div className="p-4 border-t border-slate-100">
                    <button className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors w-full px-2">
                        <Settings2 className="w-4 h-4" />
                        Configurar Notificações
                    </button>
                </div>
            </aside>

            {/* NAVEGAÇÃO MOBILE - NOVA UI/UX */}
            <aside className="lg:hidden w-full border-b border-slate-100 bg-slate-50/50 shrink-0">
                <nav className="flex px-3 py-3 overflow-x-auto gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {menuItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href + "-mobile"}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 p-2 px-4 rounded-full transition-all whitespace-nowrap shrink-0",
                                    isActive
                                        ? "bg-[#f84f08] text-white shadow-sm"
                                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-4 h-4",
                                    isActive ? "text-white" : "text-slate-400"
                                )} />
                                <span className="block text-sm font-bold">{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* ÁREA DE CONTEÚDO DINÂMICO */}
            <main className="flex-1 flex flex-col min-w-0 bg-white relative">
                {children}
            </main>
        </div>
    );
}