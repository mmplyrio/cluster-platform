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
import { createMenteeAction } from "@/actions/mentor";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CadAlunoSheet() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [ramo, setRamo] = useState("");
    const [origem, setOrigem] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            razaoSocial: formData.get("razaoSocial"),
            cnpj: formData.get("cnpj"),
            ramo: ramo,
            nomeContato: formData.get("nomeContato"),
            email: formData.get("email"),
            whatsapp: formData.get("whatsapp"),
            origem: origem,
            anotacoes: formData.get("anotacoes"),
        };

        try {
            const res = await createMenteeAction(data);
            if (res.success) {
                setOpen(false);
                router.refresh();
            } else {
                setError(res.error || "Erro ao salvar cadastro.");
            }
        } catch (err) {
            setError("Falha na comunicação com o servidor.");
        } finally {
            setIsLoading(false);
        }
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
                            <Input id="razaoSocial" name="razaoSocial" placeholder="Ex: Tech Solutions Ltda" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cnpj">CNPJ</Label>
                                <Input id="cnpj" name="cnpj" placeholder="00.000.000/0001-00" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ramo">Ramo de Atuação</Label>
                                <Select value={ramo} onValueChange={setRamo}>
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
                            <Input id="nomeContato" name="nomeContato" placeholder="Ex: João Paulo Silva" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail de Acesso</Label>
                                <Input id="email" name="email" type="email" placeholder="joao@empresa.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp</Label>
                                <Input id="whatsapp" name="whatsapp" placeholder="(00) 90000-0000" required />
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
                            <Select value={origem} onValueChange={setOrigem}>
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
                                name="anotacoes"
                                placeholder="Descreva os principais desafios que a empresa relatou antes de fechar o contrato..."
                                className="resize-none h-24"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">{error}</p>
                    )}

                    {/* RODAPÉ */}
                    <SheetFooter className="pt-6 border-t border-slate-100 mt-8">
                        <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-[#f84f08] hover:bg-[#d94205]" disabled={isLoading}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Salvar Cadastro
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}