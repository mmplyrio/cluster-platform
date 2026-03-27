"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { submitDiagnosis } from "@/actions/diagnosis";


// 10 Perguntas do Diagnóstico (As pontuações ficam fixas no Frontend, mas ocultas do UI)
const questions = [
    {
        id: "q1",
        dimension: "Interpretação",
        text: "Produto por R$100; CMV 35; impostos 10; taxa 5. O que se conclui com mais segurança?",
        options: [
            { id: "A", text: "lucro de R$50", score: 2 },
            { id: "B", text: "margem para pagar estrutura e formar resultado", score: 4 },
            { id: "C", text: "50% de lucro líquido", score: 1 },
            { id: "D", text: "nada relevante", score: 2 },
        ],
    },
    {
        id: "q2",
        dimension: "Critério",
        text: "Caixa apertado. Qual o melhor critério para decidir aumento de preço?",
        options: [
            { id: "A", text: "concorrente subiu", score: 2 },
            { id: "B", text: "caixa está baixo", score: 1 },
            { id: "C", text: "avaliar custos, margem, sensibilidade e volume", score: 4 },
            { id: "D", text: "subir nos mais vendidos", score: 2 },
        ],
    },
    {
        id: "q3",
        dimension: "Interpretação",
        text: "Qual indicador isolado é menos confiável para concluir que a empresa vai bem?",
        options: [
            { id: "A", text: "faturamento", score: 4 },
            { id: "B", text: "margem de contribuição", score: 2 },
            { id: "C", text: "resultado operacional", score: 1 },
            { id: "D", text: "geração de caixa", score: 2 },
        ],
    },
    {
        id: "q4",
        dimension: "Critério",
        text: "Produto vende muito, mas quase não sobra dinheiro. Leitura mais madura?",
        options: [
            { id: "A", text: "volume compensa", score: 2 },
            { id: "B", text: "rever preço, custo, combo, processo ou papel estratégico", score: 4 },
            { id: "C", text: "investir mais nele", score: 1 },
            { id: "D", text: "importante é vender", score: 1 },
        ],
    },
    {
        id: "q5",
        dimension: "Critério",
        text: "Como avaliar se um desconto 'cabe'?",
        options: [
            { id: "A", text: "cliente pressionou", score: 1 },
            { id: "B", text: "concorrente cobra menos", score: 2 },
            { id: "C", text: "calcular impacto na margem de contribuição", score: 4 },
            { id: "D", text: "dar se a venda parecer importante", score: 1 },
        ],
    },
    {
        id: "q6",
        dimension: "Interpretação",
        text: "Vendeu bem, mas terminou pressionada no caixa. Hipótese principal?",
        options: [
            { id: "A", text: "problema só nas vendas", score: 2 },
            { id: "B", text: "vender, gerar margem, receber e manter caixa são coisas diferentes", score: 4 },
            { id: "C", text: "precisa só vender mais", score: 1 },
            { id: "D", text: "caixa e lucro são a mesma coisa", score: 1 },
        ],
    },
    {
        id: "q7",
        dimension: "Rotina",
        text: "Frequência mínima para consolidar e analisar números?",
        options: [
            { id: "A", text: "só quando há problema", score: 2 },
            { id: "B", text: "pelo menos mensalmente, com leitura recorrente", score: 4 },
            { id: "C", text: "semestral", score: 1 },
            { id: "D", text: "quando o contador entregar", score: 1 },
        ],
    },
    {
        id: "q8",
        dimension: "Critério",
        text: "Base de maior confiança antes de decidir?",
        options: [
            { id: "A", text: "sensação de mercado", score: 2 },
            { id: "B", text: "saldo em conta", score: 2 },
            { id: "C", text: "indicadores + operação + contexto", score: 4 },
            { id: "D", text: "opinião comercial", score: 1 },
        ],
    },
    {
        id: "q9",
        dimension: "Rotina",
        text: "Qual visão mostra maior maturidade sobre a função financeira?",
        options: [
            { id: "A", text: "contador já cuida", score: 1 },
            { id: "B", text: "serve para obrigação e pagar contas", score: 2 },
            { id: "C", text: "transformar números em leitura de decisão", score: 4 },
            { id: "D", text: "basta extrato", score: 1 },
        ],
    },
    {
        id: "q10",
        dimension: "Critério",
        text: "Cenário mais perigoso para crescer com segurança?",
        options: [
            { id: "A", text: "vender muito sem entender margem, estrutura e caixa", score: 4 },
            { id: "B", text: "poucos clientes novos no mês", score: 2 },
            { id: "C", text: "não acompanhar redes da concorrência", score: 1 },
            { id: "D", text: "manter preço parecido com o mercado", score: 2 },
        ],
    },
];

export default function DiagnosticoFormPage() {
    const router = useRouter();
    // step: 0 = Hero, 1 = Identificação, 2-11 = Perguntas, 12 = Loading/Processando
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data states
    const [lead, setLead] = useState({
        nome: "",
        empresa: "",
        segmento: "",
        faturamentoFaixa: "",
        colaboradoresFaixa: "",
        email: "",
        whatsapp: "",
        interesseAnalise: "",
    });

    // key = pergunta.id (q1, q2... q10), value = A, B, C ou D
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const totalSteps = 12; // 0, 1, 2-11, 12

    const handleNext = () => setStep((p) => p + 1);
    const handlePrev = () => setStep((p) => p - 1);

    const handleAnswerQuestion = (questionId: string, optionId: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
        // Avançar para a próxima tela automaticamente se for uma pergunta e não a última
        if (step > 1 && step < 11) {
            setTimeout(() => {
                handleNext();
            }, 300);
        } else if (step === 11) {
            setStep(12); // Pula pro processing
            submitDiagnostics();
        }
    };

    const submitDiagnostics = async () => {
        setIsSubmitting(true);
        try {
            const result = await submitDiagnosis({ lead, answers });

            if (!result.success || !result.data) {
                throw new Error(result.error ?? 'Erro desconhecido');
            }

            // Redireciona para a página de resultado com o ID real do lead
            router.push(`/diagnostico/resultado?id=${result.data.leadId}`);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            setStep(11);
            alert("Houve um erro ao processar o diagnóstico. Tente novamente.");
        }
    };

    return (
        <div className="flex flex-col min-h-[100dvh] bg-gray-50 dark:bg-zinc-950">
            {/* Header com barra de progresso (exceto na tela Hero e tela Final) */}
            {step > 0 && step < 12 && (
                <header className="fixed top-0 w-full z-10 bg-white dark:bg-zinc-900 border-b p-4 shadow-sm">
                    <div className="max-w-3xl mx-auto flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">
                            {step === 1 ? "Identificação" : `Etapa ${step - 1} de 10`}
                        </span>
                        <div className="w-1/2 bg-gray-200 rounded-full h-2 dark:bg-zinc-800">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${Math.max(0, ((step - 1) / 10) * 100)}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                </header>
            )}

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-3xl pt-16">
                    {/* Tela 0: Hero Introdutório */}
                    {step === 0 && (
                        <div className="space-y-6 text-center shadow-lg border-0 p-8 md:p-12 min-h-[60vh] flex flex-col items-center justify-center bg-white rounded-xl dark:bg-zinc-900">
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                                Antes de começar, entenda o que este diagnóstico mede:
                            </h1>
                            <p className="text-gray-500 md:text-xl max-w-2xl mx-auto pt-4">
                                Você responderá a 10 situações curtas sobre leitura financeira, critério de decisão e rotina gerencial. O objetivo não é testar teoria, mas identificar como sua empresa pensa, interpreta e decide.
                            </p>
                            <p className="text-sm text-gray-400">
                                Não existe exposição pública das respostas. O resultado serve para gerar uma leitura individual da sua maturidade de decisão financeira.
                            </p>
                            <Button onClick={handleNext} size="lg" className="h-14 px-8 mt-4 w-full md:w-auto bg-[#13293d] hover:bg-[#f84f08]">
                                <span className="text-lg text-white font-bold">Começar o diagnóstico</span>
                            </Button>
                        </div>
                    )}

                    {/* Tela 1: Identificação */}
                    {step === 1 && (
                        <Card className="shadow-lg border-0 min-h-[60vh]">
                            <CardContent className="p-6 md:p-10 space-y-6">
                                <h2 className="text-2xl font-bold">Conte-nos sobre você para iniciar</h2>
                                <div className="grid gap-6 md:grid-cols-2 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nome">Nome completo *</Label>
                                        <Input
                                            id="nome"
                                            placeholder="Digite seu nome"
                                            value={lead.nome}
                                            onChange={(e) => setLead({ ...lead, nome: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="empresa">Empresa *</Label>
                                        <Input
                                            id="empresa"
                                            placeholder="Nome da empresa"
                                            value={lead.empresa}
                                            onChange={(e) => setLead({ ...lead, empresa: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">E-mail corporativo *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="seu@email.com"
                                            value={lead.email}
                                            onChange={(e) => setLead({ ...lead, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp">WhatsApp *</Label>
                                        <Input
                                            id="whatsapp"
                                            placeholder="(11) 99999-9999"
                                            value={lead.whatsapp}
                                            onChange={(e) => setLead({ ...lead, whatsapp: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="faturamento">Faturamento Mensal *</Label>
                                        <Select
                                            value={lead.faturamentoFaixa}
                                            onValueChange={(val: string) => setLead({ ...lead, faturamentoFaixa: val })}
                                        >
                                            <SelectTrigger id="faturamento">
                                                <SelectValue placeholder="Selecione a faixa" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ate-50k">Até R$ 50.000</SelectItem>
                                                <SelectItem value="50k-100k">De R$ 50k a R$ 100k</SelectItem>
                                                <SelectItem value="100k-500k">De R$ 100k a R$ 500k</SelectItem>
                                                <SelectItem value="500k-1m">De R$ 500k a R$ 1M</SelectItem>
                                                <SelectItem value="mais-1m">Mais de R$ 1M</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="interesse">Interesse em análise estratégica *</Label>
                                        <Select
                                            value={lead.interesseAnalise}
                                            onValueChange={(val: string) => setLead({ ...lead, interesseAnalise: val })}
                                        >
                                            <SelectTrigger id="interesse">
                                                <SelectValue placeholder="Selecione o nível de interesse" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sim">Sim, quero agendar em breve</SelectItem>
                                                <SelectItem value="talvez">Talvez mais pra frente</SelectItem>
                                                <SelectItem value="nao">Não no momento</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                </div>
                                <div className="flex justify-end pt-8">
                                    <Button
                                        onClick={handleNext}
                                        disabled={
                                            !lead.nome ||
                                            !lead.empresa ||
                                            !lead.email ||
                                            !lead.whatsapp ||
                                            !lead.faturamentoFaixa ||
                                            !lead.interesseAnalise
                                        }
                                        className="w-full md:w-auto px-8 bg-blue-600 hover:bg-blue-700"
                                    >
                                        Próxima etapa
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Telas 2-11: Perguntas */}
                    {step > 1 && step < 12 && (
                        <Card className="shadow-lg border-0 min-h-[60vh] flex flex-col justify-center animate-in fade-in zoom-in-95 duration-300">
                            <CardContent className="p-6 md:p-12 space-y-8">
                                <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
                                    {questions[step - 2].text}
                                </h2>
                                <div className="space-y-4">
                                    {questions[step - 2].options.map((option) => (
                                        <div
                                            key={option.id}
                                            onClick={() => handleAnswerQuestion(questions[step - 2].id, option.id)}
                                            className={`cursor-pointer w-full text-left p-4 md:p-6 rounded-lg text-lg border transition-all duration-200 ease-in-out hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 ${answers[questions[step - 2].id] === option.id
                                                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-600"
                                                : "border-gray-200 dark:border-zinc-800"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${answers[questions[step - 2].id] === option.id
                                                        ? "border-blue-600 bg-blue-600"
                                                        : "border-gray-300 dark:border-zinc-700"
                                                        }`}
                                                >
                                                    {answers[questions[step - 2].id] === option.id && (
                                                        <div className="w-2 h-2 rounded-full bg-white" />
                                                    )}
                                                </div>
                                                <span className={`${answers[questions[step - 2].id] === option.id ? "font-medium" : ""}`}>
                                                    {option.text}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between pt-6 border-t dark:border-zinc-800 mt-8">
                                    <Button variant="ghost" onClick={handlePrev} className="text-gray-500">
                                        Voltar
                                    </Button>
                                    <p className="text-sm text-gray-400 self-center">
                                        Responda pensando na forma como sua empresa decide hoje.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Tela 12: Loading / Processando */}
                    {step === 12 && (
                        <div className="text-center min-h-[60vh] flex flex-col items-center justify-center space-y-6">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <h2 className="text-2xl font-bold">Calculando sua maturidade financeira...</h2>
                            <p className="text-gray-500">Isso levará apenas alguns segundos.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
