import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'


export default function HeroSection() {
    return (
        <>
            <main className="overflow-x-hidden">
                <section id="hero">
                    <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
                        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 lg:flex-row lg:justify-between lg:gap-12">
                            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                                <h1 className="mt-8 max-w-2xl text-balance text-3xl font-medium md:text-4xl lg:mt-0 xl:text-5xl">Construímos negócios orientados por dados, não apenas estratégias.</h1>
                                <p className="mt-8 max-w-2xl text-pretty text-lg">A Cluster é uma Venture Builder que cria, valida e escala startups e produtos próprios a partir de finanças, estratégia e execução real.</p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="px-5 text-base bg-[#f84f08] hover:bg-[#f84f08]/80">
                                        <Link href="#ventures">
                                            <span className="text-nowrap text-white">Conheça nossas ventures</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="px-5 text-base">
                                        <Link href="#metodos">
                                            <span className="text-nowrap">Entenda nosso modelo</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-12 w-full lg:mt-0 lg:w-1/2">
                                <Image
                                    className="mx-auto h-auto w-full max-w-md object-contain lg:max-w-full dark:mix-blend-lighten dark:invert-0"
                                    src="/ideia.svg"
                                    alt="Abstract Object"
                                    height={4000}
                                    width={3000}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}