"use client";

import { useState } from "react";
import {
    Clock,
    AlertCircle,
    Calendar,
    ChevronRight,
    User as UserIcon,
    Bell,
    CheckCircle2,
    Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type UserRole = "MENTOR" | "ALUNO" | "ADMIN";

interface TaskDeadline {
    id: string;
    titulo: string;
    aluno: string;
    prazo: string;
    prioridade: "Alta" | "Média" | "Baixa";
    categoria: "Financeiro" | "Processos" | "Estratégico";
    status: "Pendente" | "Atrasado";
}

interface RadarPrazosProps {
    userRole: UserRole;
}

export function RadarPrazos({ userRole }: RadarPrazosProps) {
    const isGestor = userRole === "MENTOR" || userRole === "ADMIN";

    // Mock de dados consolidados de todos os Planos de Ação
    const [deadlines] = useState<TaskDeadline[]>([
        { id: "1", titulo: "Renegociar dívida fornecedor X", aluno: "Tech Solutions", prazo: "2026-04-10", prioridade: "Alta", categoria: "Financeiro", status: "Atrasado" },
        { id: "2", titulo: "Mapa de Custos Fixos", aluno: "Padaria do João", prazo: "2026-04-14", prioridade: "Média", categoria: "Financeiro", status: "Pendente" },
        { id: "3", titulo: "Definir OKRs do Trimestre", aluno: "Tech Solutions", prazo: "2026-04-20", prioridade: "Alta", categoria: "Estratégico", status: "Pendente" },
    ]);

    const buckets = [
        { id: "atrasado", label: "Atrasado", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
        { id: "hoje", label: "Vence Hoje", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
        { id: "semana", label: "Próximos 7 Dias", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50/30">
            {/* HEADER */}
            <div className="p-6 bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#f84f08]" />
                        Radar de Prazos
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        {isGestor
                            ? "Visão consolidada de todos os compromissos da base."
                            : "Gerencie suas entregas e evite atrasos na sua mentoria."}
                    </p>
                </div>

                {isGestor && (
                    <div className="flex gap-2">
                        <Select defaultValue="todas">
                            <SelectTrigger className="w-[180px] h-9 bg-white">
                                <SelectValue placeholder="Filtrar Turma" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Todas as Turmas</SelectItem>
                                <SelectItem value="agosto">Agosto 2026</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* GRID DE BUCKETS (COLUNAS) */}
            <div className="flex-1 overflow-x-auto p-6">
                <div className="flex gap-6 h-full min-w-[900px]">
                    {buckets.map((bucket) => (
                        <div key={bucket.id} className="flex-1 flex flex-col min-w-[300px]">
                            <div className={cn(
                                "flex items-center justify-between p-3 rounded-t-xl border-t border-x font-bold text-xs uppercase tracking-wider shadow-sm",
                                bucket.bg, bucket.color, bucket.border
                            )}>
                                <div className="flex items-center gap-2">
                                    <bucket.icon className="w-4 h-4" />
                                    {bucket.label}
                                </div>
                                <Badge variant="secondary" className="bg-white/50 text-[10px]">
                                    {bucket.id === 'atrasado' ? '1' : bucket.id === 'hoje' ? '1' : '1'}
                                </Badge>
                            </div>

                            <div className={cn(
                                "flex-1 border border-t-0 rounded-b-xl p-3 space-y-3 bg-white/50",
                                bucket.border
                            )}>
                                {/* CARDS DE TAREFAS */}
                                {deadlines.filter(d => {
                                    if (bucket.id === "atrasado") return d.status === "Atrasado";
                                    if (bucket.id === "hoje") return d.prazo === "2026-04-14";
                                    return d.prazo > "2026-04-14";
                                }).map((task) => (
                                    <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-[#f84f08]/30 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="outline" className={`text-[9px] font-bold uppercase border-0 px-2 py-0
                                                ${task.prioridade === 'Alta' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}
                                            `}>
                                                {task.prioridade}
                                            </Badge>
                                            <span className="text-[10px] font-medium text-slate-400">{task.categoria}</span>
                                        </div>

                                        <h4 className="text-sm font-bold text-slate-800 leading-tight mb-3 group-hover:text-[#f84f08]">
                                            {task.titulo}
                                        </h4>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
                                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                                                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                                                {isGestor ? task.aluno : "Você"}
                                            </div>

                                            {isGestor ? (
                                                <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold text-[#f84f08] hover:bg-[#f84f08]/10 px-2">
                                                    <Bell className="w-3 h-3 mr-1.5" /> Cobrar
                                                </Button>
                                            ) : (
                                                <div className="text-[10px] font-bold text-slate-400 uppercase">
                                                    Pendente
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Auxiliar de classes
function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}