"use client";

import { useState, useEffect } from "react";
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
import { cn } from "@/lib/utils";
import { getAlunosAction, addAlunoToTurmaAction } from "@/actions/mentor";

interface AdicionarAlunoSheetProps {
    turmaId: string;
}

export function AdicionarAlunoSheet({ turmaId }: AdicionarAlunoSheetProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Lista de alunos reais vindos do DB
    const [alunosGlobais, setAlunosGlobais] = useState<any[]>([]);

    // Estados do formulário
    const [openCombobox, setOpenCombobox] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState("");
    const [dataIngresso, setDataIngresso] = useState("");
    const [moduloId, setModuloId] = useState("mod1");
    const [objetivo, setObjetivo] = useState("");

    // Carregar alunos ao abrir a sheet
    useEffect(() => {
        if (open) {
            const fetchAlunos = async () => {
                const data = await getAlunosAction();
                if (data && data.clientes) {
                    setAlunosGlobais(data.clientes);
                }
            };
            fetchAlunos();
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        const payload = {
            companyId: alunoSelecionado,
            dataIngresso,
            moduloId,
            objetivo
        };

        const res = await addAlunoToTurmaAction(turmaId, payload);
        setIsLoading(false);

        if (res && res.success) {
            setOpen(false);
            setAlunoSelecionado("");
            setDataIngresso("");
            setObjetivo("");
            window.location.reload(); // Recarregar a página para exibir o novo aluno
        } else {
            alert(res?.error || "Erro ao vincular aluno");
        }
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
                                            ? alunosGlobais.find((aluno) => aluno.id === alunoSelecionado)?.empresa
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
                                                        value={aluno.empresa}
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
                                                        {aluno.empresa}
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
                                <Select value={moduloId} onValueChange={setModuloId}>
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
                                <Input type="date" required className="text-slate-600" value={dataIngresso} onChange={e => setDataIngresso(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Label>Objetivo Principal (Visão do Mentor)</Label>
                            <Textarea
                                placeholder="Ex: Foco extremo em estancar vazamentos de caixa no módulo 2."
                                className="resize-none h-24"
                                value={objetivo}
                                onChange={e => setObjetivo(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* RODAPÉ */}
                    <SheetFooter className="pt-6 border-t border-slate-100 mt-8">
                        <Button variant="ghost" type="button" onClick={() => setOpen(false)} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#f84f08] hover:bg-[#d94205]"
                            disabled={!alunoSelecionado || isLoading} // Trava o botão se não selecionar ninguém
                        >
                            {isLoading ? "Vinculando..." : "Vincular à Turma"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}