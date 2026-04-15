"use client";

import { useState } from "react";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Tipagem atualizada com os novos campos (Objetivo e Indicador) e Responsável livre
export interface TarefaAcao {
    id: string;
    titulo: string;
    objetivo: string;
    etapa: string;
    prioridade: "Alta" | "Média" | "Baixa";
    responsavel: string; // Agora é uma string livre
    indicador: string;
    prazo: string;
    status: "Pendente" | "Concluído";
    detalhamento?: string;
}

interface NovaAcaoSheetProps {
    etapas: string[];
    onSave: (novaTarefa: TarefaAcao) => void;
}

export function NovaAcaoSheet({ etapas, onSave }: NovaAcaoSheetProps) {
    const [open, setOpen] = useState(false);

    // Estados do formulário
    const [titulo, setTitulo] = useState("");
    const [objetivo, setObjetivo] = useState("");
    const [etapa, setEtapa] = useState(etapas[0]);
    const [prioridade, setPrioridade] = useState<"Alta" | "Média" | "Baixa">("Média");
    const [responsavel, setResponsavel] = useState("");
    const [indicador, setIndicador] = useState("");
    const [detalhamento, setDetalhamento] = useState("");
    const [prazo, setPrazo] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const novaTarefa: TarefaAcao = {
            id: Math.random().toString(36).substring(2, 9),
            titulo,
            objetivo,
            etapa,
            prioridade,
            responsavel,
            indicador,
            detalhamento,
            prazo,
            status: "Pendente"
        };

        onSave(novaTarefa);

        // Limpeza dos estados após salvar
        setTitulo(""); setObjetivo(""); setResponsavel("");
        setIndicador(""); setDetalhamento(""); setPrazo("");
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="bg-[#f84f08] hover:bg-[#d94205] text-white">
                    <Plus className="w-4 h-4 mr-2" /> Nova Ação
                </Button>
            </SheetTrigger>

            {/* O overflow-y-auto garante rolagem. O sm:max-w-[540px] define a largura no desktop */}
            <SheetContent className="sm:max-w-[540px] overflow-y-auto p-0">

                {/* Cabeçalho com padding próprio */}
                <SheetHeader className="px-6 py-6 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
                    <SheetTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#f84f08]" />
                        Atribuir Nova Ação
                    </SheetTitle>
                    <SheetDescription>
                        Descreva a tarefa, defina os responsáveis da equipe e a métrica de sucesso.
                    </SheetDescription>
                </SheetHeader>

                {/* CORREÇÃO APLICADA: O px-6 (padding lateral) garante que os campos não colem na borda */}
                <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">

                    <div className="space-y-2">
                        <Label>Título da Ação</Label>
                        <Input
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Ex: Mapear fornecedores de matéria-prima"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Objetivo Estratégico</Label>
                        <Input
                            value={objetivo}
                            onChange={(e) => setObjetivo(e.target.value)}
                            placeholder="Ex: Reduzir custos logísticos em 15%"
                            required
                        />
                    </div>

                    {/* AGRUPAMENTO EM DUAS COLUNAS PARA ECONOMIZAR ESPAÇO */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[#f84f08] font-bold">Etapa do Plano</Label>
                            <Select value={etapa} onValueChange={setEtapa} required>
                                <SelectTrigger className="border-[#f84f08]/30 bg-[#f84f08]/5">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {etapas.map((et) => (
                                        <SelectItem key={et} value={et}>{et}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Prioridade</Label>
                            <Select value={prioridade} onValueChange={(val: any) => setPrioridade(val)} required>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Alta">Alta (Crítico)</SelectItem>
                                    <SelectItem value="Média">Média</SelectItem>
                                    <SelectItem value="Baixa">Baixa (Desejável)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Responsável (Cargo/Nome)</Label>
                            <Input
                                value={responsavel}
                                onChange={(e) => setResponsavel(e.target.value)}
                                placeholder="Ex: Gerente Financeiro"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Data Limite</Label>
                            <Input
                                type="date"
                                value={prazo}
                                onChange={(e) => setPrazo(e.target.value)}
                                required
                                className="text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Indicador de Sucesso</Label>
                        <Input
                            value={indicador}
                            onChange={(e) => setIndicador(e.target.value)}
                            placeholder="Ex: Planilha preenchida com mínimo de 5 cotações"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Detalhamento (Como executar)</Label>
                        <Textarea
                            value={detalhamento}
                            onChange={(e) => setDetalhamento(e.target.value)}
                            placeholder="Descreva o passo a passo, links úteis ou ferramentas necessárias..."
                            className="resize-none h-24"
                            required
                        />
                    </div>

                    <SheetFooter className="pt-6 border-t border-slate-100">
                        <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit" className="bg-[#f84f08] hover:bg-[#d94205]">Salvar Ação</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}