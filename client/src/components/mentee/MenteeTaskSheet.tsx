"use client";

import { useState } from "react";
import {
    Calendar, Target, FileText, CheckSquare,
    MessageSquare, Plus, Trash2, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter
} from "@/components/ui/sheet";

// 1. Tipagens estendidas para suportar os dados do aluno
export interface Subtarefa {
    id: string;
    texto: string;
    concluida: boolean;
}

export interface TarefaMentee {
    id: string;
    titulo: string;
    objetivo: string;
    etapa: string;         // <--- ADICIONADO PARA O SEU FILTRO FUNCIONAR
    responsavel: string;   // <--- ADICIONADO PARA O SEU CARD FUNCIONAR
    detalhamento: string;
    indicador: string;
    prazo: string;
    prioridade: "Alta" | "Média" | "Baixa";
    status: "Pendente" | "Concluído";
    // Novos campos do Aluno
    subtarefas: Subtarefa[];
    notaExecucao: string;
    origem: "MENTOR" | "ALUNO";
}

interface MenteeTaskSheetProps {
    tarefa: TarefaMentee | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdateTarefa: (tarefaAtualizada: TarefaMentee) => void;
}

export function MenteeTaskSheet({ tarefa, isOpen, onClose, onUpdateTarefa }: MenteeTaskSheetProps) {
    // Estados locais para edição (inicializados quando a tarefa abre)
    const [novaSubtarefa, setNovaSubtarefa] = useState("");

    if (!tarefa) return null;

    // --- FUNÇÕES DE MANIPULAÇÃO DO ALUNO ---

    const handleAddSubtarefa = () => {
        if (!novaSubtarefa.trim()) return;

        const subtarefaNova: Subtarefa = {
            id: `sub-${Date.now()}`,
            texto: novaSubtarefa,
            concluida: false
        };

        onUpdateTarefa({
            ...tarefa,
            subtarefas: [...tarefa.subtarefas, subtarefaNova]
        });
        setNovaSubtarefa("");
    };

    const handleToggleSubtarefa = (subId: string) => {
        const subtarefasAtualizadas = tarefa.subtarefas.map(sub =>
            sub.id === subId ? { ...sub, concluida: !sub.concluida } : sub
        );
        onUpdateTarefa({ ...tarefa, subtarefas: subtarefasAtualizadas });
    };

    const handleRemoveSubtarefa = (subId: string) => {
        onUpdateTarefa({
            ...tarefa,
            subtarefas: tarefa.subtarefas.filter(sub => sub.id !== subId)
        });
    };

    const handleUpdateNota = (novaNota: string) => {
        onUpdateTarefa({ ...tarefa, notaExecucao: novaNota });
    };

    const progressoSubtarefas = tarefa.subtarefas.length > 0
        ? Math.round((tarefa.subtarefas.filter(s => s.concluida).length / tarefa.subtarefas.length) * 100)
        : 0;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="sm:max-w-[540px] overflow-y-auto p-0 flex flex-col">

                {/* 1. HEADER (Contexto da Tarefa) */}
                <SheetHeader className="px-6 py-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className={`text-xs font-bold border-0
                            ${tarefa.prioridade === 'Alta' ? 'bg-red-100 text-red-700' : ''}
                            ${tarefa.prioridade === 'Média' ? 'bg-amber-100 text-amber-700' : ''}
                            ${tarefa.prioridade === 'Baixa' ? 'bg-blue-100 text-blue-700' : ''}
                        `}>
                            Prioridade {tarefa.prioridade}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#f84f08]">
                            <Calendar className="w-3.5 h-3.5" /> Prazo: {tarefa.prazo}
                        </div>
                    </div>
                    <SheetTitle className="text-xl text-slate-800 leading-tight">
                        {tarefa.titulo}
                    </SheetTitle>
                    <SheetDescription className="flex items-center gap-2 mt-2 font-medium text-slate-600">
                        <Target className="w-4 h-4 text-[#f84f08]" />
                        Meta: {tarefa.indicador}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                    {/* 2. ÁREA SOMENTE LEITURA (Instruções do Mentor) */}
                    <div className="px-6 py-5 border-b border-slate-100 bg-white">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                            <FileText className="w-4 h-4" /> Instruções do Mentor
                        </h4>
                        <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-lg whitespace-pre-wrap">
                            {tarefa.detalhamento}
                        </div>
                    </div>

                    {/* 3. ÁREA DE TRABALHO DO ALUNO (Subtarefas) */}
                    <div className="px-6 py-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <CheckSquare className="w-4 h-4 text-[#f84f08]" /> Subtarefas da Equipe
                            </h4>
                            {tarefa.subtarefas.length > 0 && (
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                    {tarefa.subtarefas.filter(s => s.concluida).length}/{tarefa.subtarefas.length} ({progressoSubtarefas}%)
                                </span>
                            )}
                        </div>

                        {/* Input para adicionar nova subtarefa */}
                        <div className="flex items-center gap-2">
                            <Input
                                value={novaSubtarefa}
                                onChange={(e) => setNovaSubtarefa(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtarefa()}
                                placeholder="Adicionar passo prático..."
                                className="h-9 text-sm"
                            />
                            <Button size="icon" onClick={handleAddSubtarefa} className="h-9 w-9 bg-slate-800 hover:bg-slate-700 text-white shrink-0">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Lista de Subtarefas */}
                        <div className="space-y-2 mt-4">
                            {tarefa.subtarefas.map((sub) => (
                                <div key={sub.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg group transition-colors border border-transparent hover:border-slate-100">
                                    <Checkbox
                                        id={sub.id}
                                        checked={sub.concluida}
                                        onCheckedChange={() => handleToggleSubtarefa(sub.id)}
                                        className="mt-0.5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                    />
                                    <Label
                                        htmlFor={sub.id}
                                        className={`flex-1 text-sm cursor-pointer leading-tight pt-0.5 ${sub.concluida ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                                    >
                                        {sub.texto}
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveSubtarefa(sub.id)}
                                        className="h-6 w-6 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            ))}
                            {tarefa.subtarefas.length === 0 && (
                                <div className="text-center py-4 text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                                    Nenhuma subtarefa criada.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 4. NOTAS DE EXECUÇÃO */}
                    <div className="px-6 pb-8 space-y-3 border-t border-slate-100 pt-6">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-blue-500" /> Notas de Execução
                        </h4>
                        <Textarea
                            value={tarefa.notaExecucao || ""}
                            onChange={(e) => handleUpdateNota(e.target.value)}
                            placeholder="Anote aqui links, observações, ou bloqueios enfrentados pela sua equipe..."
                            className="min-h-[100px] text-sm resize-none bg-yellow-50/30 border-yellow-200/60 focus-visible:ring-yellow-400/30 placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* 5. FOOTER (Concluir Tarefa Macro) */}
                <SheetFooter className="px-6 py-4 border-t border-slate-100 bg-white shrink-0">
                    <Button
                        className={`w-full h-12 font-bold ${tarefa.status === 'Concluído'
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            }`}
                        onClick={() => onUpdateTarefa({ ...tarefa, status: tarefa.status === "Pendente" ? "Concluído" : "Pendente" })}
                    >
                        {tarefa.status === 'Concluído' ? (
                            'Reabrir Tarefa'
                        ) : (
                            <><CheckCircle2 className="w-5 h-5 mr-2" /> Marcar Ação como Concluída</>
                        )}
                    </Button>
                </SheetFooter>

            </SheetContent>
        </Sheet>
    );
}