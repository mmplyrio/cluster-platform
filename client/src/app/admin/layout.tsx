import { logoutAction } from '@/actions/auth';
import { LogOut } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Barra superior da área administrativa */}
            <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-slate-200 flex items-center px-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <a href="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                        ← Site
                    </a>
                    <span className="text-slate-200">|</span>
                    <span className="text-sm font-semibold text-slate-700">Painel Admin — Cluster</span>
                </div>
                <div className="ml-auto flex items-center gap-6">
                    <a
                        href="/admin/leads"
                        className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        Leads
                    </a>
                    <form action={logoutAction}>
                        <button type="submit" className="text-sm flex items-center gap-2 text-rose-500 hover:text-rose-700 transition-colors font-semibold">
                            <LogOut className="w-4 h-4" />
                            Sair
                        </button>
                    </form>
                </div>
            </header>

            {/* Conteúdo com offset do header fixo (h-14 = 56px) */}
            <main className="pt-14">
                {children}
            </main>
        </div>
    );
}
