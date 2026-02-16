import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CallToAction() {
    return (
        <section id="cta" className="py-4 md:py-8 scroll-mt-16">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Construímos negócios com dados, método e consistência</h2>
                    <p className="mt-4">Se você está diante de um desafio real — seja a criação de um produto, a validação de uma ideia ou a estruturação de um negócio escalável — a <span className="font-semibold">Cluster</span> pode te ajudar.</p>

                    <div className="mt-12 flex flex-wrap justify-center gap-4">
                        <Button
                            asChild
                            size="lg"
                            className='bg-[#f84f08] text-primary-foreground hover:bg-[#13293d]'>
                            <Link href="https://wa.me/5573999070507?text=Ol%C3%A1%21%20Conheci%20a%20Cluster%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto%20ou%20oportunidade.%20Podemos%20falar%3F">
                                <span>Fale com um especialista</span>
                            </Link>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            variant="outline">
                            <Link href="#cluster">
                                <span>Saiba mais</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}