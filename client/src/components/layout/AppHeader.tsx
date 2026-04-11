import { LogOut, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";

export function AppHeader() {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10 w-full">
            <div className="flex items-center gap-2">
                {/* Mobile menu trigger could go here */}
                <h1 className="text-lg font-semibold text-slate-900 hidden md:block">
                    Ambiente de Execução da Mentoria
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-slate-500 rounded-full">
                    <Bell className="w-5 h-5" />
                </Button>

                <div className="h-8 w-px bg-slate-200" />
                
                <form action={logoutAction}>
                    <Button variant="ghost" className="text-slate-600 hover:text-red-600 gap-2">
                        <LogOut className="w-4 h-4" />
                        <span className="hidden md:inline">Sair</span>
                    </Button>
                </form>
            </div>
        </header>
    );
}
