"use client";

import { useState } from "react";
import { Plus, GripVertical, Trash2, Target, Columns3, LayoutPanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface EtapaPlano {
    id: string;
    titulo: string;
    descricao: string;
}

interface ActionPlanBuilderProps {
    etapas: EtapaPlano[];
    setEtapas: (etapas: EtapaPlano[]) => void;
}

export function ActionPlanBuilder({ etapas, setEtapas }: ActionPlanBuilderProps) {
    // Começamos com o exemplo financeiro clássico que você citou

    const adicionarEtapa = () => {
        const novaEtapa: EtapaPlano = {
            id: `etapa-${Date.now()}`,
            titulo: "",
            descricao: ""
        };
        setEtapas([...etapas, novaEtapa]);
    };

    const removerEtapa = (id: string) => {
        setEtapas(etapas.filter(e => e.id !== id));
    };

    const atualizarEtapa = (id: string, campo: keyof EtapaPlano, valor: string) => {
        setEtapas(etapas.map(e => e.id === id ? { ...e, [campo]: valor } : e));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#f84f08]" />
                        Estrutura do Plano de Ação
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Defina as colunas (agrupadores) que organizarão a execução prática desta mentoria.
                        Elas podem ser cronológicas (Ex: Mês 1, Mês 2) ou por natureza (Ex: Tático, Operacional).
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    {/* LADO ESQUERDO: O Construtor (Formulários) */}
                    <div className="lg:col-span-3 space-y-4">
                        {etapas.map((etapa, index) => (
                            <div key={etapa.id} className="flex gap-3 items-start bg-slate-50 border border-slate-100 p-4 rounded-xl group relative transition-colors hover:border-slate-300">
                                <div className="mt-3 cursor-move text-slate-300 hover:text-slate-500">
                                    <GripVertical className="w-5 h-5" />
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Nome da Etapa {index + 1}
                                        </Label>
                                        <Input
                                            value={etapa.titulo}
                                            onChange={(e) => atualizarEtapa(etapa.id, "titulo", e.target.value)}
                                            placeholder="Ex: 0-30 Dias ou Plano Tático"
                                            className="bg-white font-bold text-slate-800"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-400">Objetivo desta etapa (Opcional)</Label>
                                        <Input
                                            value={etapa.descricao}
                                            onChange={(e) => atualizarEtapa(etapa.id, "descricao", e.target.value)}
                                            placeholder="Ex: Foco em estabilização de caixa..."
                                            className="bg-white text-sm"
                                        />
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removerEtapa(etapa.id)}
                                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 shrink-0 mt-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}

                        <Button
                            variant="outline"
                            onClick={adicionarEtapa}
                            className="w-full border-dashed border-2 border-slate-200 text-slate-600 hover:text-[#f84f08] hover:border-[#f84f08]/50 hover:bg-[#f84f08]/5 h-14 rounded-xl"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Adicionar Nova Etapa
                        </Button>
                    </div>

                    {/* LADO DIREITO: Live Preview do Kanban */}
                    <div className="lg:col-span-2 bg-slate-800 rounded-xl p-5 border border-slate-900 shadow-inner sticky top-32">
                        <h4 className="text-white font-bold text-sm flex items-center gap-2 mb-4">
                            <Columns3 className="w-4 h-4 text-[#f84f08]" /> Preview do Kanban
                        </h4>
                        <p className="text-xs text-slate-400 mb-6">
                            É assim que as colunas aparecerão para o mentor e o aluno durante a mentoria:
                        </p>

                        <div className="space-y-3">
                            {etapas.length === 0 && (
                                <div className="text-center p-4 border border-dashed border-slate-600 rounded-lg text-slate-500 text-xs">
                                    Adicione etapas para ver o preview.
                                </div>
                            )}

                            {etapas.map((etapa) => (
                                <div key={`preview-${etapa.id}`} className="bg-slate-700/50 border border-slate-600 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-600/50">
                                        <LayoutPanelLeft className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider truncate">
                                            {etapa.titulo || "Etapa Sem Nome"}
                                        </span>
                                    </div>
                                    {/* Mockup visual de um card de tarefa dentro da coluna */}
                                    <div className="bg-slate-600 h-10 rounded text-[10px] text-slate-400 flex items-center px-3 opacity-50">
                                        Tarefa simulada...
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}