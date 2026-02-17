import { Activity, DraftingCompass, Mail, Zap, DatabaseZap, PackageSearch } from 'lucide-react'
import Image from 'next/image'

export default function TurnSection() {
    return (
        <section id="cluster" className="py-8 md:py-16 scroll-mt-16">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
                    <div className="lg:col-span-2">
                        <div className="md:pr-6 lg:pr-0">
                            <h2 className="text-4xl font-semibold lg:text-5xl">Da consultoria tradicional à construção de negócios.</h2>
                            <p className="mt-6">A Cluster nasceu como uma consultoria empresarial focada em finanças e estratégia.
                                Com o tempo, percebemos que orientar não era suficiente. Negócios precisam de:</p>
                        </div>
                        <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
                            <li>
                                <DatabaseZap className="size-5" />
                                Dados confiáveis
                            </li>
                            <li>
                                <Zap className="size-5" />
                                Decisões estruturadas
                            </li>
                            <li>
                                <PackageSearch className="size-5" />
                                Produtos bem construídos
                            </li>
                            <li>
                                <DraftingCompass className="size-5" />
                                Execução consistente
                            </li>
                        </ul>
                    </div>
                    <div className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3">
                        <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                            <Image src="/consultoria.png" className="hidden rounded-[15px] dark:block" alt="payments illustration dark" width={1207} height={929} />
                            <Image src="/consultoria.png" className="rounded-[15px] shadow dark:hidden" alt="payments illustration light" width={1207} height={929} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

