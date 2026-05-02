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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { MenteeProfileSheet } from "./MenteeProfileSheet";

export interface CRMClient {
    id: string;
    empresa: string;
    contato: string;
    turmaAtual: string | null;
    ultimoAcesso: string;
    status: "Ativo" | "Pausado" | "Alumni";
}

interface TableCRMProps {
    data: CRMClient[];
}

export function TableCRM({ data }: TableCRMProps) {
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    if (!data || data.length === 0) {
        return (
            <div className="p-8 text-center text-slate-500">
                Nenhum cliente encontrado.
            </div>
        );
    }

    const handleOpenSheet = (client: CRMClient) => {
        // Mapeamos para o formato esperado pelo MenteeProfileSheet
        setSelectedClient({
            id: client.id,
            nome: client.empresa,
            status: client.status,
            // Os demais campos serão preenchidos pelo componente ou via API no futuro
        });
        setIsSheetOpen(true);
    };

    return (
        <>
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[300px]">Empresa / Contato</TableHead>
                        <TableHead>Vínculo Atual</TableHead>
                        <TableHead>Último Acesso</TableHead>
                        <TableHead>Status Global</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((client) => (
                        <TableRow key={client.id} className="hover:bg-slate-50/50">
                            <TableCell>
                                <div className="font-medium text-slate-900">{client.empresa}</div>
                                <div className="text-xs text-slate-500">{client.contato}</div>
                            </TableCell>
                            <TableCell>
                                {client.turmaAtual ? (
                                    <span className="text-sm text-slate-600">{client.turmaAtual}</span>
                                ) : (
                                    <span className="text-sm text-slate-400 italic">Sem vínculo ativo</span>
                                )}
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">{client.ultimoAcesso}</TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                    ${client.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : ''}
                                    ${client.status === 'Pausado' ? 'bg-amber-100 text-amber-700' : ''}
                                    ${client.status === 'Alumni' ? 'bg-blue-100 text-blue-700' : ''}
                                `}>
                                    {client.status}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Abrir menu</span>
                                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/mentor/alunos/${client.id}`} className="flex items-center cursor-pointer">
                                                <Eye className="w-4 h-4 mr-2" /> Ver Raio-X
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            className="cursor-pointer"
                                            onClick={() => handleOpenSheet(client)}
                                        >
                                            <User className="w-4 h-4 mr-2" /> Editar Cadastro
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <MenteeProfileSheet 
                mentee={selectedClient}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />
        </>
    );
}