"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Layout, ListChecks, Target, ClipboardList, PauseCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneralInfoBuilder } from "@/components/builder/GeneralInfoBuilder";
import { TrackBuilder } from "@/components/builder/TrackBuilder";
import { ActionPlanBuilder } from "@/components/builder/ActionPlanBuilder";
import { DiagnosticBuilder } from "@/components/builder/DiagnosticBuilder";
import { updateMentorshipTemplateAction } from "@/actions/mentor";
import { useRouter } from "next/navigation";

type TabId = "geral" | "trilha" | "plano" | "prontuario";

export default function MentorshipEditor({ initialData, builderId }: { initialData: any, builderId: string }) {
    const [titulo, setTitulo] = useState(initialData.titulo);
    const [descricao, setDescricao] = useState(initialData.descricao || "");
    const [preco, setPreco] = useState(initialData.preco || "");
    const [status, setStatus] = useState(initialData.status);
    const [activeTab, setActiveTab] = useState<TabId>("geral");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const menuItems = [
        { id: "geral", label: "Informações Gerais", icon: Layout },
        { id: "trilha", label: "Trilha de Aprendizado", icon: ListChecks },
        { id: "plano", label: "Plano de Ação", icon: Target },
        { id: "prontuario", label: "Prontuário Clínico", icon: ClipboardList },
    ];

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await updateMentorshipTemplateAction(builderId, {
                titulo,
                descricao,
                preco,
                status
            });
            if (res.success) {
                alert("Mentoria atualizada com sucesso!");
                router.refresh();
                router.push('/mentor/builder');
            } else {
                alert("Erro ao atualizar: " + res.error);
            }
        } catch (error) {
            alert("Erro de comunicação.");
        } finally {
            setLoading(false);
        }
    };

    const isSuspended = status === "Suspenso";

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            {/* CABEÇALHO DO BUILDER */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-30">
                <div>
                    <Button variant="ghost" size="sm" className="mb-2 -ml-3 text-slate-500 hover:text-slate-900" asChild>
                        <Link href="/mentor/builder">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Meus Produtos
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-800">
                            {titulo || "Nova Mentoria"}
                        </h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isSuspended ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                        }`}>
                            {status}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        type="button"
                        className={`border-slate-200 ${isSuspended ? "text-emerald-600 hover:bg-emerald-50" : "text-red-600 hover:bg-red-50"} bg-white`}
                        onClick={() => setStatus(isSuspended ? "Ativo" : "Suspenso")}
                    >
                        {isSuspended ? <PlayCircle className="w-4 h-4 mr-2" /> : <PauseCircle className="w-4 h-4 mr-2" />}
                        {isSuspended ? "Reativar Mentoria" : "Suspender Mentoria"}
                    </Button>
                    <Button 
                        className="bg-[#f84f08] hover:bg-[#d94205] text-white shadow-sm"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        <Save className="w-4 h-4 mr-2" /> {loading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </div>

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

            {/* ÁREA DE CONTEÚDO */}
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
                {activeTab === "trilha" && <TrackBuilder />}
                {activeTab === "plano" && <ActionPlanBuilder />}
                {activeTab === "prontuario" && <DiagnosticBuilder />}
            </main>
        </div>
    );
}
