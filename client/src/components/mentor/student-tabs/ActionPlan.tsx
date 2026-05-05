"use client";

import { useState, useEffect } from "react";
import { Calendar, User, GripVertical, CheckCircle2, Target, BarChart, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateActionPlanStatusAction, createActionPlanItemAction } from "@/actions/mentor";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter
} from "@/components/ui/sheet";

// Importamos o componente do formulário e a tipagem
import { NovaAcaoSheet, TarefaAcao } from "./NovaAcaoSheet";

// Etapas padrão para fallback
const DEFAULT_ETAPAS = ["0-30 Dias (Emergencial)", "31-60 Dias (Estruturação)", "61-90 Dias (Otimização)"];

interface ActionPlanProps {
    studentData?: any;
}

export function ActionPlan({ studentData }: ActionPlanProps) {
    const [etapasDinamicas, setEtapasDinamicas] = useState<string[]>(DEFAULT_ETAPAS);
    const [tarefas, setTarefas] = useState<TarefaAcao[]>([]);

    // 1. Mapear dados reais do backend para o formato da UI
    const mapBackendToUI = (item: any): TarefaAcao => {
        // Se a janela for um dos códigos antigos, mapeamos para o texto legível do fallback
        let etapaNome = item.janela;
        if (item.janela === '0-30') etapaNome = '0-30 Dias (Emergencial)';
        if (item.janela === '30-60') etapaNome = '31-60 Dias (Estruturação)';
        if (item.janela === '60-90') etapaNome = '61-90 Dias (Otimização)';

        return {
            id: item.id,
            titulo: item.acao,
            objetivo: item.acao, 
            etapa: etapaNome,
            prioridade: "Alta", // fallback
            responsavel: item.responsavel || "Responsável",
            indicador: "Acompanhar",
            prazo: item.prazo ? new Date(item.prazo).toLocaleDateString('pt-BR') : "-",
            status: item.status === 'done' ? "Concluído" : "Pendente",
            detalhamento: item.acao
        };
    };

    useEffect(() => {
        // Atualizar etapas baseadas no template da mentoria
        if (studentData?.templateStructure?.modules) {
            const planModules = studentData.templateStructure.modules
                .filter((m: any) => m.titulo.startsWith('[Plano]'))
                .map((m: any) => m.titulo.replace('[Plano] ', ''));
            
            if (planModules.length > 0) {
                setEtapasDinamicas(planModules);
            } else {
                setEtapasDinamicas(DEFAULT_ETAPAS);
            }
        }

        if (studentData?.actionPlan) {
            setTarefas(studentData.actionPlan.map(mapBackendToUI));
        }
    }, [studentData]);

    const [tarefaSelecionada, setTarefaSelecionada] = useState<TarefaAcao | null>(null);

    const handleAdicionarTarefa = async (novaTarefa: TarefaAcao) => {
        // Converter de volta para o formato do banco
        // Se for uma das etapas padrão, podemos opcionalmente converter para o código '0-30'
        // Mas o ideal é salvar o nome da etapa para ser 100% dinâmico
        let janelaValue = novaTarefa.etapa;
        if (janelaValue === '0-30 Dias (Emergencial)') janelaValue = '0-30';
        if (janelaValue === '31-60 Dias (Estruturação)') janelaValue = '30-60';
        if (janelaValue === '61-90 Dias (Otimização)') janelaValue = '60-90';

        const backendData = {
            janela: janelaValue,
            acao: novaTarefa.titulo,
            responsavel: novaTarefa.responsavel,
            prazo: novaTarefa.prazo.split('/').reverse().join('-'), // simples cast de data
        };

        const res = await createActionPlanItemAction(studentData.id, backendData);
        if (res.success) {
            const created = res.data[0];
            setTarefas(prev => [...prev, mapBackendToUI(created)]);
            toast.success("Ação adicionada com sucesso!");
        } else {
            toast.error("Erro ao salvar ação: " + res.error);
        }
    };

    const toggleStatusTarefa = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        const tarefa = tarefas.find(t => t.id === id);
        if (!tarefa) return;

        const novoStatusLabel = tarefa.status === "Pendente" ? "Concluído" : "Pendente";
        const backendStatus = novoStatusLabel === "Concluído" ? "done" : "pending";

        // Update otimista
        setTarefas(prev => prev.map(t => t.id === id ? { ...t, status: novoStatusLabel } : t));
        if (tarefaSelecionada?.id === id) {
            setTarefaSelecionada({ ...tarefaSelecionada, status: novoStatusLabel });
        }

        const res = await updateActionPlanStatusAction(id, backendStatus);
        if (res.success) {
            toast.success(`Status atualizado para ${novoStatusLabel}`);
        } else {
            toast.error("Erro ao atualizar status");
            // Reverter em caso de erro
            setTarefas(prev => prev.map(t => t.id === id ? { ...t, status: tarefa.status } : t));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Plano de Ação Tático</h3>
                    <p className="text-sm text-slate-500">Acompanhe a execução das metas traçadas para este ciclo.</p>
                </div>
                <NovaAcaoSheet etapas={etapasDinamicas} onSave={handleAdicionarTarefa} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {etapasDinamicas.map((colunaDin) => (
                    <div key={colunaDin} className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 min-h-[400px]">

                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                            <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">{colunaDin}</h4>
                            <Badge variant="secondary" className="bg-white text-slate-600 border-slate-200">
                                {tarefas.filter(t => t.etapa === colunaDin).length}
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            {tarefas.filter(t => t.etapa === colunaDin).map((tarefa) => (
                                // 3. O CARD AGORA É CLICÁVEL E ABRE O MODAL
                                <div
                                    key={tarefa.id}
                                    onClick={() => setTarefaSelecionada(tarefa)}
                                    className={`p-4 rounded-lg border shadow-sm transition-all bg-white relative group cursor-pointer hover:shadow-md
                                        ${tarefa.status === 'Concluído' ? 'opacity-60 bg-slate-50' : 'hover:border-[#f84f08]/30'}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className={`text-[10px] px-2 py-0 font-bold border-0
                                            ${tarefa.prioridade === 'Alta' ? 'bg-red-100 text-red-700' : ''}
                                            ${tarefa.prioridade === 'Média' ? 'bg-amber-100 text-amber-700' : ''}
                                            ${tarefa.prioridade === 'Baixa' ? 'bg-blue-100 text-blue-700' : ''}
                                            ${tarefa.status === 'Concluído' ? 'bg-slate-200 text-slate-500' : ''}
                                        `}>
                                            {tarefa.prioridade}
                                        </Badge>

                                        <button
                                            onClick={(e) => toggleStatusTarefa(tarefa.id, e)} // Passamos o (e) para o stopPropagation
                                            className="text-slate-300 hover:text-emerald-500 transition-colors z-10"
                                            title="Marcar como concluído"
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
                                            <User className={`w-3.5 h-3.5 shrink-0 ${tarefa.responsavel.includes('Mentor') ? 'text-[#f84f08]' : 'text-emerald-600'}`} />
                                            <span className="truncate">{tarefa.responsavel}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {tarefas.filter(t => t.etapa === colunaDin).length === 0 && (
                                <div className="text-center p-4 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs font-medium">
                                    Nenhuma ação cadastrada.
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 4. O MODAL DE VISUALIZAÇÃO DOS DETALHES */}
            <Sheet open={!!tarefaSelecionada} onOpenChange={(isOpen) => !isOpen && setTarefaSelecionada(null)}>
                <SheetContent className="sm:max-w-[540px] overflow-y-auto p-0">
                    {tarefaSelecionada && (
                        <>
                            <SheetHeader className="px-6 py-6 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline" className={`text-xs font-bold border-0
                                        ${tarefaSelecionada.prioridade === 'Alta' ? 'bg-red-100 text-red-700' : ''}
                                        ${tarefaSelecionada.prioridade === 'Média' ? 'bg-amber-100 text-amber-700' : ''}
                                        ${tarefaSelecionada.prioridade === 'Baixa' ? 'bg-blue-100 text-blue-700' : ''}
                                    `}>
                                        Prioridade {tarefaSelecionada.prioridade}
                                    </Badge>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        {tarefaSelecionada.etapa}
                                    </span>
                                </div>
                                <SheetTitle className="text-xl text-slate-800 leading-tight">
                                    {tarefaSelecionada.titulo}
                                </SheetTitle>
                                <SheetDescription className="flex items-center gap-2 mt-2 font-medium text-slate-600">
                                    <Target className="w-4 h-4 text-[#f84f08]" />
                                    Objetivo: {tarefaSelecionada.objetivo}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="px-6 py-6 space-y-8">
                                {/* METADADOS */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Responsável</p>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <User className="w-4 h-4 text-emerald-600" />
                                            {tarefaSelecionada.responsavel}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Prazo / Deadline</p>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <Calendar className="w-4 h-4 text-[#f84f08]" />
                                            {tarefaSelecionada.prazo}
                                        </div>
                                    </div>
                                    <div className="col-span-2 pt-3 border-t border-slate-200 mt-1">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Indicador de Sucesso</p>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <BarChart className="w-4 h-4 text-blue-500" />
                                            {tarefaSelecionada.indicador}
                                        </div>
                                    </div>
                                </div>

                                {/* DETALHAMENTO */}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                                        <FileText className="w-4 h-4" /> Instruções de Execução
                                    </h4>
                                    <div className="text-sm text-slate-600 leading-relaxed bg-white border border-slate-200 p-4 rounded-lg whitespace-pre-wrap">
                                        {/* Fallback de texto caso a mock data original não tivesse detalhamento */}
                                        {tarefaSelecionada.detalhamento || "Nenhuma instrução detalhada fornecida para esta ação. Siga o objetivo e o indicador propostos."}
                                    </div>
                                </div>
                            </div>

                            <SheetFooter className="px-6 py-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                    onClick={() => setTarefaSelecionada(null)}
                                >
                                    Fechar
                                </Button>
                                <Button
                                    onClick={() => toggleStatusTarefa(tarefaSelecionada.id)}
                                    className={`w-full sm:w-auto ${tarefaSelecionada.status === 'Concluído'
                                            ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                        }`}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    {tarefaSelecionada.status === 'Concluído' ? 'Reabrir Tarefa' : 'Marcar como Concluída'}
                                </Button>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}