import { LearningTrackMentee } from "@/components/mentee/LearningTrackMentee";

export default function MenteeTrilhaPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">A Jornada</h1>
                <p className="text-slate-600">Siga os módulos configurados pelo seu Mentor para avançar na sua mentoria.</p>
            </div>
            <LearningTrackMentee />
        </div>
    );
}
