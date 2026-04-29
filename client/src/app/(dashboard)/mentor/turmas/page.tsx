import MentorDashboard from "@/components/mentor/cards";
import { TableTurmas, Turmas } from "@/components/mentor/TableTurmas";
import { ProgramDistributionChart, ChartData } from "@/components/mentor/ProgramDistributionChart";
import { BottleneckChart, BottleneckData } from "@/components/mentor/BottleneckChart";
import { NovaTurmaSheet } from "@/components/mentor/NovaTurmaSheet";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getTurmasData() {
    const token = (await cookies()).get('session')?.value;
    if (!token) redirect('/login');

    const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${apiUrl}/mentor/turmas`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
    });

    if (!res.ok) {
        return { turmas: [], chartData: [], bottleneckData: [] };
    }

    const json = await res.json();
    return json.data || { turmas: [], chartData: [], bottleneckData: [] };
}

export default async function MentorPage() {
    const { turmas, chartData, bottleneckData } = await getTurmasData();
    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Turmas</h1>
                    <p className="text-slate-600">Visulize as turmas ativas e progressos.</p>
                </div>
                <NovaTurmaSheet />
            </div>
            <div className="hidden"> {/* MentorDashboard omitted here as it's typically on the main dashboard but kept hidden or fetched if needed */} </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TableTurmas data={turmas} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ProgramDistributionChart data={chartData} />
                    <BottleneckChart data={bottleneckData} />
                </div>

            </div>

        </div>
    );
}