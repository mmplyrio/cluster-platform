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
export interface Turmas {
    id: string;
    nome: string;
    qtdAlunos: string;
    status: "Em Andamento" | "Inscrições Abertas" | "Concluída";
}

interface TableTurmasProps {
    data: Turmas[]; // O componente recebe um array de 'Turmas'
}

export function TableTurmas({ data }: TableTurmasProps) {
    return (
        <Card className="gap-1">
            <CardHeader>
                <CardTitle className="text-1xl font-semibold text-slate-800">Turmas</CardTitle>
            </CardHeader>
            <CardContent className="">
                <div className="rounded-md border overflow-hidden">
                    <Table className="w-full border-slate-800">
                        <TableCaption className="pb-2">Listagem atual de Turmas.</TableCaption>

                        {/* CABEÇALHO DA TABELA */}
                        <TableHeader className="pt-0">
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Qtd. Alunos</TableHead>
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
                                        {mentee.qtdAlunos}
                                    </TableCell>
                                    <TableCell>
                                        {/* Estilização condicional simples baseada no status */}
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${mentee.status === "Em Andamento" ? "bg-emerald-100 text-emerald-700" :
                                            mentee.status === "Concluída" ? "bg-slate-100 text-slate-700" :
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