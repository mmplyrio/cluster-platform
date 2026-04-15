"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Layout, ListChecks, Target, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

// Importação dos Componentes Isolados
import { GeneralInfoBuilder } from "@/components/builder/GeneralInfoBuilder";
import { TrackBuilder } from "@/components/builder/TrackBuilder";
import { ActionPlanBuilder } from "@/components/builder/ActionPlanBuilder";
import { DiagnosticBuilder } from "@/components/builder/DiagnosticBuilder";

type TabId = "geral" | "trilha" | "plano" | "prontuario";

export default function MentorshipBuilderPage() {
    const [titulo, setTitulo] = useState("Programa Lucro Estruturado");
    const [activeTab, setActiveTab] = useState<TabId>("geral");

    const menuItems = [
        { id: "geral", label: "Informações Gerais", icon: Layout },
        { id: "trilha", label: "Trilha de Aprendizado", icon: ListChecks },
        { id: "plano", label: "Plano de Ação", icon: Target },
        { id: "prontuario", label: "Prontuário Clínico", icon: ClipboardList },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">

            {/* CABEÇALHO DO BUILDER (Fixo no topo) */}
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
                    <Button variant="outline" className="border-slate-200 text-slate-600 bg-white">
                        Salvar Rascunho
                    </Button>
                    <Button className="bg-[#f84f08] hover:bg-[#d94205] text-white shadow-sm">
                        <Save className="w-4 h-4 mr-2" /> Publicar Mentoria
                    </Button>
                </div>
            </div>

            {/* MENU HORIZONTAL EM LINHA (Fixo logo abaixo do cabeçalho) */}
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

            {/* ÁREA DE CONTEÚDO (Logo abaixo do menu) */}
            <main className="w-full">
                {activeTab === "geral" && <GeneralInfoBuilder titulo={titulo} setTitulo={setTitulo} />}
                {activeTab === "trilha" && <TrackBuilder />}
                {activeTab === "plano" && <ActionPlanBuilder />}
                {activeTab === "prontuario" && <DiagnosticBuilder />}
            </main>
        </div>
    );
}