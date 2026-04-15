"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils"; // Utilitário padrão do shadcn para classes

// Mock do seu banco de dados global de alunos
const alunosGlobais = [
    { id: "A01", nome: "Tech Solutions (CNPJ: 12.345...)" },
    { id: "A02", nome: "Comercial Silva (CNPJ: 98.765...)" },
    { id: "A03", nome: "Padaria do João (CNPJ: 45.678...)" },
    { id: "A04", nome: "XPTO Engenharia (CNPJ: 11.222...)" },
];

export function AdicionarAlunoSheet() {
    const [open, setOpen] = useState(false);

    // Estados do formulário
    const [openCombobox, setOpenCombobox] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Vinculando aluno ID:", alunoSelecionado, "à turma...");
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="bg-[#f84f08] hover:bg-[#d94205] text-white">
                    <Plus className="w-4 h-4 mr-2" /> Adicionar Aluno
                </Button>
            </SheetTrigger>

            <SheetContent className="sm:max-w-[500px] overflow-y-auto">
                <SheetHeader className="pb-4 border-b border-slate-100">
                    <SheetTitle>Vincular Empresa</SheetTitle>
                    <SheetDescription>
                        Adicione uma empresa já cadastrada à esta turma de mentoria.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-8 py-6 px-4">

                    {/* BLOCO 1: A BUSCA DA EMPRESA */}
                    <div className="space-y-4">
                        <div className="space-y-2 flex flex-col">
                            <Label>Buscar Empresa / Aluno</Label>
                            {/* Combobox de Seleção Única (Padrão shadcn) */}
                            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCombobox}
                                        className="justify-between text-slate-600 font-normal"
                                    >
                                        {alunoSelecionado
                                            ? alunosGlobais.find((aluno) => aluno.id === alunoSelecionado)?.nome
                                            : "Selecione a empresa..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[420px] p-0 z-[100]">
                                    <Command>
                                        <CommandInput placeholder="Digite o nome ou CNPJ..." />
                                        <CommandList>
                                            <CommandEmpty>Nenhuma empresa encontrada.</CommandEmpty>
                                            <CommandGroup>
                                                {alunosGlobais.map((aluno) => (
                                                    <CommandItem
                                                        key={aluno.id}
                                                        value={aluno.nome}
                                                        onSelect={() => {
                                                            setAlunoSelecionado(aluno.id);
                                                            setOpenCombobox(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                alunoSelecionado === aluno.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {aluno.nome}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <p className="text-xs text-slate-400 mt-1">
                                A empresa não está na lista? Cadastre-a primeiro na aba Meus Alunos.
                            </p>
                        </div>
                    </div>

                    {/* BLOCO 2: CONTEXTO DA ENTRADA */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Detalhes da Integração
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ponto de Partida</Label>
                                <Select defaultValue="mod1">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent className="z-[100]">
                                        <SelectItem value="mod1">Módulo 1: Diagnosticar</SelectItem>
                                        <SelectItem value="mod2">Módulo 2: Organizar</SelectItem>
                                        <SelectItem value="mod3">Módulo 3: Prever</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Data de Ingresso</Label>
                                <Input type="date" required className="text-slate-600" />
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Label>Objetivo Principal (Visão do Mentor)</Label>
                            <Textarea
                                placeholder="Ex: Foco extremo em estancar vazamentos de caixa no módulo 2."
                                className="resize-none h-24"
                            />
                        </div>
                    </div>

                    {/* RODAPÉ */}
                    <SheetFooter className="pt-6 border-t border-slate-100 mt-8">
                        <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#f84f08] hover:bg-[#d94205]"
                            disabled={!alunoSelecionado} // Trava o botão se não selecionar ninguém
                        >
                            Vincular à Turma
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}