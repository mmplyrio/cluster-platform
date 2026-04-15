"use client";

import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import {
    CheckCircle2,
    Circle,
    Lock,
    FileText,
    Download,
    Plus,
    MessageSquare,
    Paperclip,
    CheckSquare,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const MODULOS_BASE = [
    { id: "mod1", titulo: "1. Diagnosticar", objetivo: "Análise situacional e saúde financeira.", statusInicial: "concluido" },
    { id: "mod2", titulo: "2. Organizar", objetivo: "Estruturação de processos e fluxos operacionais.", statusInicial: "concluido" },
    { id: "mod3", titulo: "3. Prever", objetivo: "Projeção de fluxo de caixa e cenários futuros.", statusInicial: "andamento" },
    { id: "mod4", titulo: "4. Calibrar", objetivo: "Ajuste de precificação e margens de lucro.", statusInicial: "bloqueado" },
    { id: "mod5", titulo: "5. Rotinizar", objetivo: "Criação de rotinas de gestão e dashboards.", statusInicial: "bloqueado" },
    { id: "mod6", titulo: "6. Crescer", objetivo: "Escalabilidade e novos canais de venda.", statusInicial: "bloqueado" },
];

export function LearningTrackManager() {
    const [statusModulos, setStatusModulos] = useState<Record<string, string>>(
        Object.fromEntries(MODULOS_BASE.map(m => [m.id, m.statusInicial]))
    );

    const [novaTarefaAberta, setNovaTarefaAberta] = useState<string | null>(null);
    const [notasAbertas, setNotasAbertas] = useState<Record<string, boolean>>({});

    const handleStatusChange = (id: string, novoStatus: string) => {
        setStatusModulos(prev => ({ ...prev, [id]: novoStatus }));
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">Gestão da Trilha e Entregas</h3>
                <p className="text-sm text-slate-500 mt-1">
                    Gerencie os módulos, objetivos e avalie os arquivos enviados pelo aluno.
                </p>
            </div>

            <div className="p-2">
                <Accordion type="single" collapsible defaultValue="mod3" className="space-y-2">
                    {MODULOS_BASE.map((modulo) => {
                        const statusAtual = statusModulos[modulo.id];
                        const isBloqueado = statusAtual === "bloqueado";
                        const isConcluido = statusAtual === "concluido";

                        return (
                            <AccordionItem
                                key={modulo.id}
                                value={modulo.id}
                                className={`px-4 border rounded-lg transition-all ${isBloqueado ? "bg-slate-50/50 border-slate-100" :
                                        isConcluido ? "bg-emerald-50/20 border-emerald-100" : "bg-amber-50/30 border-amber-100"
                                    }`}
                            >
                                {/* HEADER DO MÓDULO */}
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-3 w-full pr-4">
                                        {isConcluido && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                                        {statusAtual === "andamento" && <Circle className="w-5 h-5 text-amber-500 fill-amber-100 shrink-0" />}
                                        {isBloqueado && <Lock className="w-5 h-5 text-slate-300 shrink-0" />}

                                        <div className="text-left flex-1">
                                            <span className={`block font-bold ${isBloqueado ? "text-slate-400" : "text-slate-800"}`}>
                                                {modulo.titulo}
                                            </span>
                                            <span className="text-xs text-slate-500 font-normal">{modulo.objetivo}</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent className="pt-0 pb-6 space-y-6">

                                    {/* CONTROLE DE STATUS (Agora compacto e discreto logo abaixo do título) */}
                                    <div className="flex items-center gap-3 bg-white/60 p-2 rounded-md border border-slate-200 mt-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-2">Status do Módulo:</span>
                                        <Select
                                            value={statusAtual}
                                            onValueChange={(val) => handleStatusChange(modulo.id, val)}
                                        >
                                            <SelectTrigger className="w-[160px] h-7 text-xs bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="concluido">Concluído</SelectItem>
                                                <SelectItem value="andamento">Em Andamento</SelectItem>
                                                <SelectItem value="bloqueado">Bloqueado</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {isBloqueado && (
                                            <div className="ml-auto flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded text-[10px] font-medium border border-amber-100">
                                                <AlertCircle className="w-3 h-3" /> Oculto para o aluno
                                            </div>
                                        )}
                                    </div>

                                    {/* OBJETIVOS */}
                                    <div className="space-y-3 pt-2">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <CheckSquare className="w-3.5 h-3.5" /> Objetivos Alocados
                                        </h4>
                                        {[1, 2].map((i) => (
                                            <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 group">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <Checkbox id={`obj-${modulo.id}-${i}`} className="mt-1" />
                                                        <label htmlFor={`obj-${modulo.id}-${i}`} className="text-sm font-medium text-slate-700 cursor-pointer">
                                                            {i === 1 ? "Mapear todas as contas bancárias da empresa" : "Lançar previsões de receitas para 3 meses"}
                                                        </label>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setNotasAbertas(p => ({ ...p, [`${modulo.id}-${i}`]: !p[`${modulo.id}-${i}`] }))}
                                                        className="h-6 text-slate-400 hover:text-[#f84f08]"
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5 mr-1" /> Nota
                                                    </Button>
                                                </div>
                                                {notasAbertas[`${modulo.id}-${i}`] && (
                                                    <Textarea
                                                        placeholder="Anotação interna sobre este objetivo (o aluno não vê)..."
                                                        className="mt-3 text-xs bg-yellow-50/50 border-yellow-200 resize-none h-16 placeholder:text-slate-400"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* TAREFAS E ENTREGÁVEIS */}
                                    <div className="pt-4 border-t border-slate-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <FileText className="w-3.5 h-3.5" /> Tarefas e Entregáveis
                                            </h4>
                                            <Button
                                                size="sm"
                                                onClick={() => setNovaTarefaAberta(novaTarefaAberta === modulo.id ? null : modulo.id)}
                                                className="h-7 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-white"
                                            >
                                                <Plus className="w-3 h-3 mr-1" /> Nova Tarefa
                                            </Button>
                                        </div>

                                        {/* FORMULÁRIO DE NOVA TAREFA INLINE (Com Upload de Modelo) */}
                                        {novaTarefaAberta === modulo.id && (
                                            <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-inner animate-in zoom-in-95">
                                                <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Criar Tarefa Personalizada</h5>
                                                <div className="grid gap-3">
                                                    <Input placeholder="Título da tarefa..." className="h-8 text-sm bg-white" />
                                                    <Textarea placeholder="Instruções para o aluno..." className="text-sm min-h-[60px] bg-white resize-none" />

                                                    {/* Botão de Anexar Documento Modelo Restaurado */}
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Button variant="outline" size="sm" className="w-full justify-start text-slate-500 bg-white text-xs h-8">
                                                            <Paperclip className="w-3.5 h-3.5 mr-2" /> Anexar Documento Modelo (Opcional)
                                                        </Button>
                                                    </div>

                                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 mt-2">
                                                        <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => setNovaTarefaAberta(null)}>Cancelar</Button>
                                                        <Button size="sm" className="bg-[#f84f08] hover:bg-[#d94205] text-white text-xs h-8">Atribuir ao Aluno</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* LISTA DE ENTREGÁVEIS (Pendentes e Entregues) */}
                                        <div className="space-y-3">
                                            {/* Exemplo 1: Tarefa Pendente */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-dashed border-slate-300 rounded-md bg-white hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                                    <div className="p-2 bg-slate-100 rounded text-slate-500">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-700">DRE Projetada em Branco</p>
                                                        <p className="text-[11px] text-slate-400">O aluno precisa baixar o modelo, preencher e reenviar.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold whitespace-nowrap">Aguardando Envio</span>
                                                </div>
                                            </div>

                                            {/* Exemplo 2: Tarefa Entregue (Com Ações de Mentor) */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-emerald-200 rounded-md bg-emerald-50/50">
                                                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                                    <div className="p-2 bg-emerald-100 rounded text-emerald-600">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">Mapa_Custos_Fixos_Preenchido.xlsx</p>
                                                        <p className="text-[11px] text-slate-500">Enviado hoje às 14:30 pelo aluno.</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-8 text-xs text-slate-600 border-slate-300 bg-white">
                                                        <Download className="w-3.5 h-3.5 mr-1.5" /> Baixar
                                                    </Button>
                                                    <Button variant="default" size="sm" className="flex-1 sm:flex-none h-8 text-xs bg-emerald-500 hover:bg-emerald-600">
                                                        Aprovar
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </div>
        </div>
    );
}