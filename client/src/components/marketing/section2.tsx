import { Cpu, Lock, Sparkles, Zap, DollarSign, HandCoins, Brain, } from 'lucide-react'

export default function AboutUsSection() {
    return (
        <section id="sobre-nos" className="py-8 md:py-16 scroll-mt-16">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <div className="mx-auto max-w-xl space-y-2 text-center md:space-y-6">
                    <h2 className="text-balance text-4xl font-medium lg:text-5xl">Somos uma <span className="text-[#f84f08] font-bold">Venture Builder</span> orientada por dados.</h2>
                    <p className="text-lg">Criamos negócios próprios e participamos ativamente da construção de soluções escaláveis.</p>
                </div>
                <img className="rounded-(--radius)" src="https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="team image" height="" width="" loading="lazy" />

                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <DollarSign className="size-4" />
                            <h3 className="text-sm font-medium">Economia Aplicada</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Decisões baseadas em dados reais, não em achismos.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <HandCoins className="size-4" />
                            <h3 className="text-sm font-medium">Gestão Financeira</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Sustentabilidade, margem e controle desde o início..</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Brain className="size-4" />
                            <h3 className="text-sm font-medium">Estratégia de Mercado</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Posicionamento, validação e tração com método.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4" />

                            <h3 className="text-sm font-medium">Tecnologia</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Produtos funcionais, escaláveis e orientados ao usuário.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}