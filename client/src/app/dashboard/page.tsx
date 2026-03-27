import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cluster | Inovação e Tecnologia',
    description: 'Cluster | Inovação e Tecnologia',
    icons: {
        icon: '/logomarca.svg', // Opcional se você já colocou na raiz
    },
}

export default function DashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-6 p-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Área do Cliente</h1>
                <p className="text-slate-500">Esta seção está em construção.</p>
            </div>

            <form action={logoutAction}>
                <Button variant="outline" className="gap-2">
                    <LogOut className="w-4 h-4" />
                    Sair da Conta
                </Button>
            </form>
        </div>
    );
}
