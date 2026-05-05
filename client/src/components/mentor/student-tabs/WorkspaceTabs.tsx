"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, ListTodo, FileClock } from "lucide-react";

import { LearningTrackManager } from "@/components/mentor/student-tabs/LearningTrackManager";
import { ActionPlan } from "@/components/mentor/student-tabs/ActionPlan";
import { MentorshipLogbook } from "./MentorshipLogbook";

interface WorkspaceTabsProps {
    studentData?: any;
    selectedJourneyId?: string | null;
}

export function WorkspaceTabs({ studentData, selectedJourneyId }: WorkspaceTabsProps) {
    return (
        <Tabs defaultValue="trilha" className="w-full mt-8">
            {/* MENU DE NAVEGAÇÃO DAS ABAS */}
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-100/50 p-1">
                <TabsTrigger value="trilha" className="data-[state=active]:bg-white data-[state=active]:text-[#f84f08] data-[state=active]:shadow-sm transition-all">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Trilha
                </TabsTrigger>
                <TabsTrigger value="plano" className="data-[state=active]:bg-white data-[state=active]:text-[#f84f08] data-[state=active]:shadow-sm transition-all">
                    <ListTodo className="w-4 h-4 mr-2" />
                    Plano de Ação
                </TabsTrigger>
                <TabsTrigger value="prontuario" className="data-[state=active]:bg-white data-[state=active]:text-[#f84f08] data-[state=active]:shadow-sm transition-all">
                    <FileClock className="w-4 h-4 mr-2" />
                    Prontuário
                </TabsTrigger>
            </TabsList>

            {/* CONTEÚDO DA ABA 1: Gestão da Trilha (Aulas e Arquivos) */}
            <TabsContent value="trilha" className="mt-6 animate-in fade-in slide-in-from-bottom-2">
                <LearningTrackManager studentData={studentData} selectedJourneyId={selectedJourneyId} />
            </TabsContent>

            {/* CONTEÚDO DA ABA 2: Tarefas Práticas */}
            <TabsContent value="plano" className="mt-6">
                <ActionPlan studentData={studentData} />
            </TabsContent>

            {/* CONTEÚDO DA ABA 3: Histórico de Sessões */}
            <TabsContent value="prontuario" className="mt-6">
                <MentorshipLogbook studentData={studentData} />
            </TabsContent>
        </Tabs>
    );
}