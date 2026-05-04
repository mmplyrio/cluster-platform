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
import { MoreHorizontal, Eye, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { MenteeProfileSheet } from "./MenteeProfileSheet";

// ── Tipo CRM completo (usado na página /alunos) ──────────────────────────────
export interface CRMClient {
    id: string;
    empresa: string;
    contato: string;
    turmaAtual: string | null;
    ultimoAcesso: string;
    status: "Ativo" | "Pausado" | "Alumni";
}

// ── Tipo compacto (usado no dashboard e turmas) ───────────────────────────────
export interface Mentee {
    id: string;
    nome: string;
    turma: string;
    status: "Ativo" | "Pausado" | "Concluído";
}

// ── Props ─────────────────────────────────────────────────────────────────────
type TableCRMProps =
    | { variant?: "crm"; data: CRMClient[] }
    | { variant: "dashboard"; data: Mentee[] };

// ── Status badge helper ───────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    const cls =
        status === "Ativo" ? "bg-emerald-100 text-emerald-700"
        : status === "Pausado" ? "bg-amber-100 text-amber-700"
        : status === "Alumni" ? "bg-blue-100 text-blue-700"
        : "bg-slate-100 text-slate-700";

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
            {status}
        </span>
    );
}

// ─── Variant: Dashboard (compacto, dentro de Card) ────────────────────────────
function TableDashboard({ data }: { data: Mentee[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="p-8 text-center text-slate-400 text-sm">
                Nenhum aluno vinculado ainda.
            </div>
        );
    }

    return (
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
                        <TableCell className="font-medium text-slate-900">{mentee.nome}</TableCell>
                        <TableCell className="text-slate-600">{mentee.turma}</TableCell>
                        <TableCell>
                            <StatusBadge status={mentee.status} />
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 px-3 text-slate-500 hover:text-slate-900" asChild>
                                <Link href={`/mentor/alunos/${mentee.id}`} className="flex items-center gap-1">
                                    <Eye className="h-3.5 w-3.5" />
                                    <span className="text-xs">Ver perfil</span>
                                </Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

// ─── Variant: CRM (completo, com dropdown) ────────────────────────────────────
function TableCRMFull({ data }: { data: CRMClient[] }) {
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
        setSelectedClient({
            id: client.id,
            nome: client.empresa,
            status: client.status,
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
                                <StatusBadge status={client.status} />
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

// ─── Componente principal exportado ──────────────────────────────────────────
export function TableCRM(props: TableCRMProps) {
    if (props.variant === "dashboard") {
        return (
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-bold text-slate-800">Meus Alunos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-slate-100 overflow-hidden">
                        <TableDashboard data={props.data} />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return <TableCRMFull data={props.data} />;
}