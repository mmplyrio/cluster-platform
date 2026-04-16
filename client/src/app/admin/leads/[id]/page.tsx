import { getLeadDetails } from '@/actions/admin';
import { notFound } from 'next/navigation';
import {
    User,
    Building2,
    Mail,
    Phone,
    BarChart3,
    Activity,
    AlertTriangle,
    FileText,
    Clock,
    Target,
    BrainCircuit,
    Settings,
    ChevronDown
} from 'lucide-react';

import { ConvertLeadButton } from '@/components/admin/ConvertLeadButton';

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cluster | Inovação e Tecnologia',
    description: 'Cluster | Inovação e Tecnologia',
    icons: {
        icon: '/logomarca.svg', // Opcional se você já colocou na raiz
    },
}

export default async function LeadDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await getLeadDetails(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const {
        nome,
        empresa,
        email,
        whatsapp,
        createdAt,
        origem,
        interesseAnalise,
        faturamentoFaixa,
        colaboradoresFaixa,
        pontuacoes,
        respostas,
    } = result.data;

    // Garantir que não quebre caso ainda não haja diagnóstico
    if (!pontuacoes) {
        return (
            <div className="max-w-5xl mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Prontuário do Lead
                </h1>
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <p>Este lead ainda não concluiu o diagnóstico de maturidade financeira.</p>
                </div>
            </div>
        );
    }

    const {
        scoreTotal,
        scoreInterpretacao,
        scoreCriterio,
        scoreRotina,
        perfil,
        gargaloPrincipal,
    } = pontuacoes;

    // Calculando o eixo com menor pontuação (gargalo) para destacar visualmente
    const scoresArray = [
        { label: 'Interpretação', key: 'interpretacao', score: scoreInterpretacao, icon: BrainCircuit, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
        { label: 'Critério de Decisão', key: 'criterio', score: scoreCriterio, icon: Target, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
        { label: 'Rotina Gerencial', key: 'rotina', score: scoreRotina, icon: Settings, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
    ];

    // Identificar o menor (o destaque negativo)
    const lowestScore = Math.min(...scoresArray.map(s => s.score ?? 0));

    // Um helper para formatar a data
    const formattedDate = createdAt ? new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(createdAt)) : '--';

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* 1. Header do Prontuário */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-slate-900">
                    <Activity className="w-48 h-48" />
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Prontuário Financeiro</p>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{nome}</h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 md:gap-8">
                            <div className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                                <Building2 className="w-4 h-4 text-indigo-500" />
                                <span className="font-medium">{empresa || 'Empresa não informada'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                                <Mail className="w-4 h-4 text-indigo-500" />
                                <a href={`mailto:${email}`} className="font-medium hover:underline">{email}</a>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                                <Phone className="w-4 h-4 text-indigo-500" />
                                <a href={`https://wa.me/${whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="font-medium hover:underline">{whatsapp}</a>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-sm text-slate-500 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Cadastrado em {formattedDate}</span>
                        </div>
                        {origem && (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                <span>Origem: {origem}</span>
                            </div>
                        )}
                        {interesseAnalise && (
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-rose-400" />
                                <span>Interesse: {interesseAnalise}</span>
                            </div>
                        )}
                        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end w-full">
                            <ConvertLeadButton leadId={id} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Bloco de Resultados Consolidados */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Total */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
                    <h3 className="text-indigo-200 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4" />
                        Pontuação Final
                    </h3>
                    <div className="flex items-end gap-3">
                        <span className="text-6xl font-black tracking-tighter">{scoreTotal}</span>
                        <span className="text-indigo-300 font-medium mb-2 opacity-80">/ 100</span>
                    </div>
                </div>

                {/* Perfil Diagnosticado */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
                    <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Perfil</h3>
                    <p className="text-2xl font-bold text-slate-800 leading-tight">
                        {perfil || 'Não Definido'}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 w-max px-3 py-1 bg-indigo-50 text-indigo-700 font-medium text-xs rounded-full">
                        Análise Concluída
                    </div>
                </div>

                {/* Gargalo Principal */}
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">
                        <AlertTriangle className="w-24 h-24 text-rose-500" />
                    </div>
                    <h3 className="text-rose-600/80 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Gargalo Principal
                    </h3>
                    <p className="text-2xl font-bold text-rose-900 leading-tight z-10">
                        {gargaloPrincipal || 'Nenhum identificado'}
                    </p>
                </div>
            </section>

            {/* 3. Análise por Eixos */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    Análise por Eixos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {scoresArray.map((eixo) => {
                        const isGargalo = eixo.score === lowestScore;
                        const Icon = eixo.icon;

                        return (
                            <div
                                key={eixo.key}
                                className={`relative rounded-2xl p-6 border transition-all ${isGargalo ? 'ring-2 ring-rose-400 border-rose-200 bg-white shadow-md cursor-help' : 'border-slate-200 bg-white shadow-sm'}`}
                                title={isGargalo ? 'Eixo de Menor Pontuação (Gargalo)' : ''}
                            >
                                {isGargalo && (
                                    <div className="absolute -top-3 -right-3 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" /> ATENÇÃO
                                    </div>
                                )}

                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isGargalo ? 'bg-rose-100 text-rose-600' : `${eixo.bg} ${eixo.color}`}`}>
                                    <Icon className="w-6 h-6" />
                                </div>

                                <h4 className="text-slate-600 font-medium text-sm mb-1">{eixo.label}</h4>
                                <div className="flex items-end gap-2">
                                    <span className={`text-3xl font-bold ${isGargalo ? 'text-rose-600' : 'text-slate-800'}`}>{eixo.score}</span>
                                    <span className="text-slate-400 font-medium pb-1 opacity-70">pts</span>
                                </div>

                                {/* Visual indicator bar */}
                                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${isGargalo ? 'bg-rose-500' : 'bg-slate-300'}`}
                                        style={{ width: `${Math.min(100, Math.max(0, ((eixo.score ?? 0) / 4) * 100))}%` }}
                                    /* Ajustar o fator multiplicador do width com base na escala máxima pontuação por eixo, se 4 for max use /4.. Se for proporção de 100, deixar score direto */
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 4. Respostas Brutas (Acordeão Nativo Clean) */}
            {respostas && (
                <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <details className="group">
                        <summary className="flex items-center justify-between p-6 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors list-none [&::-webkit-details-marker]:hidden">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Prontuário Detalhado</h2>
                                    <p className="text-sm text-slate-500">Respostas brutas do diagnóstico (Q1 - Q10)</p>
                                </div>
                            </div>
                            <ChevronDown className="w-5 h-5 text-slate-400 group-open:-rotate-180 transition-transform duration-300" />
                        </summary>

                        <div className="p-6 border-t border-slate-100 bg-white grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {[
                                { label: 'Q1 (Rotina Financeira)', val: respostas.q1 },
                                { label: 'Q2 (Decisão sobre Preços)', val: respostas.q2 },
                                { label: 'Q3 (Análise de Custos)', val: respostas.q3 },
                                { label: 'Q4 (Separação de PF e PJ)', val: respostas.q4 },
                                { label: 'Q5 (Planejamento Futuro)', val: respostas.q5 },
                                { label: 'Q6 (Uso de Ferramentas)', val: respostas.q6 },
                                { label: 'Q7 (Visão de Lucro)', val: respostas.q7 },
                                { label: 'Q8 (Controle de Inadimplência)', val: respostas.q8 },
                                { label: 'Q9 (Capital de Giro)', val: respostas.q9 },
                                { label: 'Q10 (Indicadores)', val: respostas.q10 },
                            ].map((q, i) => (
                                <div key={i} className="flex flex-col space-y-1">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{q.label}</span>
                                    <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl min-h-[44px] flex items-center">
                                        <span className="font-medium text-slate-700 text-sm">
                                            {q.val ? `Alternativa selecionada: ${q.val}` : 'Não respondida'}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {respostas.submittedAt && (
                                <div className="md:col-span-2 pt-4 border-t border-slate-100 text-sm text-slate-500 flex items-center justify-end gap-2">
                                    <Clock className="w-4 h-4" />
                                    Diagnóstico concluído em: {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(respostas.submittedAt))}
                                </div>
                            )}
                        </div>
                    </details>
                </section>
            )}

            {/* 5. Informações Complementares Pessoais */}
            <section className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Metadados e Classificação</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <span className="block text-xs text-slate-500 mb-1">Faixa de Faturamento</span>
                        <span className="font-medium text-slate-800">{faturamentoFaixa || '-'}</span>
                    </div>
                    <div>
                        <span className="block text-xs text-slate-500 mb-1">Colaboradores</span>
                        <span className="font-medium text-slate-800">{colaboradoresFaixa || '-'}</span>
                    </div>
                    <div>
                        <span className="block text-xs text-slate-500 mb-1">ID do Lead</span>
                        <span className="font-mono text-xs text-slate-400">{id}</span>
                    </div>
                </div>
            </section>

        </div>
    );
}
