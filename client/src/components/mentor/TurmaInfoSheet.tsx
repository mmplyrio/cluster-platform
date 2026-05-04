"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface TurmaData {
    id: string;
    nome: string;
    qtdAlunos: string;
    status: string;
    descricao?: string;
    produto?: string;
    preco?: string;
    dataInicio?: string;
    vagas?: string;
}

interface TurmaInfoSheetProps {
    turma: TurmaData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TurmaInfoSheet({ turma, open, onOpenChange }: TurmaInfoSheetProps) {
    if (!turma) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[540px] overflow-y-auto">
                <SheetHeader className="pb-4 border-b border-slate-100">
                    <SheetTitle>Informações da Turma</SheetTitle>
                    <SheetDescription>
                        Visualize e gerencie os detalhes da turma {turma.nome}.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-8 py-6 px-6">
                    {/* BLOCO 1: Informações Principais */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            1. Detalhes da Mentoria
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome da Turma</Label>
                            <Input id="nome" defaultValue={turma.nome} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Textarea id="descricao" defaultValue={turma.descricao || "Turma de mentoria estratégica focada em resultados."} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="mentoria">Produto Alvo</Label>
                                <Select defaultValue={turma.produto || "nenhum"}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {turma.produto && (
                                            <SelectItem value={turma.produto}>{turma.produto}</SelectItem>
                                        )}
                                        <SelectItem value="nenhum">Sem Produto</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="preco">Valor de Venda (R$)</Label>
                                <Input id="preco" type="number" defaultValue={turma.preco || "5000"} />
                            </div>
                        </div>
                    </div>

                    {/* BLOCO 2: Logística e Status */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            2. Logística e Status
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="data">Data de Início</Label>
                                <Input id="data" type="date" defaultValue={turma.dataInicio || "2026-08-01"} className="text-slate-600" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vagas">Vagas Totais</Label>
                                <Input id="vagas" type="number" defaultValue={turma.vagas || "20"} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status Atual</Label>
                            <Select defaultValue={
                                turma.status === "Em Andamento" ? "andamento" : 
                                turma.status === "Concluída" ? "concluida" : "inscricoes"
                            }>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="inscricoes">Inscrições Abertas</SelectItem>
                                    <SelectItem value="andamento">Em Andamento</SelectItem>
                                    <SelectItem value="concluida">Concluída</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* RODAPÉ */}
                    <SheetFooter className="pt-6 border-t border-slate-100 mt-8">
                        <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
                            Fechar
                        </Button>
                        <Button type="button" className="bg-[#f84f08] hover:bg-[#d94205] text-white">
                            Salvar Alterações
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}
