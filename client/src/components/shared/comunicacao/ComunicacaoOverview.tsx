"use client";

import { useState, useEffect } from "react";
import {
    MessageSquare,
    Megaphone,
    Clock,
    ArrowRight,
    TrendingUp,
    AlertTriangle,
    Target
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getChatOverviewAction, getConversationsAction } from "@/actions/chat";

export type UserRole = "MENTOR" | "ALUNO" | "ADMIN";

interface ComunicacaoOverviewProps {
    userRole: UserRole;
}

export function ComunicacaoOverview({ userRole }: ComunicacaoOverviewProps) {
    const isGestor = userRole === "MENTOR" || userRole === "ADMIN";
    const [overview, setOverview] = useState<any>(null);
    const [recentConvs, setRecentConvs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [ov, convs] = await Promise.all([
                    getChatOverviewAction(),
                    getConversationsAction()
                ]);
                setOverview(ov);
                setRecentConvs(convs.slice(0, 3));
            } catch (error) {
                console.error("Erro ao carregar overview:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f84f08]"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            {/* Boas-vindas Personalizado */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                    {isGestor ? "Painel de Controle de Comunicação" : "Central de Mensagens e Avisos"}
                </h1>
                <p className="text-slate-500">
                    {isGestor
                        ? "Acompanhe o engajamento e as pendências da sua base de alunos."
                        : "Fique por dentro das atualizações e prazos da sua mentoria."}
                </p>
            </div>

            {/* GRID DE INDICADORES (STATS) - Adaptado por Role */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            {isGestor ? "Novas Mensagens" : "Mensagens Não Lidas"}
                        </CardTitle>
                        <MessageSquare className="w-4 h-4 text-[#f84f08]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">
                            {overview?.newMessages || 0}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            {isGestor 
                                ? `${overview?.newMessages || 0} mensagens aguardando retorno` 
                                : "Aguardando sua leitura"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            {isGestor ? "Leitura de Avisos" : "Avisos Importantes"}
                        </CardTitle>
                        <Megaphone className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">
                            {overview?.recentAnnouncements?.length || 0}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            {isGestor ? "Avisos publicados" : "Comunicados para você"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            {isGestor ? "Prazos Críticos" : "Minhas Entregas"}
                        </CardTitle>
                        <Clock className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">
                            {overview?.radarAlerts?.length || 0}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            {isGestor ? "Atrasos identificados na base" : "Vencimentos próximos"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* SEÇÃO DE CONTEÚDO RECENTE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

                {/* Lado Esquerdo: Últimas Mensagens */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-slate-400" /> Conversas Recentes
                        </h3>
                        <Button variant="ghost" size="sm" className="text-[#f84f08] text-xs font-bold" asChild>
                            <Link href={isGestor ? "/mentor/comunicacao/inbox" : "/mentee/comunicacao/inbox"}>
                                Abrir Inbox <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                        </Button>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
                        {recentConvs.length > 0 ? (
                            recentConvs.map((conv) => (
                                <Link 
                                    key={conv.id} 
                                    href={isGestor ? "/mentor/comunicacao/inbox" : "/mentee/comunicacao/inbox"}
                                    className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-800">{conv.name}</span>
                                        <span className="text-xs text-slate-500 truncate max-w-[200px]">
                                            {conv.lastMessage || "Nenhuma mensagem ainda"}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        {new Date(conv.time).toLocaleDateString()}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                Nenhuma conversa recente.
                            </div>
                        )}
                    </div>
                </div>

                {/* Lado Direito: Alertas do Radar */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" /> Alertas do Radar
                        </h3>
                        <Button variant="ghost" size="sm" className="text-[#f84f08] text-xs font-bold" asChild>
                            <Link href={isGestor ? "/mentor/comunicacao/radar" : "/mentee/comunicacao/radar"}>
                                Ver Radar <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                        </Button>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                        {overview?.radarAlerts?.length > 0 ? (
                            overview.radarAlerts.slice(0, 3).map((alert: any) => (
                                <div key={alert.id} className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                                    <div className="mt-0.5"><AlertTriangle className="w-4 h-4 text-red-600" /></div>
                                    <div>
                                        <p className="text-sm font-bold text-red-900">{alert.title}</p>
                                        <p className="text-xs text-red-700">{alert.description}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                Nenhum alerta crítico no momento.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CTA DINÂMICO FINAL */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-full">
                        <Megaphone className="w-6 h-6 text-[#f84f08]" />
                    </div>
                    <div>
                        <h4 className="font-bold">{isGestor ? "Comunicar para a Base" : "Fique por dentro"}</h4>
                        <p className="text-sm text-slate-400">
                            {isGestor
                                ? "Dispare avisos gerais ou por turma para manter todos alinhados."
                                : "Confira todos os comunicados importantes no mural oficial."}
                        </p>
                    </div>
                </div>
                <Button className="bg-[#f84f08] hover:bg-[#d94205] text-white font-bold w-full md:w-auto" asChild>
                    <Link href={isGestor ? "/mentor/comunicacao/broadcast" : "/mentee/comunicacao/broadcast"}>
                        {isGestor ? "Criar Novo Aviso" : "Ver Mural de Avisos"}
                    </Link>
                </Button>
            </div>
        </div>
    );
}