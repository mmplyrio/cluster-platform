"use client";

import { useState } from "react";
import { Calendar, User, AlignLeft, Target, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter
} from "@/components/ui/sheet";
import { TarefaMentee } from "./MenteeTaskSheet";

interface NovaAcaoEquipeSheetProps {
    isOpen: boolean;
    onClose: () => void;
    etapasDisponiveis: string[];
    onSalvar: (novaTarefa: TarefaMentee) => void;
}

export function NovaAcaoEquipeSheet({ isOpen, onClose, etapasDisponiveis, onSalvar }: NovaAcaoEquipeSheetProps) {
    const [titulo, setTitulo] = useState("");
    const [responsavel, setResponsavel] = useState("");
    const [prazo, setPrazo] = useState("");
    const [etapa, setEtapa] = useState("");
    const [detalhamento, setDetalhamento] = useState("");

    const handleSalvar = () => {
        if (!titulo || !etapa) return; // Validação básica

        const novaAcao: TarefaMentee = {
            id: `acao-int-${Date.now()}`,
            titulo,
            objetivo: "Iniciativa Interna da Equipe",
            etapa,
            responsavel: responsavel || "Não atribuído",
            detalhamento,
            indicador: "Conclusão da atividade",
            prazo: prazo || "A definir",
            prioridade: "Média",
            status: "Pendente",
            subtarefas: [],
            notaExecucao: "",
            origem: "ALUNO" // <--- Identificador de que foi o aluno que criou!
        };

        onSalvar(novaAcao);

        // Limpa o form
        setTitulo(""); setResponsavel(""); setPrazo(""); setEtapa(""); setDetalhamento("");
        onClose();
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-[95vw] sm:max-w-[400px] overflow-y-auto bg-white sm:!right-4 sm:!top-4 sm:!bottom-4 sm:!h-[calc(100vh-32px)] sm:rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8">
                <SheetHeader className="mb-8">
                    <SheetTitle className="text-xl text-slate-800">Nova Ação da Equipe</SheetTitle>
                    <SheetDescription>
                        Crie demandas operacionais para sua equipe que ajudarão a atingir as metas da mentoria.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 space-y-8 py-2">
                    <div className="space-y-3">
                        <Label className="text-slate-700 font-bold text-sm">O que precisa ser feito?</Label>
                        <Input
                            className="h-11"
                            placeholder="Ex: Contratar nova ferramenta..."
                            value={titulo} onChange={(e) => setTitulo(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label className="text-slate-700 font-bold text-sm flex items-center gap-1.5"><User className="w-4 h-4 text-slate-400" /> Responsável</Label>
                            <Input
                                className="h-11"
                                placeholder="Ex: Maria (RH)"
                                value={responsavel} onChange={(e) => setResponsavel(e.target.value)}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-700 font-bold text-sm flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Prazo</Label>
                            <Input
                                className="h-11"
                                type="date"
                                value={prazo} onChange={(e) => setPrazo(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-slate-700 font-bold text-sm flex items-center gap-1.5"><Target className="w-4 h-4 text-slate-400" /> Em qual período?</Label>
                        <Select value={etapa} onValueChange={setEtapa}>
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Selecione a coluna do prazo..." />
                            </SelectTrigger>
                            <SelectContent>
                                {etapasDisponiveis.map(et => (
                                    <SelectItem key={et} value={et}>{et}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-slate-700 font-bold text-sm flex items-center gap-1.5"><AlignLeft className="w-4 h-4 text-slate-400" /> Detalhes / Instruções (Opcional)</Label>
                        <Textarea
                            className="resize-none min-h-[120px] text-base leading-relaxed"
                            placeholder="Passe as orientações claras para quem for executar..."
                            value={detalhamento} onChange={(e) => setDetalhamento(e.target.value)}
                        />
                    </div>
                </div>

                <SheetFooter className="mt-8">
                    <Button variant="outline" onClick={onClose} className="w-full">Cancelar</Button>
                    <Button onClick={handleSalvar} className="w-full bg-[#f84f08] hover:bg-[#d94205] text-white">
                        <Save className="w-4 h-4 mr-2" /> Salvar Tarefa
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}