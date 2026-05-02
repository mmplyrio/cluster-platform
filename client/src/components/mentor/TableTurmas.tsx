"use client";

import { useState } from "react";
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
import { MoreHorizontal, ExternalLink, Info } from "lucide-react"; // Ícones para as ações
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { TurmaInfoSheet } from "./TurmaInfoSheet";

// 1. DEFINIMOS A TIPAGEM DOS DADOS (O que o componente espera receber)
export interface Turmas {
    id: string;
    nome: string;
    qtdAlunos: string;
    status: "Em Andamento" | "Inscrições Abertas" | "Concluída";
    descricao?: string;
    produto?: string;
    preco?: string;
    dataInicio?: string;
    vagas?: string;
}

interface TableTurmasProps {
    data: Turmas[];
}

export function TableTurmas({ data }: TableTurmasProps) {
    const [selectedTurma, setSelectedTurma] = useState<Turmas | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleOpenSheet = (turma: Turmas) => {
        setSelectedTurma(turma);
        setIsSheetOpen(true);
    };

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-bold text-slate-800">Turmas Ativas</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border border-slate-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="w-[250px] text-slate-600 font-semibold">Nome da Turma</TableHead>
                                <TableHead className="text-slate-600 font-semibold">Alunos</TableHead>
                                <TableHead className="text-slate-600 font-semibold">Status</TableHead>
                                <TableHead className="text-right text-slate-600 font-semibold">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((turma) => (
                                <TableRow key={turma.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-medium text-slate-900">
                                        {turma.nome}
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        {turma.qtdAlunos} alunos
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${turma.status === "Em Andamento" ? "bg-emerald-100 text-emerald-700" :
                                            turma.status === "Concluída" ? "bg-slate-100 text-slate-700" :
                                                "bg-amber-100 text-amber-700"
                                            }`}>
                                            {turma.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/mentor/turmas/${turma.id}`} className="flex items-center cursor-pointer w-full">
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        Acessar turma
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="cursor-pointer" 
                                                    onClick={() => handleOpenSheet(turma)}
                                                >
                                                    <Info className="mr-2 h-4 w-4" />
                                                    Informações
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            {/* Sheet para exibir as informações da turma */}
            <TurmaInfoSheet 
                turma={selectedTurma} 
                open={isSheetOpen} 
                onOpenChange={setIsSheetOpen} 
            />
        </Card>
    );
}