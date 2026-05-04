import MentorDashboard from "@/components/mentor/cards";
import { TableCRM } from "@/components/mentor/TableCRM";
import { AvisosList } from "@/components/shared/AvisosList";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getDashboardData() {
    const token = (await cookies()).get('session')?.value;
    if (!token) redirect('/login');

    const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${apiUrl}/mentor/dashboard`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        return { alunos: [], avisos: [] };
    }

    const json = await res.json();
    return json.data || {};
}

export default async function MentorPage() {
    const data = await getDashboardData();
    const alunos = data?.alunos || [];
    const avisos = data?.avisos || [];
    const metricas = data?.metricas || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Visão Geral</h1>
                <p className="text-slate-600">Bem-vindo ao painel de controle do Mentor.</p>
            </div>
            <MentorDashboard metricas={metricas} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TableCRM variant="dashboard" data={alunos} />
                <AvisosList avisos={avisos} />
            </div>
        </div>
    );
}