"use client";

import { useState } from "react";
import {
    Plus,
    GripVertical,
    Trash2,
    ClipboardList,
    HelpCircle,
    ListPlus,
    Type,
    AlignLeft,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Pergunta {
    id: string;
    texto: string;
    tipo: "texto_curto" | "texto_longo" | "multipla_escolha";
    opcoes?: string[]; // Campo para armazenar as opções de múltipla escolha
}

interface BlocoDiagnostico {
    id: string;
    titulo: string;
    objetivo: string;
    perguntas: Pergunta[];
}

export function DiagnosticBuilder() {
    const [blocos, setBlocos] = useState<BlocoDiagnostico[]>([
        {
            id: "b1",
            titulo: "Bloco 1 — Contexto atual do negócio",
            objetivo: "Entender o momento atual e a percepção do empreendedor sobre os problemas centrais.",
            perguntas: [
                {
                    id: "p1",
                    texto: "Qual destas situações melhor descreve sua principal preocupação financeira?",
                    tipo: "multipla_escolha",
                    opcoes: ["Vender mais", "Sobrar mais dinheiro", "Organizar números"]
                }
            ]
        }
    ]);

    const adicionarBloco = () => {
        const novoBloco: BlocoDiagnostico = {
            id: `b-${Date.now()}`,
            titulo: "",
            objetivo: "",
            perguntas: []
        };
        setBlocos([...blocos, novoBloco]);
    };

    const adicionarPergunta = (blocoId: string) => {
        setBlocos(blocos.map(b => b.id === blocoId ? {
            ...b,
            perguntas: [...b.perguntas, { id: `p-${Date.now()}`, texto: "", tipo: "texto_curto", opcoes: [] }]
        } : b));
    };

    const atualizarPergunta = (blocoId: string, perguntaId: string, dados: Partial<Pergunta>) => {
        setBlocos(blocos.map(b => b.id === blocoId ? {
            ...b,
            perguntas: b.perguntas.map(p => p.id === perguntaId ? { ...p, ...dados } : p)
        } : b));
    };

    const adicionarOpcao = (blocoId: string, perguntaId: string) => {
        setBlocos(blocos.map(b => b.id === blocoId ? {
            ...b,
            perguntas: b.perguntas.map(p => p.id === perguntaId ? {
                ...p,
                opcoes: [...(p.opcoes || []), ""]
            } : p)
        } : b));
    };

    const atualizarOpcao = (blocoId: string, perguntaId: string, index: number, valor: string) => {
        setBlocos(blocos.map(b => b.id === blocoId ? {
            ...b,
            perguntas: b.perguntas.map(p => p.id === perguntaId ? {
                ...p,
                opcoes: p.opcoes?.map((opt, i) => i === index ? valor : opt)
            } : p)
        } : b));
    };

    const removerOpcao = (blocoId: string, perguntaId: string, index: number) => {
        setBlocos(blocos.map(b => b.id === blocoId ? {
            ...b,
            perguntas: b.perguntas.map(p => p.id === perguntaId ? {
                ...p,
                opcoes: p.opcoes?.filter((_, i) => i !== index)
            } : p)
        } : b));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <ClipboardList className="w-6 h-6 text-[#f84f08]" />
                        Configuração do Diagnóstico
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Estruture o roteiro de perguntas para identificar vazamentos e gargalos financeiros.
                    </p>
                </div>

                <div className="space-y-10">
                    {blocos.map((bloco) => (
                        <div key={bloco.id} className="border border-slate-200 rounded-2xl bg-slate-50/50 p-6 relative group border-l-4 border-l-[#f84f08]/30">

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setBlocos(blocos.filter(b => b.id !== bloco.id))}
                                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>

                            <div className="space-y-4 mb-8 pr-10">
                                <div className="space-y-1.5">
                                    <Label className="text-[#f84f08] font-bold text-xs uppercase tracking-widest">Título do Bloco</Label>
                                    <Input
                                        value={bloco.titulo}
                                        onChange={(e) => setBlocos(blocos.map(b => b.id === bloco.id ? { ...b, titulo: e.target.value } : b))}
                                        className="bg-white font-bold text-lg h-12 border-slate-200 focus:ring-[#f84f08]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-slate-500 font-medium">Objetivo do Analista</Label>
                                    <Input
                                        value={bloco.objetivo}
                                        onChange={(e) => setBlocos(blocos.map(b => b.id === bloco.id ? { ...b, objetivo: e.target.value } : b))}
                                        placeholder="Ex: Identificar vazamentos de caixa..."
                                        className="bg-white text-sm border-slate-200"
                                    />
                                </div>
                            </div>

                            {/* LISTA DE PERGUNTAS */}
                            <div className="space-y-4">
                                {bloco.perguntas.map((pergunta) => (
                                    <div key={pergunta.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                                        <div className="flex flex-row lg:flex-col gap-4">
                                            <div className="flex-1 space-y-2">
                                                <Label className="text-[10px] font-bold text-slate-400 uppercase">Enunciado da Pergunta</Label>
                                                <div className="flex items-center gap-3">
                                                    <GripVertical className="w-4 h-4 text-slate-300 shrink-0 cursor-move" />
                                                    <Input
                                                        value={pergunta.texto}
                                                        onChange={(e) => atualizarPergunta(bloco.id, pergunta.id, { texto: e.target.value })}
                                                        placeholder="Ex: É comum a empresa vender bem e faltar dinheiro?"
                                                        className="h-10 border-slate-200 focus:border-[#f84f08]"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                <div className="w-full lg:w-[220px] space-y-2">
                                                    <Label className="text-[10px] font-bold text-slate-400 uppercase">Tipo de Resposta</Label>
                                                    <Select
                                                        value={pergunta.tipo}
                                                        onValueChange={(val: any) => atualizarPergunta(bloco.id, pergunta.id, { tipo: val })}
                                                    >
                                                        <SelectTrigger className="h-10 border-slate-200">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="texto_curto">
                                                                <div className="flex items-center gap-2 text-xs"><Type className="w-3 h-3" /> Texto Curto</div>
                                                            </SelectItem>
                                                            <SelectItem value="texto_longo">
                                                                <div className="flex items-center gap-2 text-xs"><AlignLeft className="w-3 h-3" /> Texto Longo</div>
                                                            </SelectItem>
                                                            <SelectItem value="multipla_escolha">
                                                                <div className="flex items-center gap-2 text-xs"><ListPlus className="w-3 h-3" /> Múltipla Escolha</div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="flex items-end pb-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setBlocos(blocos.map(b => b.id === bloco.id ? { ...b, perguntas: b.perguntas.filter(p => p.id !== pergunta.id) } : b))}
                                                        className="text-slate-300 hover:text-red-500 h-10 w-10 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* LOGICA DE OPÇÕES (Só aparece se for múltipla escolha) */}
                                        {pergunta.tipo === "multipla_escolha" && (
                                            <div className="pl-7 pt-4 border-t border-slate-50 space-y-3">
                                                <Label className="text-[10px] font-bold text-[#f84f08] uppercase">Opções de Resposta</Label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {pergunta.opcoes?.map((opcao, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 group/opt">
                                                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                                                            <Input
                                                                value={opcao}
                                                                onChange={(e) => atualizarOpcao(bloco.id, pergunta.id, idx, e.target.value)}
                                                                placeholder={`Opção ${idx + 1}`}
                                                                className="h-8 text-xs border-slate-100 focus:border-[#f84f08]/30"
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removerOpcao(bloco.id, pergunta.id, idx)}
                                                                className="h-7 w-7 text-slate-300 hover:text-red-400 opacity-0 group-hover/opt:opacity-100"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => adicionarOpcao(bloco.id, pergunta.id)}
                                                        className="h-8 border-dashed text-[10px] font-bold text-slate-500 hover:text-[#f84f08]"
                                                    >
                                                        <Plus className="w-3 h-3 mr-1" /> Adicionar Opção
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <Button
                                    variant="ghost"
                                    onClick={() => adicionarPergunta(bloco.id)}
                                    className="w-full border border-dashed border-slate-200 text-slate-500 hover:text-[#f84f08] py-6 rounded-xl text-xs font-bold"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Nova Pergunta para {bloco.titulo}
                                </Button>
                            </div>
                        </div>
                    ))}

                    <Button
                        onClick={adicionarBloco}
                        className="w-full bg-slate-900 hover:bg-black text-white h-14 rounded-xl font-bold shadow-lg"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Adicionar Novo Bloco Temático
                    </Button>
                </div>
            </div>
        </div>
    );
}