"use client";

import { Building2, Mail, Phone, User, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// 1. Tipagem dos Vínculos (Mentorias que a empresa comprou)
export interface Matricula {
    id: string;
    turmaNome: string;
    produtoNome: string;
    status: "Ativo" | "Concluído" | "Pausado";
}

// 2. Tipagem dos Dados do Aluno
export interface StudentProfileProps {
    id: string;
    empresa: string;
    contato: string;
    email: string;
    telefone: string;
    statusGlobal: "Ativo" | "Pausado" | "Alumni";
    matriculas: Matricula[];
}

interface ComponentProps {
    student?: StudentProfileProps;
    selectedJourneyId?: string | null;
    onJourneyChange?: (id: string) => void;
}

export function StudentProfileHeader({ student, selectedJourneyId, onJourneyChange }: ComponentProps) {
    // Mock de dados caso o componente seja chamado sem props (útil para testarmos agora)
    const dadosAluno = student || {
        id: "A01",
        empresa: "Tech Solutions Ltda",
        contato: "João Paulo",
        email: "joao.paulo@techsolutions.com.br",
        telefone: "(11) 98765-4321",
        statusGlobal: "Ativo",
        matriculas: [
            { id: "m1", turmaNome: "Turma Agosto 2026", produtoNome: "Lucro Estruturado", status: "Ativo" },
            { id: "m2", turmaNome: "Turma Janeiro 2025", produtoNome: "Máquina de Vendas", status: "Concluído" }
        ]
    };

    // Pega as iniciais da empresa para o Avatar (ex: "Tech Solutions" -> "TS")
    const iniciais = dadosAluno.empresa
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    // Use o ID selecionado ou faça o fallback para o primeiro disponível
    const currentJourneyId = selectedJourneyId || dadosAluno.matriculas[0]?.id;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">

            {/* LADO ESQUERDO: Identidade do Cliente */}
            <div className="flex gap-4 items-center">
                <Avatar className="h-16 w-16 border-2 border-slate-100">
                    <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xl">
                        {iniciais}
                    </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-slate-800">{dadosAluno.empresa}</h2>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
                            ${dadosAluno.statusGlobal === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : ''}
                            ${dadosAluno.statusGlobal === 'Pausado' ? 'bg-amber-100 text-amber-700' : ''}
                            ${dadosAluno.statusGlobal === 'Alumni' ? 'bg-blue-100 text-blue-700' : ''}
                        `}>
                            {dadosAluno.statusGlobal}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4 text-slate-400" />
                            {dadosAluno.contato}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-slate-400" />
                            {dadosAluno.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-slate-400" />
                            {dadosAluno.telefone}
                        </div>
                    </div>
                </div>
            </div>

            {/* LADO DIREITO: Seletor de Contexto (O Grande Diferencial SaaS) */}
            <div className="w-full md:w-auto bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <Briefcase className="w-4 h-4" />
                    <span>Contexto da Mentoria</span>
                </div>
                <Select value={currentJourneyId} onValueChange={onJourneyChange}>
                    <SelectTrigger className="w-full md:w-[280px] bg-white border-slate-300">
                        <SelectValue placeholder="Selecione a mentoria..." />
                    </SelectTrigger>
                    <SelectContent>
                        {dadosAluno.matriculas.map((mat: Matricula) => (
                            <SelectItem key={mat.id} value={mat.id}>
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-800">{mat.produtoNome}</span>
                                    <span className="text-xs text-slate-500">{mat.turmaNome} • {mat.status}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

        </div>
    );
}