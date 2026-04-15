"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface GeneralInfoBuilderProps {
    titulo: string;
    setTitulo: (titulo: string) => void;
}

export function GeneralInfoBuilder({ titulo, setTitulo }: GeneralInfoBuilderProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div>
                <h3 className="text-lg font-bold text-slate-800">Informações Comerciais</h3>
                <p className="text-sm text-slate-500 mt-1">
                    Configure os dados básicos de apresentação e escopo desta mentoria.
                </p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Nome da Mentoria</Label>
                    <Input
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Ex: Máquina de Vendas B2B"
                        className="text-lg font-medium h-12 bg-white"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Promessa / Objetivo Principal</Label>
                    <Textarea
                        placeholder="Qual é a transformação que esta mentoria entrega? Ex: Estruturar o fluxo de caixa para obter previsibilidade financeira em 90 dias."
                        className="resize-none h-24 text-base bg-white"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold">Capacidade Máxima</Label>
                        <Input type="number" placeholder="Ex: 20 alunos" className="h-10 bg-white" />
                        <span className="text-[10px] text-slate-400">Deixe em branco para ilimitado</span>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold">Duração (Meses)</Label>
                        <Input type="number" placeholder="Ex: 6" className="h-10 bg-white" />
                        <span className="text-[10px] text-slate-400">Tempo de acesso ao programa</span>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold">Ticket Base</Label>
                        <Input type="text" placeholder="R$ 15.000,00" className="h-10 bg-white" />
                        <span className="text-[10px] text-slate-400">Apenas para referência interna</span>
                    </div>
                </div>
            </div>
        </div>
    );
}