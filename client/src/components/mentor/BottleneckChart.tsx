"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// 1. TIPAGEM DOS DADOS
export interface BottleneckData {
    etapa: string;
    alunosTravados: number;
}

interface BottleneckChartProps {
    title?: string;
    description?: string;
    data: BottleneckData[];
}

export function BottleneckChart({
    title = "Gargalos da Trilha",
    description = "Alunos parados há mais de 7 dias por etapa",
    data
}: BottleneckChartProps) {

    // Fallback caso não haja dados
    if (!data || data.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-slate-800">{title}</CardTitle>
                    <CardDescription className="text-xs">{description}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-slate-400 text-sm">
                    Nenhum gargalo identificado no momento.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold text-slate-800">{title}</CardTitle>
                <CardDescription className="text-xs mt-1">{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 mt-6">
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {/* layout="vertical" é o segredo para barras horizontais no Recharts */}
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />

                            {/* Eixo X agora é o valor numérico (Quantidade de alunos) */}
                            <XAxis
                                type="number"
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />

                            {/* Eixo Y agora é a categoria (Nome da Etapa) */}
                            <YAxis
                                dataKey="etapa"
                                type="category"
                                tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                                width={120} // Largura reservada para não cortar os nomes das etapas
                                tickLine={false}
                                axisLine={false}
                            />

                            {/* Tooltip customizado para manter a elegância do SaaS */}
                            <Tooltip
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                labelStyle={{ color: '#334155', fontWeight: 600, marginBottom: '4px' }}
                                itemStyle={{ color: '#f84f08', fontWeight: 500 }}
                                formatter={(value: any) => [`${value} empresas`, "Travadas"]}
                            />

                            {/* A Barra visual */}
                            <Bar
                                dataKey="alunosTravados"
                                radius={[0, 4, 4, 0]} // Arredonda apenas a ponta direita da barra
                                barSize={24}
                            >
                                {/* Lógica condicional: Destaca a maior barra (o maior gargalo) com a cor principal */}
                                {data.map((entry, index) => {
                                    // Descobre qual é o valor máximo no array para colorir diferente
                                    const maxTravados = Math.max(...data.map(d => d.alunosTravados));
                                    const isGargaloPrincipal = entry.alunosTravados === maxTravados;

                                    return (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={isGargaloPrincipal ? '#f84f08' : '#cbd5e1'}
                                            className="transition-all duration-300"
                                        />
                                    );
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}