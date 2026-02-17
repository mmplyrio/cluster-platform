'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChartBarIncreasingIcon, Database, Fingerprint, IdCard, ShieldCheck, PackageSearch, FileChartPie } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function MethodologySection() {
    type ImageKey = 'item-1' | 'item-2' | 'item-3' | 'item-4'
    const [activeItem, setActiveItem] = useState<ImageKey>('item-1')

    const images = {
        'item-1': {
            image: '/dados.png',
            alt: 'Database visualization',
        },
        'item-2': {
            image: '/validacao.png',
            alt: 'Briefing',
        },
        'item-3': {
            image: '/const-prod.png',
            alt: 'market',
        },
        'item-4': {
            image: '/governanca.png',
            alt: 'governance',
        },
    }

    return (
        <section id="metodos" className="py-8 md:py-16 lg:py-24 scroll-mt-16">
            <div className="bg-linear-to-b absolute inset-0 -z-10 sm:inset-6 sm:rounded-b-3xl dark:block dark:to-[color-mix(in_oklab,var(--color-zinc-900)_75%,var(--color-background))]"></div>
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
                <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-6xl">Um método estruturado para construir negócios sustentáveis e escaláveis</h2>
                    <p>Da análise do problema à escala do produto, aplicamos dados, finanças, estratégia e execução em um processo contínuo de validação e crescimento.</p>
                </div>

                <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
                    <Accordion
                        type="single"
                        value={activeItem}
                        onValueChange={(value) => setActiveItem(value as ImageKey)}
                        className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <Database className="size-4" />
                                    Diagnóstico orientado por dados
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Entendemos o problema real, o mercado e os números antes de qualquer decisão.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <ShieldCheck className="size-4" />
                                    Validação de hipótese e mercado
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Testamos premissas, ajustamos propostas de valor e evitamos apostas cegas.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <PackageSearch className="size-4" />
                                    Construção do produto
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Desenvolvemos soluções enxutas, funcionais e financeiramente sustentáveis.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <FileChartPie className="size-4" />
                                    Escala e governança
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Crescimento com controle financeiro, métricas claras e visão de longo prazo.</AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="bg-background relative flex overflow-hidden rounded-3xl border p-2">
                        <div className="w-15 absolute inset-0 right-0 ml-auto border-l bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]"></div>
                        <div className="aspect-76/59 bg-background relative w-[calc(3/4*100%+3rem)] rounded-2xl">
                            <div
                                className="size-full overflow-hidden rounded-2xl border bg-zinc-900 shadow-md">
                                <Image
                                    src={images[activeItem].image}
                                    className="size-full object-cover object-left-top dark:mix-blend-lighten"
                                    alt={images[activeItem].alt}
                                    width={1207}
                                    height={929}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}