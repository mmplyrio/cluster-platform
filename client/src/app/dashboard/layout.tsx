import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await verifySession();

    // Redirecionamento de segurança nativo pro frontend
    if (!session) {
        redirect("/login");
    }

    // Tratamento de perfis no frontend: 
    // Qualquer um com acessos de gestão veria o módulo Mentor, do contrário Mentorado.
    const userRole = (session.role === 'mentor' || session.role === 'admin' || session.role === 'master') 
                        ? 'mentor' 
                        : 'mentorado';

    return (
        <div className="min-h-screen bg-slate-50 relative flex">
            {/* Sidebar (Desktop) */}
            <AppSidebar userRole={userRole} userName={session.email.split('@')[0]} />

            {/* Resto do Layout: Header Superior + Cópia principal em um Wrapper flex-1 */}
            <div className="flex-1 flex flex-col min-w-0 md:pl-64">
                <AppHeader />

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
