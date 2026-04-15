"use client";

import { useState } from "react";
import {
    Megaphone,
    Search,
    Filter,
    Eye,
    Clock,
    Users,
    CheckCircle2,
    MoreHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Importamos o componente de criação que já rascunhamos anteriormente
import { NovoAvisoSheet } from "@/components/mentor/NovoAvisoSheet";

export type UserRole = "MENTOR" | "ALUNO" | "ADMIN";

interface Aviso {
    id: string;
    titulo: string;
    conteudo: string;
    data: string;
    categoria: "Geral" | "Turma" | "Urgente";
    target: string; // Ex: "Todas as Turmas" ou "Turma Agosto"
    lidos: number;
    total: number;
    autor: string;
}

interface BroadcastMuralProps {
    userRole: UserRole;
}

export function BroadcastMural({ userRole }: BroadcastMuralProps) {
    // Mock de avisos disparados
    const [avisos] = useState<Aviso[]>([
        {
            id: "1",
            titulo: "Masterclass de Fluxo de Caixa",
            conteudo: "Pessoal, amanhã teremos nossa aula extra sobre projeções. O link já está no calendário.",
            data: "Hoje, 09:00",
            categoria: "Turma",
            target: "Turma Agosto 2026",
            lidos: 18,
            total: 22,
            autor: "Equipe Cluster"
        },
        {
            id: "2",
            titulo: "Atualização no Modelo de DRE",
            conteudo: "Subimos uma nova versão da planilha de DRE na aba de materiais. Confiram os novos campos de impostos.",
            data: "Ontem, 14:30",
            categoria: "Urgente",
            target: "Geral",
            lidos: 45,
            total: 50,
            autor: "Mentor Principal"
        }
    ]);

    const isGestor = userRole === "MENTOR" || userRole === "ADMIN";

    return (
        <div className="flex flex-col h-full bg-slate-50/30">

            {/* HEADER DO MURAL */}
            <div className="p-6 bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-[#f84f08]" />
                        Mural de Avisos
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        {isGestor
                            ? "Gerencie comunicados e acompanhe o engajamento dos alunos."
                            : "Fique por dentro das últimas atualizações da sua mentoria."}
                    </p>
                </div>

                {/* BOTÃO DE CRIAÇÃO: Só aparece para Mentores/Admins */}
                {isGestor && <NovoAvisoSheet />}
            </div>

            {/* FILTROS E BUSCA */}
            <div className="p-4 bg-white border-b border-slate-100 flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input placeholder="Buscar por título ou conteúdo..." className="pl-10 bg-slate-50 border-slate-200" />
                </div>
                <Button variant="outline" size="icon" className="shrink-0 border-slate-200">
                    <Filter className="w-4 h-4 text-slate-500" />
                </Button>
            </div>

            {/* LISTA DE AVISOS */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {avisos.map((aviso) => (
                    <div key={aviso.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                                            {aviso.autor.substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700">{aviso.autor}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                            <Clock className="w-3 h-3" /> {aviso.data}
                                        </div>
                                    </div>
                                </div>
                                <Badge className={`text-[10px] font-bold uppercase
                                    ${aviso.categoria === 'Urgente' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}
                                `}>
                                    {aviso.categoria}
                                </Badge>
                            </div>

                            <h4 className="text-base font-bold text-slate-800 mb-2">{aviso.titulo}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                {aviso.conteudo}
                            </p>

                            {/* RODAPÉ DO CARD: Diferente para cada perfil */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        Para: {aviso.target}
                                    </div>
                                </div>

                                {isGestor ? (
                                    /* MÉTRICAS PARA MENTOR */
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                                            <Eye className="w-4 h-4" />
                                            {aviso.lidos}/{aviso.total} lidos
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    /* AÇÃO PARA ALUNO */
                                    <Button size="sm" variant="ghost" className="text-xs text-[#f84f08] font-bold hover:bg-[#f84f08]/10">
                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Marcar como lido
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}