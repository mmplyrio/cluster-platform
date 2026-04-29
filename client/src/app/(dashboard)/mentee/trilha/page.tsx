import { LearningTrackMentee } from "@/components/mentee/LearningTrackMentee";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getTrilhaData() {
    const token = (await cookies()).get('session')?.value;
    if (!token) redirect('/login');

    const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${apiUrl}/mentee/trilha`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
    });

    if (!res.ok) {
        return { modulos: [] };
    }

    const json = await res.json();
    return json.data || { modulos: [] };
}

export default async function MenteeTrilhaPage() {
    const { modulos } = await getTrilhaData();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">A Jornada</h1>
                <p className="text-slate-600">Siga os módulos configurados pelo seu Mentor para avançar na sua mentoria.</p>
            </div>
            <LearningTrackMentee modulos={modulos} />
        </div>
    );
}
