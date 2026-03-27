import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getLeadDetails } from '@/actions/admin';

// Mapeamentos de perfil baseados no score_total
function getProfileData(perfil: string | null) {
    switch (perfil) {
        case 'Gestão Reativa':
            return {
                descricao: 'Seu padrão atual sugere uma gestão mais apoiada em urgência, percepção e reação ao problema do que em leitura estruturada dos números. Isso normalmente dificulta previsibilidade, compromete margem e faz a empresa enxergar os efeitos antes das causas.',
                cta: 'Agendar análise para identificar os pontos mais urgentes da sua gestão financeira',
                cor: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
            };
        case 'Gestão Parcial':
            return {
                descricao: 'Sua empresa já demonstra preocupação com números, mas ainda parece operar com leitura fragmentada. O risco aqui não é ausência de controle; é tomar decisões importantes com base em dados parciais ou desconectados.',
                cta: 'Agendar análise estratégica e ver onde sua gestão está perdendo consistência',
                cor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
            };
        case 'Gestão em Estruturação':
            return {
                descricao: 'Seu resultado indica uma base gerencial em evolução. Já existe entendimento relevante, mas ainda pode faltar consistência, profundidade ou ritmo de aplicação para que os números orientem a operação com mais precisão.',
                cta: 'Agendar análise para estruturar os próximos ajustes da sua gestão',
                cor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            };
        case 'Gestão Orientada por Inteligência':
            return {
                descricao: 'Seu padrão de resposta mostra maturidade acima da média na leitura financeira do negócio. Nesse estágio, o ganho tende a vir menos de controle básico e mais de refinamento: eficiência, precisão e alinhamento entre operação, margem, caixa e crescimento.',
                cta: 'Agendar análise avançada para refinar sua operação financeira e ampliar eficiência',
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
        // Placeholder para demonstração antes do fluxo real estar conectado
        return (
            <div className="flex flex-col min-h-[100dvh] bg-gray-50 dark:bg-zinc-950">
                <main className="flex-1 flex items-start justify-center p-4 md:p-8 pt-16">
                    <div className="w-full max-w-3xl space-y-6">
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

    const res = await getLeadDetails(leadId);

    if (!res.success || !res.data) {
        notFound();
    }

    const { data } = res;
    const scores = data.pontuacoes;

    return (
        <div className="flex flex-col min-h-[100dvh] bg-gray-50 dark:bg-zinc-950">
            <main className="flex-1 flex items-start justify-center p-4 md:p-8 pt-16">
                <div className="w-full max-w-3xl space-y-6">
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

    return (
        <>
            {/* Header do Resultado */}
            <div className="text-center space-y-2 pb-4">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Diagnóstico de Maturidade de Decisão Financeira
                </p>
                <h1 className="text-3xl md:text-4xl font-bold">
                    {nome ? `${nome.split(' ')[0]}, aqui está o seu resultado` : 'Seu Resultado'}
                </h1>
            </div>

            {/* Score Card */}
            <Card className="border-0 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-zinc-900 to-blue-900 p-8 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left space-y-1">
                            <p className="text-blue-300 text-sm font-medium uppercase tracking-wider">Pontuação Final</p>
                            <p className="text-6xl font-bold">{scoreTotal}<span className="text-2xl text-blue-300">/40</span></p>
                        </div>
                        <div className="text-center md:text-right space-y-2">
                            <p className="text-blue-300 text-sm uppercase tracking-wider">Perfil Identificado</p>
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${profileData.cor}`}>
                                {perfil ?? 'Calculando...'}
                            </span>
                        </div>
                    </div>
                    {/* Barra de Progresso */}
                    <div className="mt-6">
                        <div className="w-full bg-blue-950 rounded-full h-3">
                            <div
                                className="bg-blue-400 h-3 rounded-full transition-all"
                                style={{ width: `${scorePercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Leitura Executiva */}
            <Card className="border-0 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Leitura do seu perfil</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                        {profileData.descricao}
                    </p>
                </CardContent>
            </Card>

            {/* Análise por Eixo */}
            <Card className="border-0 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Análise por eixo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { label: 'Interpretação', score: scoreInterpretacao, max: 12 },
                        { label: 'Critério de Decisão', score: scoreCriterio, max: 20 },
                        { label: 'Rotina Gerencial', score: scoreRotina, max: 8 },
                    ].map(({ label, score, max }) => (
                        <div key={label} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    {label}
                                    {gargaloPrincipal === label && (
                                        <Badge variant="destructive" className="ml-2 text-xs">Ponto de atenção</Badge>
                                    )}
                                </span>
                                <span className="text-sm text-gray-500">{score}/{max}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 dark:bg-zinc-800">
                                <div
                                    className={`h-2 rounded-full ${gargaloPrincipal === label ? 'bg-red-500' : 'bg-blue-600'}`}
                                    style={{ width: `${Math.round((score / max) * 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Gargalo */}
            {gargaloPrincipal && (
                <Card className="border-0 shadow-md bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-400">
                    <CardContent className="p-6">
                        <p className="text-gray-700 dark:text-amber-200 leading-relaxed">
                            <span className="font-semibold">Seu principal ponto de atenção está em {gargaloPrincipal}.</span>{' '}
                            Isso sugere que parte das decisões pode estar sendo tomada com leitura incompleta ou sem rotina suficiente de acompanhamento.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* CTA Principal */}
            <Card className="border-0 shadow-lg bg-zinc-900 text-white">
                <CardContent className="p-8 text-center space-y-4">
                    <h2 className="text-2xl font-bold">Próximo passo</h2>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Quer transformar esse diagnóstico em ação? Reserve um horário para uma análise estratégica.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="h-14 px-10 mt-4 text-base bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    >
                        {/* Substitua o href pelo seu link do Calendly */}
                        <Link href="#agendar">
                            {profileData.cta}
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </>
    );
}
