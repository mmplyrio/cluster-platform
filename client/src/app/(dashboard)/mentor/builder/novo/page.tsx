"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Layout, ListChecks, Target, ClipboardList, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { GeneralInfoBuilder } from "@/components/builder/GeneralInfoBuilder";
import { TrackBuilder } from "@/components/builder/TrackBuilder";
import { DiagnosticBuilder, BlocoDiagnostico } from "@/components/builder/DiagnosticBuilder";
import { ActionPlanBuilder, EtapaPlano } from "@/components/builder/ActionPlanBuilder";
import { createMentorshipTemplateAction } from "@/actions/mentor";

type TabId = "geral" | "trilha" | "plano" | "prontuario";

interface Objetivo { descricao: string; }
interface Modulo {
    id?: string;
    titulo: string;
    objetivoMacro: string;
    objectives: Objetivo[];
}

export default function MentorshipBuilderNovoPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState("");
    const [modulos, setModulos] = useState<Modulo[]>([]);
    const [etapas, setEtapas] = useState<EtapaPlano[]>([
        { id: "e1", titulo: "0-30 Dias (Emergencial)", descricao: "Ações críticas para estancar sangramentos." },
        { id: "e2", titulo: "31-60 Dias (Estruturação)", descricao: "Implementação de novos processos." },
        { id: "e3", titulo: "61-90 Dias (Otimização)", descricao: "Escala e ajustes de margem." }
    ]);
    const [blocos, setBlocos] = useState<BlocoDiagnostico[]>([
        {
            id: "b1",
            titulo: "Bloco 1 — Contexto atual do negócio",
            objetivo: "Entender o momento atual e a percepção do empreendedor sobre os problemas centrais.",
            perguntas: [
                {
                    id: "p1",
                    texto: "Qual destas situações melhor descreve sua principal preocupação financeira?",
                    tipo: "multipla_escolha",
                    opcoes: ["Vender mais", "Sobrar mais dinheiro", "Organizar números"]
                }
            ]
        }
    ]);
    const [activeTab, setActiveTab] = useState<TabId>("geral");
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const menuItems = [
        { id: "geral", label: "Informações Gerais", icon: Layout },
        { id: "trilha", label: "Trilha de Aprendizado", icon: ListChecks },
        { id: "plano", label: "Plano de Ação", icon: Target },
        { id: "prontuario", label: "Prontuário Clínico", icon: ClipboardList },
    ];

    const handleSave = (status: "Rascunho" | "Ativo") => {
        if (!titulo.trim()) {
            setFeedback({ type: "error", msg: "O nome da mentoria é obrigatório." });
            setActiveTab("geral");
            return;
        }
        setFeedback(null);

        startTransition(async () => {
            // Unificar todos os dados em módulos para o banco de dados
            const allModules = [
                ...modulos.map((m: any) => ({ ...m, tipo: 'trilha' })),
                ...etapas.map(e => ({ 
                    titulo: `[Plano] ${e.titulo}`, 
                    objetivoMacro: e.descricao,
                    objectives: [],
                    tipo: 'plano'
                })),
                ...blocos.map(b => ({
                    titulo: `[Diagnóstico] ${b.titulo}`,
                    objetivoMacro: b.objetivo,
                    objectives: b.perguntas.map(p => ({
                        descricao: `${p.texto} | Tipo: ${p.tipo} | Opções: ${p.opcoes?.join(',') || ''}`
                    })),
                    tipo: 'diagnostico'
                }))
            ];

            const result = await createMentorshipTemplateAction({
                titulo: titulo.trim(),
                descricao: descricao.trim() || null,
                preco: preco || "0",
                status,
                modules: allModules,
            });

            if (result?.success) {
                router.push("/mentor/builder");
            } else {
                setFeedback({ type: "error", msg: result?.error || "Ocorreu um erro ao salvar." });
            }
        });
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">

            {/* CABEÇALHO */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-30">
                <div>
                    <Button variant="ghost" size="sm" className="mb-2 -ml-3 text-slate-500 hover:text-slate-900" asChild>
                        <Link href="/mentor/builder">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Meus Produtos
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold text-slate-800">
                        {titulo || "Nova Mentoria"}
                    </h1>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="border-slate-200 text-slate-600 bg-white"
                        onClick={() => handleSave("Rascunho")}
                        disabled={isPending}
                    >
                        {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Salvar Rascunho
                    </Button>
                    <Button
                        className="bg-[#f84f08] hover:bg-[#d94205] text-white shadow-sm"
                        onClick={() => handleSave("Ativo")}
                        disabled={isPending}
                    >
                        {isPending
                            ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            : <Save className="w-4 h-4 mr-2" />
                        }
                        Publicar Mentoria
                    </Button>
                </div>
            </div>

            {/* FEEDBACK BANNER */}
            {feedback && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    feedback.type === "success"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                }`}>
                    {feedback.type === "success"
                        ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                        : <AlertCircle className="w-4 h-4 shrink-0" />
                    }
                    {feedback.msg}
                </div>
            )}

            {/* MENU HORIZONTAL */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-[104px] z-20">
                <div className="flex overflow-x-auto hide-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as TabId)}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-bold transition-all border-b-2 whitespace-nowrap
                                    ${isActive
                                        ? "border-[#f84f08] text-[#f84f08] bg-[#f84f08]/5"
                                        : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                    }
                                `}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* CONTEÚDO */}
            <main className="w-full">
                {activeTab === "geral" && (
                    <GeneralInfoBuilder
                        titulo={titulo}
                        setTitulo={setTitulo}
                        descricao={descricao}
                        setDescricao={setDescricao}
                        preco={preco}
                        setPreco={setPreco}
                    />
                )}
                {activeTab === "trilha" && (
                    <TrackBuilder modulos={modulos} setModulos={setModulos} />
                )}
                {activeTab === "plano" && <ActionPlanBuilder etapas={etapas} setEtapas={setEtapas} />}
                {activeTab === "prontuario" && <DiagnosticBuilder blocos={blocos} setBlocos={setBlocos} />}
            </main>
        </div>
    );
}
