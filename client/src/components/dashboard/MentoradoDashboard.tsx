import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, Target, CalendarDays, ArrowRight } from "lucide-react";

const MOCK_DATA = {
    empresa: "Tech Invert Solutions",
    etapaAtual: "Módulo 2: Estrutura financeira e organização gerencial",
    progresso: 30, // %
    proximoEncontro: "15 de Novembro, 14:00",
    tarefasPendentes: [
        { id: 1, titulo: "Mapeamento do plano de contas", prazo: "Hoje, 18:00", prioridade: "ALTA", status: "pending" },
        { id: 2, titulo: "Levantamento de despesas fixas", prazo: "10 de Nov", prioridade: "MÉDIA", status: "in_progress" }
    ],
    indicadores: [
        { id:1, nome: "Faturamento Mensal", meta: "R$ 150k", atual: "R$ 110k" },
        { id:2, nome: "Margem Bruta (Alvo)", meta: "45%", atual: "38%" },
        { id:3, nome: "Lucro Líquido", meta: "15%", atual: "8%" },
    ]
};

export function MentoradoDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Cabecalho Principal */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Bem-vindo, {MOCK_DATA.empresa}
                </h1>
                <p className="text-slate-500 text-lg mt-1">
                    Aqui está o resumo da sua jornada rumo ao Lucro Estruturado.
                </p>
            </div>

            {/* Top KPIs / Progress */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-primary shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Progresso da Mentoria
                        </CardTitle>
                        <Target className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{MOCK_DATA.progresso}%</div>
                        <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                            <div 
                                className="bg-primary h-full transition-all duration-1000 ease-out" 
                                style={{ width: `${MOCK_DATA.progresso}%` }} 
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Etapa Atual
                        </CardTitle>
                        <Circle className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-semibold text-slate-900 line-clamp-2">
                            {MOCK_DATA.etapaAtual}
                        </div>
                        <Button variant="link" className="p-0 h-auto mt-2 text-primary font-semibold flex items-center gap-1">
                            Acessar trilha <ArrowRight className="w-3 h-3" />
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Próximo Encontro
                        </CardTitle>
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-slate-900">{MOCK_DATA.proximoEncontro}</div>
                        <p className="text-xs text-slate-500 mt-1">Sessão Ao Vivo - via Zoom</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Tarefas Pendentes */}
                <Card className="lg:col-span-4 shadow-sm border-t-4 border-t-sidebar-accent">
                    <CardHeader>
                        <CardTitle>Suas Tarefas e Entregáveis</CardTitle>
                        <CardDescription>O que precisa ser implementado na empresa nesta etapa.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {MOCK_DATA.tarefasPendentes.map((tarefa) => (
                                <div key={tarefa.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                                    <div className="flex gap-4 items-start">
                                        {tarefa.status === 'pending' ? (
                                            <Circle className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                                        ) : (
                                            <Clock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{tarefa.titulo}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-xs font-normal bg-white">
                                                    Vence em: {tarefa.prazo}
                                                </Badge>
                                                <Badge 
                                                    variant="secondary" 
                                                    className={`text-xs ${tarefa.prioridade === 'ALTA' ? 'bg-red-50 text-red-600' : 'bg-slate-100'}`}
                                                >
                                                    {tarefa.prioridade}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline">Anexar</Button>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full mt-2 text-primary">
                                Ver todas as tarefas
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Painel de Indicadores */}
                <Card className="lg:col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle>Indicadores Essenciais</CardTitle>
                        <CardDescription>Acompanhe a evolução do seu negócio.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            {MOCK_DATA.indicadores.map((ind) => (
                                <div key={ind.id} className="group">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-slate-700">{ind.nome}</span>
                                        <span className="text-sm font-bold text-slate-900">{ind.atual} <span className="text-xs font-normal text-slate-400">/ meta: {ind.meta}</span></span>
                                    </div>
                                    {/* Mock progress bar to target */}
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-slate-800 h-full w-[65%] group-hover:bg-primary transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
