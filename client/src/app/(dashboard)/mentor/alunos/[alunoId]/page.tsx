"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentProfileHeader } from "@/components/mentor/StudentProfileHeader";
import { MentorshipProgress, ProgressStep } from "@/components/mentor/MentorshipProgress";
import { WorkspaceTabs } from "@/components/mentor/student-tabs/WorkspaceTabs";
import { getAlunoDetailsAction } from "@/actions/mentor";

export default function RaioXAlunoPage() {
    const params = useParams();
    const alunoId = params.alunoId as string;

    const [studentData, setStudentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);

    const fallbackSteps: ProgressStep[] = [
        { id: "mod1", title: "Diagnosticar", status: "completed" },
        { id: "mod2", title: "Organizar", status: "completed" },
        { id: "mod3", title: "Prever", status: "current" },
        { id: "mod4", title: "Calibrar", status: "locked" },
        { id: "mod5", title: "Rotinizar", status: "locked" },
        { id: "mod6", title: "Crescer", status: "locked" },
    ];

    useEffect(() => {
        if (!alunoId) return;
        const loadData = async () => {
            const data = await getAlunoDetailsAction(alunoId);
            setStudentData(data);
            if (data?.matriculas && data.matriculas.length > 0) {
                setSelectedJourneyId(data.matriculas[0].id);
            }
            setLoading(false);
        };
        loadData();
    }, [alunoId]);

    const handleStepClick = (stepId: string) => {
        console.log(`Navegando para o módulo: ${stepId}`);
        alert(`Você clicou no módulo: ${stepId}. A tela vai rolar até ele!`);
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500 flex items-center justify-center min-h-[400px]">Carregando dados do aluno...</div>;
    }

    if (!studentData) {
        return <div className="p-8 text-center text-red-500 flex items-center justify-center min-h-[400px]">Aluno não encontrado ou ocorreu um erro.</div>;
    }

    // Determine which steps to show based on the selected journey context
    let activeSteps = fallbackSteps;
    if (selectedJourneyId && studentData.journeysData && studentData.journeysData[selectedJourneyId]) {
        activeSteps = studentData.journeysData[selectedJourneyId].modules || [];
    } else if (studentData.steps && studentData.steps.length > 0) {
        activeSteps = studentData.steps; // fallback to the old structure just in case
    }
    
    // If there are no steps for this journey, provide an empty array to render an empty progress bar
    if (activeSteps.length === 0) activeSteps = [];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Button variant="ghost" size="sm" className="mb-2 -ml-3 text-slate-500 hover:text-slate-900" asChild>
                <Link href="/mentor/alunos">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para CRM
                </Link>
            </Button>

            <StudentProfileHeader 
                student={studentData} 
                selectedJourneyId={selectedJourneyId} 
                onJourneyChange={setSelectedJourneyId} 
            />

            <MentorshipProgress
                steps={activeSteps}
                onStepClick={handleStepClick}
            />

            <WorkspaceTabs 
                studentData={studentData}
                selectedJourneyId={selectedJourneyId}
            />
        </div>
    );
}