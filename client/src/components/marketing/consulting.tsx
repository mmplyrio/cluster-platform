import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Calculator, TrendingUp, Target, Boxes, FileChartPie, ChartArea, Brain, DollarSign } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Logo } from '@/components/logo'

export default function ConsultingSection() {
    return (
        <section id="consultoria" className="bg-gray-50 py-16 md:py-32 dark:bg-transparent scroll-mt-16">
            <div className="mx-auto max-w-5xl px-6">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl font-semibold lg:text-5xl">A consultoria como instrumento, não como fim</h2>
                    <p className="mt-6 text-lg">A consultoria permanece como parte do ecossistema da Cluster, mas com um papel claro: gerar dados, validar decisões e estruturar negócios sólidos.</p>
                </div>
                <div className="relative mt-12">
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
                        <Card className="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2">
                            <CardHeader>
                                <Logo />
                            </CardHeader>
                            <CardContent>
                                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                    <p className="text-xl font-medium">Realizamos uma análise estrutural da situação econômico-financeira do negócio. O diagnóstico vai além da fotografia do momento: identificamos gargalos operacionais, riscos financeiros, ineficiências de alocação de recursos e pontos de alavancagem que impactam diretamente a sustentabilidade e o crescimento do negócio. Essa etapa fundamenta todas as decisões posteriores, reduzindo incertezas e evitando intervenções baseadas apenas em percepção.</p>

                                    <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                        <Avatar className="size-12">

                                            <AvatarFallback><FileChartPie /></AvatarFallback>

                                        </Avatar>

                                        <div>
                                            <cite className="text-sm font-medium">Diagnóstico financeiro</cite>
                                            <span className="text-muted-foreground block text-sm">Análise econômico-financeira, Estrutura de custos, Análise de desempenho</span>
                                        </div>
                                    </div>
                                </blockquote>
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-2">
                            <CardContent className="h-full pt-6">
                                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                    <p className="text-xl font-medium">A precificação é tratada como instrumento estratégico, não apenas operacional, sendo continuamente ajustada conforme dados, comportamento do mercado e estágio de maturidade do produto.</p>

                                    <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                        <Avatar className="size-12">

                                            <AvatarFallback><DollarSign /></AvatarFallback>

                                        </Avatar>
                                        <div>
                                            <cite className="text-sm font-medium">Precificação</cite>
                                            <span className="text-muted-foreground block text-sm">Formação de preços, Custos diretos e indiretos, Margens</span>
                                        </div>
                                    </div>
                                </blockquote>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="h-full pt-6">
                                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                    <p>Desenvolvemos o planejamento estratégico a partir de uma leitura integrada do ambiente interno e externo, conectando diagnóstico financeiro, contexto de mercado e objetivos de longo prazo.</p>

                                    <div className="grid items-center gap-3 [grid-template-columns:auto_1fr]">
                                        <Avatar className="size-12">
                                            <AvatarFallback><Brain /></AvatarFallback>

                                        </Avatar>
                                        <div>
                                            <cite className="text-sm font-medium">Planejamento</cite>
                                            <span className="text-muted-foreground block text-sm">Gestão por objetivos</span>
                                        </div>
                                    </div>
                                </blockquote>
                            </CardContent>
                        </Card>
                        <Card className="card variant-mixed">
                            <CardContent className="h-full pt-6">
                                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                    <p>Atuamos no desenho, validação e refinamento de modelos de negócio economicamente viáveis e escaláveis.</p>

                                    <div className="grid grid-cols-[auto_1fr] gap-3">
                                        <Avatar className="size-12">
                                            <AvatarFallback><ChartArea /></AvatarFallback>

                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">Estruturação</p>
                                            <span className="text-muted-foreground block text-sm">Viabilidade e Escalabilidade  </span>
                                        </div>
                                    </div>
                                </blockquote>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}