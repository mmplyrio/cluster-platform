import { ActionPlanMentee } from "@/components/mentee/ActionPlanMentee";

export default function MenteeActionPlanPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Plano de Ação</h1>
                <p className="text-slate-600">Acompanhe e encerre as tarefas configuradas pelo mentor e crie subtarefas para sua equipe.</p>
            </div>
            <ActionPlanMentee />
        </div>
    );
}
