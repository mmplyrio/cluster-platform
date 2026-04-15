"use client"; // Precisamos disso agora pois teremos interatividade (alert)

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentProfileHeader } from "@/components/mentor/StudentProfileHeader";
import { MentorshipProgress, ProgressStep } from "@/components/mentor/MentorshipProgress";
import { WorkspaceTabs } from "@/components/mentor/student-tabs/WorkspaceTabs";

export default function RaioXAlunoPage() {

    const trilhaLucroEstruturado: ProgressStep[] = [
        { id: "mod1", title: "Diagnosticar", status: "completed" },
        { id: "mod2", title: "Organizar", status: "completed" },
        { id: "mod3", title: "Prever", status: "current" },
        { id: "mod4", title: "Calibrar", status: "locked" }, // Agora é "locked" (Cinza)
        { id: "mod5", title: "Rotinizar", status: "locked" },
        { id: "mod6", title: "Crescer", status: "locked" },
    ];

    // Função que será disparada ao clicar no módulo
    const handleStepClick = (stepId: string) => {
        // No futuro, isso fará o scroll para o Módulo selecionado lá embaixo
        console.log(`Navegando para o módulo: ${stepId}`);
        alert(`Você clicou no módulo: ${stepId}. A tela vai rolar até ele!`);
    };

    return (
        <div className="space-y-6">
            <Button variant="ghost" size="sm" className="mb-2 -ml-3 text-slate-500 hover:text-slate-900" asChild>
                <Link href="/mentor/alunos">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para CRM
                </Link>
            </Button>

            <StudentProfileHeader />

            {/* Inserindo a Barra de Progresso com a nova função de clique */}
            <MentorshipProgress
                steps={trilhaLucroEstruturado}
                onStepClick={handleStepClick}
            />

            <WorkspaceTabs />
        </div>
    );
}