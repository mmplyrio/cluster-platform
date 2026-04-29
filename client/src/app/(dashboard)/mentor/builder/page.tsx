import Link from "next/link";
import {
    Plus,
    MoreVertical,
    Users,
    TrendingUp,
    Archive,
    ExternalLink,
    Copy,
    Trash2,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getBuilderData() {
    const token = (await cookies()).get('session')?.value;
    if (!token) redirect('/login');

    const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${apiUrl}/mentor/builder`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
    });

    if (!res.ok) {
        return [];
    }

    const json = await res.json();
    return json.data || [];
}

export default async function MentorshipListPage() {
    const mentorias = await getBuilderData();


    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">

            {/* CABEÇALHO E AÇÃO PRINCIPAL */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Meus Produtos</h1>
                    <p className="text-slate-500 mt-1">Gerencie e configure seus programas de mentoria.</p>
                </div>
                <Button className="bg-[#f84f08] hover:bg-[#d94205] text-white shadow-lg shadow-[#f84f08]/20 h-11 px-6" asChild>
                    <Link href="/mentor/builder/novo">
                        <Plus className="w-5 h-5 mr-2" /> Criar Nova Mentoria
                    </Link>
                </Button>
            </div>

            {/* MÉTRICAS GERAIS DO PORTFÓLIO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Faturamento Total</p>
                        <p className="text-xl font-bold text-slate-800">R$ 630.000,00</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-[#f84f08]/10 text-[#f84f08] rounded-xl">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Total de Alunos</p>
                        <p className="text-xl font-bold text-slate-800">42</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Settings className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Produtos Ativos</p>
                        <p className="text-xl font-bold text-slate-800">1/2</p>
                    </div>
                </div>
            </div>

            {/* LISTAGEM DE PRODUTOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mentorias.map((mentoria: any) => (
                    <div key={mentoria.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col group overflow-hidden">

                        <div className="p-6 flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <Badge className={`text-[10px] font-bold uppercase
                                    ${mentoria.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}
                                `}>
                                    {mentoria.status}
                                </Badge>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="text-xs font-medium cursor-pointer">
                                            <Copy className="w-3.5 h-3.5 mr-2" /> Duplicar Estrutura
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-xs font-medium cursor-pointer">
                                            <Archive className="w-3.5 h-3.5 mr-2" /> Arquivar Produto
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-xs font-medium text-red-600 cursor-pointer">
                                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-[#f84f08] transition-colors">
                                    {mentoria.titulo}
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                                    Atualizado {mentoria.ultimaAtualizacao}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Alunos</p>
                                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-slate-300" /> {mentoria.alunosAtivos}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Faturamento</p>
                                    <p className="text-sm font-bold text-emerald-600">
                                        {mentoria.faturamentoTotal}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* BOTÕES DE AÇÃO DO CARD */}
                        <div className="bg-slate-50 p-4 border-t border-slate-100 flex gap-2">
                            <Button variant="outline" className="flex-1 h-9 text-xs font-bold border-slate-200 bg-white" asChild>
                                <Link href={`/mentor/builder/editar/${mentoria.id}`}>
                                    Editar Template
                                </Link>
                            </Button>
                            <Button className="flex-1 h-9 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white" asChild>
                                <Link href={`/mentor/turmas`}>
                                    Gerir Turmas
                                </Link>
                            </Button>
                        </div>
                    </div>
                ))}

                {/* CARD DE ADICIONAR (Placeholder visual) */}
                <Link
                    href="/mentor/builder/novo"
                    className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-[#f84f08]/50 hover:text-[#f84f08] transition-all group min-h-[250px]"
                >
                    <div className="p-4 bg-slate-50 rounded-full mb-3 group-hover:bg-[#f84f08]/5 transition-colors">
                        <Plus className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-sm">Criar Nova Mentoria</span>
                </Link>
            </div>
        </div>
    );
}