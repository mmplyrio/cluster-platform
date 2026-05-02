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

export interface MenteeProfileData {
    id: string;
    nome: string;
    email?: string;
    whatsapp?: string;
    cnpj?: string;
    ramo?: string;
    origem?: string;
    anotacoes?: string;
    turma?: string;
    status?: string;
}

interface MenteeProfileSheetProps {
    mentee: MenteeProfileData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MenteeProfileSheet({ mentee, open, onOpenChange }: MenteeProfileSheetProps) {
    if (!mentee) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[540px] overflow-y-auto">
                <SheetHeader className="pb-4 border-b border-slate-100">
                    <SheetTitle>Perfil do Aluno</SheetTitle>
                    <SheetDescription>
                        Visualize e edite os dados cadastrais da empresa e do contato principal.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-8 py-6 px-4">
                    {/* BLOCO 1: Dados da Empresa */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            1. Dados da Empresa
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="razaoSocial">Razão Social / Nome Fantasia</Label>
                            <Input id="razaoSocial" defaultValue={mentee.nome} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cnpj">CNPJ</Label>
                                <Input id="cnpj" defaultValue={mentee.cnpj || ""} placeholder="00.000.000/0001-00" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ramo">Ramo de Atuação</Label>
                                <Select defaultValue={mentee.ramo || ""}>
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

                    {/* BLOCO 2: Contato Principal */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            2. Contato Principal
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="nomeContato">Nome Completo</Label>
                            <Input id="nomeContato" defaultValue={mentee.nome} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail de Acesso</Label>
                                <Input id="email" type="email" defaultValue={mentee.email || ""} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp</Label>
                                <Input id="whatsapp" defaultValue={mentee.whatsapp || ""} />
                            </div>
                        </div>
                    </div>

                    {/* BLOCO 3: Contexto Interno */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            3. Contexto Interno
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="origem">Origem do Lead</Label>
                            <Select defaultValue={mentee.origem || ""}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
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
                            <Label htmlFor="anotacoes">Anotações do Diagnóstico</Label>
                            <Textarea
                                id="anotacoes"
                                defaultValue={mentee.anotacoes || ""}
                                className="resize-none h-24"
                            />
                        </div>
                    </div>

                    <SheetFooter className="pt-6 border-t border-slate-100 mt-8">
                        <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="button" className="bg-[#f84f08] hover:bg-[#d94205] text-white">
                            Atualizar Dados
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}
