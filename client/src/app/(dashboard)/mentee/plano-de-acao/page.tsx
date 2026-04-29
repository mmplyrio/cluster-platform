import { ActionPlanMentee } from "@/components/mentee/ActionPlanMentee";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getPlanoAcaoData() {
    const token = (await cookies()).get('session')?.value;
    if (!token) redirect('/login');

    const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${apiUrl}/mentee/plano-de-acao`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
    });

    if (!res.ok) {
        return { tarefas: [] };
    }

    const json = await res.json();
    return json.data || { tarefas: [] };
}

export default async function MenteeActionPlanPage() {
    const { tarefas } = await getPlanoAcaoData();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Plano de Ação</h1>
                <p className="text-slate-600">Acompanhe e encerre as tarefas configuradas pelo mentor e crie subtarefas para sua equipe.</p>
            </div>
            <ActionPlanMentee tarefasIniciais={tarefas} />
        </div>
    );
}
