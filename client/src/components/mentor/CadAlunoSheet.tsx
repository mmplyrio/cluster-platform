"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

export function CadAlunoSheet() {
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Cadastrando nova empresa/aluno no banco global...");
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="bg-[#f84f08] hover:bg-[#d94205] text-white">
                    <UserPlus className="w-4 h-4 mr-2" /> Novo Cadastro
                </Button>
            </SheetTrigger>

            {/* O overflow-y-auto garante que o formulário longo possa ser rolado em telas menores */}
            <SheetContent className="sm:max-w-[540px] overflow-y-auto">
                <SheetHeader className="pb-4 border-b border-slate-100">
                    <SheetTitle>Cadastrar Nova Empresa</SheetTitle>
                    <SheetDescription>
                        Crie o registro base do cliente. Após cadastrar, você poderá vinculá-lo a uma turma ativa.
                    </SheetDescription>
                </SheetHeader>

                {/* Mantendo o px-6 para o respiro lateral perfeito */}
                <form onSubmit={handleSubmit} className="space-y-8 py-6 px-6">

                    {/* BLOCO 1: Dados da Pessoa Jurídica */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            1. Dados da Empresa
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="razaoSocial">Razão Social / Nome Fantasia</Label>
                            <Input id="razaoSocial" placeholder="Ex: Tech Solutions Ltda" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cnpj">CNPJ</Label>
                                <Input id="cnpj" placeholder="00.000.000/0001-00" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ramo">Ramo de Atuação</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="varejo">Varejo & Comércio</SelectItem>
                                        <SelectItem value="servicos">Prestação de Serviços</SelectItem>
                                        <SelectItem value="industria">Indústria</SelectItem>
                                        <SelectItem value="tecnologia">Tecnologia / SaaS</SelectItem>
                                        <SelectItem value="saude">Saúde & Clínicas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* BLOCO 2: Contato Principal (Quem vai acessar a plataforma) */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            2. Contato Principal (CEO / Gestor)
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="nomeContato">Nome Completo</Label>
                            <Input id="nomeContato" placeholder="Ex: João Paulo Silva" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail de Acesso</Label>
                                <Input id="email" type="email" placeholder="joao@empresa.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp</Label>
                                <Input id="whatsapp" placeholder="(00) 90000-0000" required />
                            </div>
                        </div>
                    </div>

                    {/* BLOCO 3: Contexto Inicial */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            3. Contexto Interno
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="origem">Origem do Lead (Opcional)</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Como nos conheceu?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="instagram">Instagram Ads / Orgânico</SelectItem>
                                    <SelectItem value="indicacao">Indicação de Cliente</SelectItem>
                                    <SelectItem value="evento">Evento Presencial</SelectItem>
                                    <SelectItem value="outbound">Prospecção Ativa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="anotacoes">Anotações do Diagnóstico Prévio</Label>
                            <Textarea
                                id="anotacoes"
                                placeholder="Descreva os principais desafios que a empresa relatou antes de fechar o contrato..."
                                className="resize-none h-24"
                            />
                        </div>
                    </div>

                    {/* RODAPÉ */}
                    <SheetFooter className="pt-6 border-t border-slate-100 mt-8">
                        <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-[#f84f08] hover:bg-[#d94205]">
                            Salvar Cadastro
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}