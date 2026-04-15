import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell, AlertCircle, Info } from "lucide-react";

// Tipagem do que é um "Aviso" no nosso sistema
export interface Aviso {
    id: string;
    titulo: string;
    conteudo: string;
    data: string;
    tipo: "info" | "urgente" | "sucesso";
    autor?: string;
}

interface AvisosListProps {
    avisos: Aviso[];
    // Uma mensagem para caso a lista esteja vazia
    emptyMessage?: string;
}

export function AvisosList({ avisos, emptyMessage = "Nenhum aviso no momento." }: AvisosListProps) {
    if (avisos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-slate-500 border border-dashed rounded-xl bg-slate-50">
                <Bell className="w-8 h-8 mb-2 text-slate-400" />
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <Card className="gap-1">
            <CardHeader>
                <CardTitle className="text-1xl font-semibold text-slate-800">Avisos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {avisos.map((aviso) => (
                        <Card key={aviso.id} className={`gap-1 border-l-4 ${aviso.tipo === 'urgente' ? 'border-l-red-500' :
                            aviso.tipo === 'sucesso' ? 'border-l-emerald-500' :
                                'border-l-blue-500'
                            }`}>
                            <CardHeader className="py-1 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-2">
                                    {aviso.tipo === 'urgente' ? <AlertCircle className="w-4 h-4 text-red-500" /> : <Info className="w-4 h-4 text-blue-500" />}
                                    <CardTitle className="text-base font-semibold text-slate-800">
                                        {aviso.titulo}
                                    </CardTitle>
                                </div>
                                <span className="text-xs text-slate-500 font-medium">
                                    {aviso.data}
                                </span>
                            </CardHeader>
                            <CardContent className="py-0 text-sm text-slate-600">
                                <p>{aviso.conteudo}</p>
                                {aviso.autor && (
                                    <p className="text-xs text-slate-400 mt-2 font-medium">
                                        Por: {aviso.autor}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}