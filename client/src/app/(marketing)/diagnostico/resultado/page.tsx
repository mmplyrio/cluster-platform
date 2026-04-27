import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDiagnosisResult } from '@/actions/diagnosis';
import { WhatsAppCTA } from '@/components/marketing/WhatsAppCTA';

// Mapeamentos de perfil baseados no score_total
function getProfileData(perfil: string | null) {
    switch (perfil) {
        case 'Gestão Reativa':
            return {
                descricao: 'Seu padrão atual sugere uma gestão mais apoiada em urgência, percepção e reação ao problema do que em leitura estruturada dos números. Isso normalmente dificulta previsibilidade, compromete margem e faz a empresa enxergar os efeitos antes das causas.',
                cta: 'Agendar análise para identificar os pontos mais urgentes',
                cor: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
            };
        case 'Gestão Parcial':
            return {
                descricao: 'Sua empresa já demonstra preocupação com números, mas ainda parece operar com leitura fragmentada. O risco aqui não é ausência de controle; é tomar decisões importantes com base em dados parciais ou desconectados.',
                cta: 'Agendar análise estratégica para alinhar pendências',
                cor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
            };
        case 'Gestão em Estruturação':
            return {
                descricao: 'Seu resultado indica uma base gerencial em evolução. Já existe entendimento relevante, mas ainda pode faltar consistência, profundidade ou ritmo de aplicação para que os números orientem a operação com mais precisão.',
                cta: 'Agendar análise para estruturar os próximos ajustes',
                cor: 'bg-[#13293d]/10 text-[#13293d] dark:bg-[#13293d]/40 dark:text-blue-300',
            };
        case 'Gestão Orientada por Inteligência':
            return {
                descricao: 'Seu padrão de resposta mostra maturidade acima da média na leitura financeira do negócio. Nesse estágio, o ganho tende a vir menos de controle básico e mais de refinamento: eficiência, precisão e alinhamento entre operação, margem e caixa.',
                cta: 'Agendar análise para maximizar eficiência atual',
                cor: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            };
        default:
            return {
                descricao: 'Perfil em análise.',
                cta: 'Agendar análise estratégica',
                cor: 'bg-gray-100 text-gray-800',
            };
    }
}

export default async function ResultadoPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const { id: leadId } = await searchParams;

    if (!leadId || leadId === 'mock-id') {
        // Placeholder para demonstração
        return (
            <div className="flex flex-col min-h-[100dvh] bg-gray-50 dark:bg-zinc-950">
                <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-32 lg:pt-40">
                    <div className="w-full max-w-6xl mx-auto space-y-6">
                        <ResultadoUI
                            nome="Visitante"
                            perfil="Gestão em Estruturação"
                            scoreTotal={28}
                            scoreInterpretacao={10}
                            scoreCriterio={12}
                            scoreRotina={6}
                            gargaloPrincipal="Rotina"
                        />
                    </div>
                </main>
            </div>
        );
    }

    const res = await getDiagnosisResult(leadId);

    if (!res.success || !res.data) {
        notFound();
    }

    const { data } = res;
    const scores = data.pontuacoes;

    return (
        <div className="flex flex-col min-h-[100dvh] bg-gray-50 dark:bg-zinc-950">
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-32 lg:pt-40">
                <div className="w-full max-w-6xl mx-auto">
                    <ResultadoUI
                        nome={data.nome ?? 'Lead'}
                        perfil={scores?.perfil ?? null}
                        scoreTotal={scores?.scoreTotal ?? 0}
                        scoreInterpretacao={scores?.scoreInterpretacao ?? 0}
                        scoreCriterio={scores?.scoreCriterio ?? 0}
                        scoreRotina={scores?.scoreRotina ?? 0}
                        gargaloPrincipal={scores?.gargaloPrincipal ?? null}
                    />
                </div>
            </main>
        </div>
    );
}

function ResultadoUI({
    nome,
    perfil,
    scoreTotal,
    scoreInterpretacao,
    scoreCriterio,
    scoreRotina,
    gargaloPrincipal,
}: {
    nome: string;
    perfil: string | null;
    scoreTotal: number;
    scoreInterpretacao: number;
    scoreCriterio: number;
    scoreRotina: number;
    gargaloPrincipal: string | null;
}) {
    const profileData = getProfileData(perfil);
    const scorePercent = Math.round((scoreTotal / 40) * 100);
    const nomeShort = nome ? nome.split(' ')[0] : 'Visitante';

    return (
        <>
            {/* Header do Resultado Centralizado */}
            <div className="text-center space-y-3 pb-8 lg:pb-12 border-b border-gray-200 dark:border-zinc-800 mb-8 mt-12 lg:mt-16">
                <Badge variant="outline" className="text-[#f84f08] bg-[#f84f08]/10 border-[#f84f08]/30 uppercase tracking-widest text-[10px] sm:text-xs px-4 py-1.5 font-bold shadow-sm">
                    Diagnóstico Concluído
                </Badge>
                <h1 className="text-3xl pb-2 sm:text-4xl lg:text-5xl font-extrabold px-2 text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {nomeShort}, aqui está o seu resultado
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto px-4 mt-2">
                    Analisamos as suas respostas para mapear os pontos fortes e as oportunidades ocultas na gestão financeira do seu negócio.
                </p>
            </div>

            <div className="grid grid-cols-1 pt-8 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

                {/* Coluna Principal - Esquerda */}
                <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8 min-w-0">

                    {/* Score Card Moderno com Cores da Marca */}
                    <Card className="border-0 shadow-2xl overflow-hidden rounded-3xl min-w-0 bg-[#13293d]">
                        <CardHeader>
                            <CardTitle className="text-xl sm:text-2xl flex items-center gap-3 text-white dark:text-zinc-100">
                                <span className="w-2 h-7 bg-[#f84f08] rounded-full inline-block shadow-sm"></span>
                                Sua Pontuação Final
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-b sm:border-b-0 sm:border-l border-zinc-700/50">
                                <div className="grid grid-cols-2 items-center text-left sm:text-right w-full pt-0 sm:pt-0 sm:pl-8">
                                    <p className="text-3xl text-white sm:text-4xl font-black tabular-nums tracking-tighter">
                                        {scoreTotal}<span className="text-2xl sm:text-3xl text-zinc-400 font-medium opacity-60">/40</span>
                                    </p>
                                    <div className="flex flex-col items-center pb-4">
                                        <p className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest mb-2">Estágio Atual</p>
                                        <span className={`inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-bold shadow-lg text-center ${profileData.cor} leading-tight border border-white/10`}>
                                            {perfil ?? 'Calculando...'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 sm:mt-12 pt-2 relative z-10 w-full pl-3 pr-3">
                                <div className="flex justify-between text-[10px] sm:text-xs font-bold text-zinc-400 mb-3 px-1 uppercase tracking-widest -ml-3 -mr-3">
                                    <span style={{ color: '#f87171' }}>Risco Maior</span>
                                    <span style={{ color: '#34d399' }}>Alta Eficiência</span>
                                </div>
                                <div className="w-full h-3 sm:h-4 rounded-full relative bg-white border-2 border-[#f84f08] shadow-inner">
                                    {/* Track Spectrum */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 via-[#f84f08] to-emerald-500 opacity-90"></div>

                                    {/* Pin Marker */}
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 -ml-3 sm:-ml-4 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.6)] border-[4px] sm:border-[5px] border-[#13293d] z-10 flex items-center justify-center transform hover:scale-110 transition-transform cursor-default"
                                        style={{ left: `${Math.min(Math.max(scorePercent, 2), 98)}%` }}
                                    >
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#f84f08] animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Leitura Executiva */}
                    <Card className="border border-zinc-200 dark:border-zinc-800/50 shadow-md rounded-2xl min-w-0 bg-white dark:bg-zinc-900/80">
                        <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-5">
                            <CardTitle className="text-xl sm:text-2xl flex items-center gap-3 text-zinc-800 dark:text-zinc-100">
                                <span className="w-2 h-7 bg-[#f84f08] rounded-full inline-block shadow-sm"></span>
                                Leitura do seu perfil
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg font-medium">
                                {profileData.descricao}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Análise por Eixo */}
                    <Card className="border border-zinc-200 dark:border-zinc-800/50 shadow-md rounded-2xl min-w-0 bg-white dark:bg-zinc-900/80">
                        <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-5">
                            <CardTitle className="text-xl sm:text-2xl flex items-center gap-3 text-zinc-800 dark:text-zinc-100">
                                <span className="w-2 h-7 bg-[#f84f08] rounded-full inline-block shadow-sm"></span>
                                Desempenho por Eixo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8 space-y-8">
                            {[
                                { label: 'Interpretação', fullLabel: 'Interpretação Financeira', score: scoreInterpretacao, max: 12, hint: 'Compreensão da influência dos números no dia a dia da empresa.' },
                                { label: 'Critério', fullLabel: 'Critério de Decisão', score: scoreCriterio, max: 20, hint: 'Habilidade de pautar escolhas com base em métricas e não na intuição.' },
                                { label: 'Rotina', fullLabel: 'Rotina Gerencial', score: scoreRotina, max: 8, hint: 'Disciplina na análise cadenciada e coleta dos resultados.' },
                            ].map(({ label, fullLabel, score, max, hint }) => {
                                const isGargalo = gargaloPrincipal && (label === gargaloPrincipal || fullLabel.includes(gargaloPrincipal));

                                return (
                                    <div key={label} className="space-y-3 w-full group">
                                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                                            <div className="space-y-1 sm:pr-4">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                                                        {fullLabel}
                                                    </span>
                                                    {isGargalo && (
                                                        <Badge variant="outline" className="text-[10px] sm:text-xs bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900 shadow-sm px-2 py-0.5">
                                                            Atenção Necessária
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-500 font-medium">{hint}</p>
                                            </div>
                                            <span className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tabular-nums">
                                                {score}<span className="text-base sm:text-lg font-semibold text-gray-400">/{max}</span>
                                            </span>
                                        </div>
                                        <div className="w-full bg-zinc-100 rounded-full h-3 sm:h-4 dark:bg-zinc-800 overflow-hidden shadow-inner flex">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ease-out flex-shrink-0 ${isGargalo ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-[#13293d] dark:bg-[#f84f08] shadow-[0_0_10px_rgba(248,79,8,0.3)]'}`}
                                                style={{ width: `${Math.max(5, Math.round((score / max) * 100))}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* Coluna Lateral - CTA & Gargalo */}
                <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8 lg:sticky lg:top-28 min-w-0">

                    {/* Gargalo em Destaque */}
                    {gargaloPrincipal && (
                        <Card className="border-0 shadow-lg bg-[#fff8f5] dark:bg-[#f84f08]/10 border-t-[6px] border-t-[#f84f08] rounded-2xl overflow-hidden min-w-0">
                            <CardContent className="p-6 sm:p-8 space-y-4">
                                <h3 className="font-extrabold text-[#f84f08] dark:text-[#ff9266] text-lg sm:text-xl flex items-center gap-3">
                                    <span className="text-2xl drop-shadow-sm">⚠️</span> Fragilidade
                                </h3>
                                <div className="text-zinc-800 dark:text-zinc-200 leading-relaxed text-sm sm:text-base space-y-3">
                                    <p>Identificamos que seu foco de maior sensibilidade exige melhorias em <strong className="text-[#f84f08] font-bold bg-white dark:bg-black/20 px-1.5 py-0.5 rounded uppercase tracking-wider text-xs">{gargaloPrincipal}</strong>.</p>
                                    <p>Decisões tomadas com informações incompletas impactam severamente o lucro e escondem falhas processuais.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* CTA com Cores da Marca (Deep Blue) e Destaque Visual */}
                    <Card className="border-0 shadow-2xl bg-[#13293d] text-white overflow-hidden rounded-2xl relative min-w-0">
                        {/* Highlights decorativos do fundo */}
                        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#f84f08]/20 blur-[60px] rounded-full pointer-events-none"></div>
                        <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-[#13293d] blur-[40px] rounded-full pointer-events-none"></div>

                        <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6 relative z-10 w-full h-full">

                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#f84f08] transform -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>

                            <div className="max-w-2xl mx-auto px-4">
                                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight pb-4">Seu Próximo Passo Estratégico</h2>
                                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed w-full font-medium">
                                    Este diagnóstico é apenas a ponta do iceberg e a fotografia atual do seu negócio. Agora que você sabe onde estão os gargalos, o próximo passo é saber como resolvê-los. Descubra como a metodologia da Cluster pode transformar esses dados em um plano de ação para construir uma gestão previsível, lucrativa e escalável.
                                </p>
                            </div>

                            <div className="pt-2 w-full flex-grow flex flex-col justify-center items-center">
                                {/* Componente WhatsApp que o usuário recém criou */}
                                <WhatsAppCTA
                                    nomeLead={nomeShort}
                                    telefoneMentor="73999070507"
                                />
                            </div>

                            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest mt-2 border-t border-white/10 pt-4 w-full">Vagas limitadas para análise estrutural</p>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
