import { MentoradoDashboard } from "@/components/dashboard/MentoradoDashboard";
import { MentorDashboard } from "@/components/dashboard/MentorDashboard";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await verifySession();

    if (!session) {
        redirect("/login");
    }

    // Determina a role de fallback para display. Admin e Master veem as ferramentas do Mentor.
    const userRole = (session.role === 'mentor' || session.role === 'admin' || session.role === 'master') 
                        ? 'mentor' 
                        : 'mentorado';

    return (
        <div className="w-full">
            {userRole === 'mentorado' && <MentoradoDashboard />}
            {userRole === 'mentor' && <MentorDashboard />}
        </div>
    );
}
