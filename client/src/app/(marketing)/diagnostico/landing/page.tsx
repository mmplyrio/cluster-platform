import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit, LineChart, LayoutDashboard } from 'lucide-react';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cluster | Inovação e Tecnologia',
    description: 'Cluster | Inovação e Tecnologia',
    icons: {
        icon: '/logomarca.svg', // Opcional se você já colocou na raiz
    },
}
export default function DiagnosticoLandingPage() {
    return (
        <div className="flex flex-col min-h-[100dvh]">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full pt-40 pb-16 md:pt-48 md:pb-24 lg:pt-40 lg:pb-32 xl:pt-48 xl:pb-48 bg-black">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white max-w-3xl mx-auto">
                                    Sua empresa decide com base em números consistentes ou em leituras fragmentadas?
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl mt-6">
                                    Responda ao Diagnóstico de Maturidade de Decisão Financeira e descubra se sua gestão está apoiada em critérios sólidos ou em interpretações que podem comprometer margem, caixa e crescimento.
                                </p>
                            </div>
                            <div className="space-x-4 pt-8">
                                <Button asChild size="lg" className="h-14 px-8 text-base bg-[#f84f08] hover:bg-[#ffffff] text-white hover:text-[#13293d]">
                                    <Link href="/diagnostico">
                                        <span className="text-nowrap text-lg">Quero fazer o diagnóstico</span>
                                    </Link>
                                </Button>
                                <p className="text-sm text-gray-500 mt-4">
                                    Leva poucos minutos. Ao final, você recebe um resultado com leitura do seu perfil gerencial.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dor Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-zinc-900 border-t">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Muitas empresas faturam, vendem e até giram bem - mas ainda decidem no escuro.</h2>
                            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 mt-6">
                                Na prática, o problema nem sempre está apenas na falta de controle. Em muitos casos, a empresa até acompanha alguns números, mas interpreta mal o que eles significam. Isso gera aumento de preço sem critério, desconto sem cálculo, crescimento sem margem e pressão no caixa sem clareza da origem.
                            </p>
                        </div>
                    </div>
                </section>

                {/* O que avalia Section */}
                <section className="w-full py-12 bg-zinc-200 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-8 text-center">
                            <div className="space-y-2 max-w-3xl">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">O que este diagnóstico avalia?</h2>
                                <p className="text-gray-500 md:text-lg dark:text-gray-400">
                                    Este não é um checklist genérico sobre controle financeiro. O diagnóstico foi desenhado para identificar como o empresário interpreta cenários, decide diante de problemas e estrutura sua rotina de gestão.
                                </p>
                            </div>

                            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                                <Card className="bg-white dark:bg-zinc-950 border-0 shadow-lg">
                                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                                        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                                            <BrainCircuit className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h3 className="text-xl font-bold">Interpretação</h3>
                                        <p className="text-center text-gray-500 dark:text-gray-400">Como você lê os resultados e entende os sinais do seu negócio.</p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white dark:bg-zinc-950 border-0 shadow-lg">
                                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                                        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                                            <LineChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h3 className="text-xl font-bold">Critério de decisão</h3>
                                        <p className="text-center text-gray-500 dark:text-gray-400">Qual a base real que você usa antes de tomar uma atitude financeira.</p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white dark:bg-zinc-950 border-0 shadow-lg">
                                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                                        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                                            <LayoutDashboard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h3 className="text-xl font-bold">Rotina gerencial</h3>
                                        <p className="text-center text-gray-500 dark:text-gray-400">A disciplina e ferramentas que sustentam o acompanhamento da sua empresa.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-8 text-center max-w-3xl mx-auto">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                                    Descubra o nível de maturidade financeira da sua gestão
                                </h2>
                                <p className="text-gray-400 md:text-xl pt-4">
                                    Ao final você recebe sua pontuação final, seu perfil de maturidade, os gargalos mais prováveis e uma recomendação clara de próximo passo.
                                </p>
                            </div>
                            <Button asChild size="lg" className="h-14 px-8 text-base bg-[#f84f08] hover:bg-[#ffffff] text-white hover:text-[#13293d] mt-8">
                                <Link href="/diagnostico">
                                    <span className="text-nowrap text-lg">Quero fazer o diagnóstico</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
