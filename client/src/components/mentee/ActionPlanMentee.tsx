"use client";

import { useState } from "react";
import {
    Calendar, User, CheckCircle2, Plus,
    MessageSquare, CheckSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { MenteeTaskSheet, TarefaMentee } from "./MenteeTaskSheet";
import { NovaAcaoEquipeSheet } from "./NovaAcaoEquipeSheet"; // <--- Importando o novo Sheet

const ETAPAS_DINAMICAS = ["0-30 Dias (Emergencial)", "31-60 Dias (Estruturação)", "61-90 Dias (Otimização)"];

export function ActionPlanMentee({ tarefasIniciais = [] }: { tarefasIniciais?: TarefaMentee[] }) {

    // Utilizar os dados vindos do backend como estado inicial
    const [tarefas, setTarefas] = useState<TarefaMentee[]>(tarefasIniciais);

    const [tarefaSelecionada, setTarefaSelecionada] = useState<TarefaMentee | null>(null);
    const [isNovaAcaoOpen, setIsNovaAcaoOpen] = useState(false); // Estado para o modal novo

    const toggleStatusTarefa = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setTarefas(tarefas.map(t =>
            t.id === id ? { ...t, status: t.status === "Pendente" ? "Concluído" : "Pendente" } : t
        ));
        if (tarefaSelecionada?.id === id) {
            setTarefaSelecionada({ ...tarefaSelecionada, status: tarefaSelecionada.status === "Pendente" ? "Concluído" : "Pendente" });
        }
    };

    const handleUpdateTarefa = (tarefaAtualizada: TarefaMentee) => {
        setTarefas(tarefas.map(t => t.id === tarefaAtualizada.id ? tarefaAtualizada : t));
        setTarefaSelecionada(tarefaAtualizada);
    };

    // Função que recebe a nova tarefa do Sheet de criação
    const handleAdicionarAcaoEquipe = (novaTarefa: TarefaMentee) => {
        setTarefas([...tarefas, novaTarefa]);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Plano de Execução</h3>
                    <p className="text-sm text-slate-500">Acompanhe as ações propostas pelo mentor e adicione demandas operacionais da sua equipe.</p>
                </div>
                {/* Botão agora abre o estado isNovaAcaoOpen */}
                <Button className="bg-[#f84f08] hover:bg-[#d94205] text-white font-bold" onClick={() => setIsNovaAcaoOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Nova Ação da Equipe
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {ETAPAS_DINAMICAS.map((colunaDin) => (
                    <div key={colunaDin} className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[400px]">

                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                            <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">{colunaDin}</h4>
                            <Badge variant="secondary" className="bg-white text-slate-600 border-slate-200">
                                {tarefas.filter(t => t.etapa === colunaDin).length}
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            {tarefas.filter(t => t.etapa === colunaDin).map((tarefa) => (
                                <div
                                    key={tarefa.id}
                                    onClick={() => setTarefaSelecionada(tarefa)}
                                    className={`p-4 rounded-lg border shadow-sm transition-all bg-white relative group cursor-pointer hover:shadow-md
                                        ${tarefa.status === 'Concluído' ? 'opacity-60 bg-slate-50' : 'hover:border-blue-500/30'}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-2">

                                        {/* LÓGICA DE BADGE VISUAL: Diferenciando Mentor x Aluno */}
                                        {tarefa.origem === 'ALUNO' ? (
                                            <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border border-blue-100 text-[9px] uppercase font-bold">
                                                Ação da Equipe
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className={`text-[10px] px-2 py-0 font-bold border-0
                                                ${tarefa.prioridade === 'Alta' ? 'bg-red-100 text-red-700' : ''}
                                                ${tarefa.prioridade === 'Média' ? 'bg-amber-100 text-amber-700' : ''}
                                                ${tarefa.prioridade === 'Baixa' ? 'bg-blue-100 text-blue-700' : ''}
                                            `}>
                                                Meta Mentor: {tarefa.prioridade}
                                            </Badge>
                                        )}

                                        <button
                                            onClick={(e) => toggleStatusTarefa(tarefa.id, e)}
                                            className="text-slate-300 hover:text-emerald-500 transition-colors z-10"
                                        >
                                            {tarefa.status === 'Concluído' ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-emerald-400" />
                                            )}
                                        </button>
                                    </div>

                                    <h5 className={`text-sm font-bold leading-tight mb-3 pr-4 
                                        ${tarefa.status === 'Concluído' ? 'line-through text-slate-500' : 'text-slate-800'}
                                    `}>
                                        {tarefa.titulo}
                                    </h5>

                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" /> {tarefa.prazo}
                                        </div>
                                        <div className="flex items-center gap-1.5 truncate max-w-[120px]">
                                            <User className={`w-3.5 h-3.5 shrink-0 ${tarefa.origem === 'ALUNO' ? 'text-blue-500' : 'text-slate-500'}`} />
                                            <span className="truncate">{tarefa.responsavel}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-50 text-[11px] font-bold text-slate-400">
                                        {tarefa.subtarefas?.length > 0 && (
                                            <div className="flex items-center gap-1.5">
                                                <CheckSquare className={`w-3.5 h-3.5 ${tarefa.subtarefas.every(s => s.concluida) ? 'text-emerald-500' : ''}`} />
                                                <span className={tarefa.subtarefas.every(s => s.concluida) ? 'text-emerald-600' : ''}>
                                                    {tarefa.subtarefas.filter(s => s.concluida).length}/{tarefa.subtarefas.length}
                                                </span>
                                            </div>
                                        )}
                                        {tarefa.notaExecucao && tarefa.notaExecucao.trim() !== "" && (
                                            <div className="flex items-center gap-1.5">
                                                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* VISUALIZAR / EDITAR TAREFA (O Sheet que já existia) */}
            <MenteeTaskSheet
                tarefa={tarefaSelecionada}
                isOpen={!!tarefaSelecionada}
                onClose={() => setTarefaSelecionada(null)}
                onUpdateTarefa={handleUpdateTarefa}
            />

            {/* CRIAR NOVA TAREFA (O novo Sheet) */}
            <NovaAcaoEquipeSheet
                isOpen={isNovaAcaoOpen}
                onClose={() => setIsNovaAcaoOpen(false)}
                etapasDisponiveis={ETAPAS_DINAMICAS}
                onSalvar={handleAdicionarAcaoEquipe}
            />
        </div>
    );
}