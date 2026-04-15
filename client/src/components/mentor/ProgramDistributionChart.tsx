"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// 1. TIPAGEM DOS DADOS
export interface ChartData {
    name: string;
    value: number;
}

interface ProgramDistributionChartProps {
    title?: string;
    data: ChartData[];
}

// Paleta de cores moderna (puxando para a identidade visual que você demonstrou)
const COLORS = [
    "#f84f08", // Laranja (Sua cor principal)
    "#3b82f6", // Azul
    "#10b981", // Esmeralda
    "#f59e0b", // Âmbar
    "#6366f1"  // Indigo
];

export function ProgramDistributionChart({ title = "Distribuição por Produto", data }: ProgramDistributionChartProps) {

    // Fallback caso não haja dados
    if (!data || data.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-slate-800">{title}</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center text-slate-400 text-sm">
                    Nenhum dado disponível.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold text-slate-800">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 mt-4">
                {/* ResponsiveContainer garante que o gráfico se adapte ao tamanho do Card */}
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%" // Centraliza no eixo X
                                cy="50%" // Centraliza no eixo Y
                                innerRadius={60} // Faz o "furo" no meio, transformando Pie em Donut (Rosca)
                                outerRadius={80}
                                paddingAngle={5} // Espaço entre as fatias
                                dataKey="value"
                                stroke="none" // Remove a borda padrão
                            >
                                {/* Mapeia as cores dinamicamente baseado no index */}
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#334155', fontWeight: 500 }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}