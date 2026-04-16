"use client";

import { useState } from "react";
import { User, Bell } from "lucide-react";

// Importando os componentes shared
import { UserProfileForm } from "@/components/shared/configuracoes/UserProfileForm";
import { UserManagement } from "@/components/shared/configuracoes/UserManagement";

export default function MenteeConfiguracoesPage() {
    // Aluno logado
    const userRole: "MENTOR" | "ALUNO" | "ADMIN" = "ALUNO";

    const [activeTab, setActiveTab] = useState("perfil");

    return (
        <div className="max-w-8xl mx-auto p-6 space-y-6 h-full">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Sua Conta</h1>
                <p className="text-slate-600 mt-1">Gerencie seu perfil e suas preferências.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* MENU LATERAL */}
                <aside className="w-max md:w-64 shrink-0">
                    <nav className="flex flex-col gap-1">
                        <button
                            onClick={() => setActiveTab("perfil")}
                            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === "perfil"
                                ? "bg-white text-[#f84f08] shadow-sm border border-slate-200"
                                : "text-slate-600 hover:bg-slate-100/50"
                                }`}
                        >
                            <User className="w-4 h-4" /> Meu Perfil
                        </button>

                        <button
                            onClick={() => setActiveTab("notificacoes")}
                            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === "notificacoes"
                                ? "bg-white text-[#f84f08] shadow-sm border border-slate-200"
                                : "text-slate-600 hover:bg-slate-100/50"
                                }`}
                        >
                            <Bell className="w-4 h-4" /> Notificações
                        </button>
                    </nav>
                </aside>

                {/* ÁREA DE CONTEÚDO */}
                <main className="flex-1 w-full min-w-0">
                    {activeTab === "perfil" && <UserProfileForm />}
                    {activeTab === "notificacoes" && (
                        <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400">
                            Preferências de notificação em construção...
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
