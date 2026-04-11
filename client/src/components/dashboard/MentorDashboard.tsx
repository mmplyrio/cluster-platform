import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, AlertCircle, FileSearch, CheckCircle2 } from "lucide-react";

const MOCK_MENTOR_DATA = {
    mentorNome: "Especialista Cluster",
    empresasAtivas: 12,
    riscoAlerta: 2,
    entregasPendentes: 5,
    carteira: [
        { id: 1, empresa: "Tech Invert Solutions", etapa: "Módulo 2", status: "ok", ultimaInteracao: "Há 2 dias" },
        { id: 2, empresa: "Agência Digital X", etapa: "Módulo 1", status: "risco", ultimaInteracao: "Há 12 dias" },
        { id: 3, empresa: "Logística Alpha", etapa: "Módulo 4", status: "ok", ultimaInteracao: "Ontem" },
    ]
};

export function MentorDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Cabecalho Principal */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Visão de Carteira
                </h1>
                <p className="text-slate-500 text-lg mt-1">
                    Acompanhamento gerencial das mentorias ativas.
                </p>
            </div>

            {/* KPIs Mentor */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Mentorados Ativos</CardTitle>
                        <Users className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{MOCK_MENTOR_DATA.empresasAtivas}</div>
                        <p className="text-xs text-green-600 font-medium">+2 neste mês</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Em Risco / Atraso</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{MOCK_MENTOR_DATA.riscoAlerta}</div>
                        <p className="text-xs text-slate-500">Média de 7 dias s/ engajamento</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Aguardando Validação</CardTitle>
                        <FileSearch className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{MOCK_MENTOR_DATA.entregasPendentes}</div>
                        <p className="text-xs text-slate-500">Tarefas de 3 empresas</p>
                    </CardContent>
                </Card>
            </div>

            {/* Lista da Carteira */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Sua Carteira de Mentorados</CardTitle>
                    <CardDescription>Status atual e evolução estrutural das empresas acompanhadas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Empresa</th>
                                    <th className="px-4 py-3 font-medium">Etapa Atual</th>
                                    <th className="px-4 py-3 font-medium">Última Interação</th>
                                    <th className="px-4 py-3 font-medium">Status / Saúde</th>
                                    <th className="px-4 py-3 font-medium text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {MOCK_MENTOR_DATA.carteira.map((cliente) => (
                                    <tr key={cliente.id} className="hover:bg-slate-50 border-b">
                                        <td className="px-4 py-4 font-semibold text-slate-900">
                                            {cliente.empresa}
                                        </td>
                                        <td className="px-4 py-4">
                                            <Badge variant="outline" className="font-normal">{cliente.etapa}</Badge>
                                        </td>
                                        <td className="px-4 py-4 text-slate-500">
                                            {cliente.ultimaInteracao}
                                        </td>
                                        <td className="px-4 py-4">
                                            {cliente.status === 'ok' ? (
                                                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none font-medium gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Em Dia
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-none font-medium gap-1">
                                                    <AlertCircle className="w-3 h-3" /> Risco de Abandono
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-medium">Ver Dossiê</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
