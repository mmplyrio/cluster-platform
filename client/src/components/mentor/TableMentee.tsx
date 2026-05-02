"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, User } from "lucide-react"; // Ícones para as ações
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

// 1. DEFINIMOS A TIPAGEM DOS DADOS (O que o componente espera receber)
export interface Mentee {
    id: string;
    nome: string;
    turma: string;
    status: "Ativo" | "Pausado" | "Concluído";
}

interface TableMenteeProps {
    data: Mentee[];
}

export function TableMentee({ data }: TableMenteeProps) {
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-bold text-slate-800">Meus Alunos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border border-slate-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="w-[200px] text-slate-600 font-semibold">Nome</TableHead>
                                <TableHead className="text-slate-600 font-semibold">Turma</TableHead>
                                <TableHead className="text-slate-600 font-semibold">Status</TableHead>
                                <TableHead className="text-right text-slate-600 font-semibold">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((mentee) => (
                                <TableRow key={mentee.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-medium text-slate-900">
                                        {mentee.nome}
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        {mentee.turma}
                                    </TableCell>
                                    <TableCell>
                                        {/* Estilização condicional simples baseada no status */}
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${mentee.status === "Ativo" ? "bg-emerald-100 text-emerald-700" :
                                            mentee.status === "Concluído" ? "bg-slate-100 text-slate-700" :
                                                "bg-amber-100 text-amber-700"
                                            }`}>
                                            {mentee.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Sheet>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/mentor/alunos/${mentee.id}`} className="flex items-center cursor-pointer w-full">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Visualizar perfil
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <SheetTrigger asChild>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <User className="mr-2 h-4 w-4" />
                                                            Perfil
                                                        </DropdownMenuItem>
                                                    </SheetTrigger>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            <SheetContent className="sm:max-w-[540px]">
                                                <SheetHeader className="pb-4 border-b border-slate-100">
                                                    <SheetTitle>Perfil do Aluno</SheetTitle>
                                                    <SheetDescription>
                                                        Informações detalhadas do cadastro de {mentee.nome}.
                                                    </SheetDescription>
                                                </SheetHeader>
                                                <div className="py-8 space-y-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600 border-2 border-white shadow-sm">
                                                            {mentee.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h3 className="text-xl font-bold text-slate-900">{mentee.nome}</h3>
                                                            <p className="text-sm text-slate-500 font-medium">{mentee.turma}</p>
                                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${mentee.status === "Ativo" ? "bg-emerald-100 text-emerald-700" :
                                                                mentee.status === "Concluído" ? "bg-slate-100 text-slate-700" :
                                                                    "bg-amber-100 text-amber-700"
                                                                }`}>
                                                                {mentee.status}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-6 pt-6 border-t border-slate-100">
                                                        <div className="space-y-1">
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Identificador Único</p>
                                                            <p className="text-sm font-medium text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">#{mentee.id}</p>
                                                        </div>

                                                        <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                                                            <p className="text-xs text-amber-800 font-medium">
                                                                Nota: Para ver o andamento completo da mentoria, plano de ação e ferramentas, utilize a opção "Visualizar perfil" no menu de ações.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SheetContent>
                                        </Sheet>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}