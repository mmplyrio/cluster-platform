"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter
} from "@/components/ui/sheet";
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
import { Plus } from "lucide-react";
import { useState, useRef } from "react";

import {
    Combobox,
    ComboboxChips,
    ComboboxChip,
    ComboboxValue,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxList,
    ComboboxItem,
} from "@/components/ui/combobox"
import { Textarea } from "../ui/textarea";

export function NovaTurmaSheet() {
    const [open, setOpen] = useState(false);
    const anchor = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Enviando nova turma...");
        setOpen(false);
    };

    const mentoresDisponiveis = [
        "Carlos Silva (Financeiro)",
        "Ana Costa (Vendas)",
        "João Pedro (Marketing)",
        "Mariana Santos (Operações)"
    ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="bg-[#f84f08] hover:bg-[#d94205] text-white">
                    <Plus className="w-4 h-4 mr-2" /> Nova Turma
                </Button>
            </SheetTrigger>

            {/* Adicionei overflow-y-auto para garantir que o sheet seja "scrollável" se a tela for pequena */}
            <SheetContent className="sm:max-w-[540px] overflow-y-auto">
                <SheetHeader className="pb-4 border-b border-slate-100">
                    <SheetTitle>Criar Nova Turma</SheetTitle>
                    <SheetDescription>
                        Configure os detalhes, produto e equipe para esta nova coorte.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-8 py-6 px-6">

                    {/* BLOCO 1: Informações Principais */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            1. Detalhes da Mentoria
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome da Turma</Label>
                            <Input id="nome" placeholder="Ex: Turma Agosto 2026" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Textarea id="descricao" placeholder="Ex: Descrição da turma" required />
                        </div>

                        {/* Agrupei Produto e Preço na mesma linha (faz sentido estarem juntos) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="mentoria">Produto Alvo</Label>
                                <Select required>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="lucro-estruturado">Lucro Estruturado</SelectItem>
                                        <SelectItem value="maquina-vendas">Máquina de Vendas</SelectItem>
                                        <SelectItem value="gestao-equipes">Gestão de Equipes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="preco">Valor de Venda (R$)</Label>
                                <Input id="preco" type="number" placeholder="Ex: 5000,00" required />
                            </div>
                        </div>
                    </div>

                    {/* BLOCO 2: Equipe Técnica */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            2. Equipe
                        </h3>

                        {/* Mentores agora ocupa a largura total da tela para caber os chips perfeitamente */}
                        <div className="space-y-2">
                            <Label htmlFor="mentores">Mentores Alocados</Label>
                            <Combobox
                                multiple
                                autoHighlight
                                items={mentoresDisponiveis}
                            >
                                <ComboboxChips ref={anchor} className="w-full">
                                    <ComboboxValue>
                                        {(values) => (
                                            <>
                                                {values.map((value: string) => (
                                                    <ComboboxChip key={value} className="bg-slate-100 text-slate-800">
                                                        {value}
                                                    </ComboboxChip>
                                                ))}
                                                <ComboboxChipsInput placeholder="Buscar mentor..." className="text-sm" />
                                            </>
                                        )}
                                    </ComboboxValue>
                                </ComboboxChips>

                                <ComboboxContent anchor={anchor} className="z-50">
                                    <ComboboxEmpty className="text-sm text-slate-500 py-2 text-center">
                                        Nenhum mentor encontrado.
                                    </ComboboxEmpty>
                                    <ComboboxList>
                                        {(item: string) => (
                                            <ComboboxItem key={item} value={item} className="cursor-pointer">
                                                {item}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>
                    </div>

                    {/* BLOCO 3: Logística */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            3. Logística
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="data">Data de Início</Label>
                                <Input id="data" type="date" required className="text-slate-600" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vagas">Vagas Disponíveis</Label>
                                <Input id="vagas" type="number" placeholder="Ex: 15" required />
                            </div>
                        </div>
                    </div>

                    {/* RODAPÉ */}
                    <SheetFooter className="pt-6 border-t border-slate-100 mt-8">
                        <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-[#f84f08] hover:bg-[#d94205]">
                            Criar Turma
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}