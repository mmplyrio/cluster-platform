import { Cpu, Zap } from 'lucide-react'
import Image from 'next/image'

export default function VentureSection() {
    return (
        <section id="ventures" className="py-8 md:py-16 scroll-mt-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">A <span className="font-bold text-[#13293d]">Precif</span><span className="font-bold text-[#f84f08]">C</span> é o marco da nossa transformação</h2>
                <div className="grid items-center gap-12 md:grid-cols-2">
                    <div className="relative z-10 space-y-2">
                        <p className="italic">
                            Precific é um SaaS de precificação para pequenas e médias empresas.
                        </p>
                        <p>Ajudamos empresas a formar preços de maneira estruturada, considerando custos, margens e sustentabilidade financeira.</p>

                        <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Zap className="size-4" />
                                    <h3 className="text-sm font-medium">Dinâmico</h3>
                                </div>
                                <p className="text-muted-foreground text-sm">Economiza horas de cálculos manuais e auxilia no crescimento e inovação.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Cpu className="size-4" />
                                    <h3 className="text-sm font-medium">Preciso</h3>
                                </div>
                                <p className="text-muted-foreground text-sm">Visão clara e integrada de todos os custos, despesas e margens.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative mt-12 h-fit w-full md:mt-0">
                        <div className="border-border/50 relative rounded-2xl border border-dotted p-2">
                            <Image
                                src="/tela3.png"
                                className="rounded-[12px] w-full object-cover"
                                alt="payments illustration dark"
                                width={1207}
                                height={929}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}