"use client";

import { useState, useRef } from "react";
import { Megaphone } from "lucide-react"; // Um ícone legal para comunicados
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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Importando o Combobox Múltiplo que já ajustamos antes
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
} from "@/components/ui/combobox";

export function NovoAvisoSheet() {
    const [open, setOpen] = useState(false);

    // Estado para controlar se o aviso é para todos ou específicos
    const [tipoPublico, setTipoPublico] = useState<"todos" | "especificos">("todos");
    const anchor = useRef<HTMLDivElement>(null);

    // Mock dos alunos DAQUELA turma específica
    const alunosDaTurma = [
        "Empresa XPTO Ltda",
        "Comercial Silva",
        "Tech Solutions",
        "Construtora Alpha"
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Disparando aviso para:", tipoPublico);
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="text-slate-600 border-slate-300">
                    <Megaphone className="w-4 h-4 mr-2" /> Criar Aviso
                </Button>
            </SheetTrigger>

            <SheetContent className="sm:max-w-[540px] overflow-y-auto">
                <SheetHeader className="pb-4 border-b border-slate-100">
                    <SheetTitle>Novo Comunicado</SheetTitle>
                    <SheetDescription>
                        Envie um aviso para o mural da turma ou direcione para empresas específicas.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-8 py-6 px-6">

                    {/* BLOCO 1: O que é o aviso? */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="titulo">Título do Aviso</Label>
                            <Input id="titulo" placeholder="Ex: Material extra do Módulo 3 liberado" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tipo">Categoria</Label>
                            <Select defaultValue="info">
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="info">Informativo (Azul)</SelectItem>
                                    <SelectItem value="urgente">Urgente (Vermelho)</SelectItem>
                                    <SelectItem value="sucesso">Sucesso / Conquista (Verde)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* BLOCO 2: Para quem é o aviso? */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Público-Alvo
                        </h3>

                        <RadioGroup
                            defaultValue="todos"
                            onValueChange={(value) => setTipoPublico(value as "todos" | "especificos")}
                            className="flex flex-col space-y-2"
                        >
                            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 transition-colors">
                                <RadioGroupItem value="todos" id="todos" />
                                <Label htmlFor="todos" className="flex-1 cursor-pointer">Toda a Turma (Mural visível para todos)</Label>
                            </div>
                            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 transition-colors">
                                <RadioGroupItem value="especificos" id="especificos" />
                                <Label htmlFor="especificos" className="flex-1 cursor-pointer">Alunos Específicos (Visível apenas para selecionados)</Label>
                            </div>
                        </RadioGroup>

                        {/* RENDERIZAÇÃO CONDICIONAL: Só aparece se "especificos" for marcado */}
                        {tipoPublico === "especificos" && (
                            <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2">
                                <Label>Selecione as Empresas</Label>
                                <Combobox
                                    multiple
                                    autoHighlight
                                    items={alunosDaTurma}
                                >
                                    <ComboboxChips ref={anchor} className="w-full">
                                        <ComboboxValue>
                                            {(values) => (
                                                <>
                                                    {values.map((value: string) => (
                                                        <ComboboxChip key={value} className="bg-[#f84f08]/10 text-[#f84f08] border border-[#f84f08]/20">
                                                            {value}
                                                        </ComboboxChip>
                                                    ))}
                                                    <ComboboxChipsInput placeholder="Buscar empresa..." className="text-sm" />
                                                </>
                                            )}
                                        </ComboboxValue>
                                    </ComboboxChips>

                                    <ComboboxContent anchor={anchor} className="z-50">
                                        <ComboboxEmpty className="text-sm text-slate-500 py-2 text-center">
                                            Nenhum aluno encontrado.
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
                        )}
                    </div>

                    {/* BLOCO 3: Mensagem */}
                    <div className="space-y-2">
                        <Label htmlFor="mensagem">Mensagem</Label>
                        <Textarea
                            id="mensagem"
                            placeholder="Escreva o conteúdo do comunicado aqui..."
                            className="h-32 resize-none"
                            required
                        />
                    </div>

                    {/* RODAPÉ */}
                    <SheetFooter className="pt-6 border-t border-slate-100 mt-8">
                        <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-[#f84f08] hover:bg-[#d94205]">
                            Disparar Aviso
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}