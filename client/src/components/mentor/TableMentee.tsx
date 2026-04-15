import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react"; // Ícone para as ações

// 1. DEFINIMOS A TIPAGEM DOS DADOS (O que o componente espera receber)
export interface Mentee {
    id: string;
    nome: string;
    turma: string;
    status: "Ativo" | "Pausado" | "Concluído";
}

interface TableMenteeProps {
    data: Mentee[]; // O componente recebe um array de 'Mentees'
}

export function TableMentee({ data }: TableMenteeProps) {
    return (
        <Card className="gap-1">
            <CardHeader>
                <CardTitle className="text-1xl font-semibold text-slate-800">Alunos</CardTitle>
            </CardHeader>
            <CardContent className="">
                <div className="rounded-md border overflow-hidden">
                    <Table className="w-full border-slate-800">
                        <TableCaption className="pb-2">Listagem atual de alunos e mentorados.</TableCaption>

                        {/* CABEÇALHO DA TABELA */}
                        <TableHeader className="pt-0">
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Turma</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>

                        {/* CORPO DA TABELA */}
                        <TableBody>
                            {/* 2. FAZEMOS O MAP NOS DADOS RECEBIDOS POR PROP */}
                            {data.map((mentee) => (
                                <TableRow key={mentee.id}>
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
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                        </Button>
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