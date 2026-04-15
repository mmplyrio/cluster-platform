"use client";

import { useState } from "react";
import { FileText, Edit, Save, Clock, AlertTriangle, Droplet, Stethoscope, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

// 1. Simulação do Schema do Builder (A Estrutura do Questionário)
// Isso garante que a tela seja escalável para qualquer mentoria.
const FORMULARIO_DIAGNOSTICO = [
    {
        id: "bloco1",
        titulo: "Bloco 1 — Contexto atual do negócio",
        perguntas: [
            { id: "p1", tipo: "radio", texto: "Hoje, qual destas situações melhor descreve sua principal preocupação financeira?", opcoes: ["vender mais", "sobrar mais dinheiro no final do período", "organizar melhor os números", "controlar custos e despesas", "ter mais previsibilidade de caixa"] },
            { id: "p3", tipo: "radio", texto: "Quando você pensa na saúde financeira da empresa hoje, a sensação predominante é:", opcoes: ["controle", "atenção", "instabilidade", "aperto recorrente", "desorganização"] },
        ]
    },
    {
        id: "bloco2",
        titulo: "Bloco 2 — Caixa e liquidez",
        perguntas: [
            { id: "p6", tipo: "radio", texto: "É comum a empresa vender bem e, ainda assim, faltar dinheiro no caixa?", opcoes: ["nunca", "raramente", "às vezes", "com frequência", "quase sempre"] },
        ]
    }
];

export function MentorshipLogbook() {
    // Controla se o mentor está preenchendo o diagnóstico ou apenas visualizando o resumo
    const [isEditing, setIsEditing] = useState(false);

    // Mock das respostas já salvas e das anotações do analista
    const [respostas, setRespostas] = useState<Record<string, string>>({
        p1: "sobrar mais dinheiro no final do período",
        p3: "aperto recorrente",
        p6: "com frequência"
    });

    const [notasAnalista, setNotasAnalista] = useState({
        bloco1: "Cliente relata faturamento alto, mas não vê a cor do dinheiro. O CEO está muito focado em marketing e negligenciando a controladoria.",
        gargaloPrincipal: "Precificação defasada corroendo a margem de contribuição.",
        vazamento: "Retiradas dos sócios misturadas ao caixa da empresa."
    });

    // Mock da linha do tempo (Timeline das sessões)
    const historicoSessoes = [
        { id: 1, data: "15 Abr 2026", tipo: "Sessão Ao Vivo", resumo: "Validamos as contas bancárias. O cliente estava resistente, mas entendeu a importância de separar PJ de PF." },
        { id: 2, data: "10 Abr 2026", tipo: "Diagnóstico", resumo: "Entrevista de aprofundamento realizada. Identificado alto risco de liquidez." }
    ];

    return (
        <div className="space-y-6">

            {/* CABEÇALHO DO PRONTUÁRIO */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Prontuário e Diagnóstico</h3>
                        <p className="text-sm text-slate-500">
                            Registro clínico da empresa e histórico de evolução na mentoria.
                        </p>
                    </div>
                </div>

                <Button
                    variant={isEditing ? "default" : "outline"}
                    className={isEditing ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "text-slate-600"}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? (
                        <><Save className="w-4 h-4 mr-2" /> Salvar Diagnóstico</>
                    ) : (
                        <><Edit className="w-4 h-4 mr-2" /> Atualizar Respostas</>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLUNA ESQUERDA: O Diagnóstico (Formulário ou Resumo) */}
                <div className="lg:col-span-2 space-y-6">

                    {isEditing ? (
                        /* ========================================================= */
                        /* MODO EDIÇÃO: O Formulário Dinâmico                        */
                        /* ========================================================= */
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-in fade-in">
                            <div className="mb-6 pb-4 border-b border-slate-100">
                                <h4 className="font-bold text-slate-800">Roteiro de Entrevista e Aprofundamento</h4>
                                <p className="text-xs text-slate-500 mt-1">Preencha os dados com base na conversa com o cliente.</p>
                            </div>

                            <div className="space-y-8">
                                {FORMULARIO_DIAGNOSTICO.map((bloco) => (
                                    <div key={bloco.id} className="space-y-6">
                                        <h5 className="text-sm font-bold text-[#f84f08] uppercase tracking-wider bg-[#f84f08]/5 p-2 rounded-md">
                                            {bloco.titulo}
                                        </h5>

                                        {bloco.perguntas.map((pergunta) => (
                                            <div key={pergunta.id} className="space-y-3 pl-2 border-l-2 border-slate-100">
                                                <Label className="text-sm font-semibold text-slate-700 leading-snug">
                                                    {pergunta.texto}
                                                </Label>

                                                {pergunta.tipo === "radio" && (
                                                    <RadioGroup
                                                        defaultValue={respostas[pergunta.id]}
                                                        onValueChange={(val) => setRespostas({ ...respostas, [pergunta.id]: val })}
                                                        className="space-y-2 mt-2"
                                                    >
                                                        {pergunta.opcoes.map((opcao) => (
                                                            <div key={opcao} className="flex items-center space-x-2">
                                                                <RadioGroupItem value={opcao} id={`${pergunta.id}-${opcao}`} />
                                                                <Label htmlFor={`${pergunta.id}-${opcao}`} className="font-normal text-slate-600 cursor-pointer">
                                                                    {opcao}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                )}
                                            </div>
                                        ))}

                                        {/* Campo de Observação do Analista por Bloco */}
                                        <div className="mt-4 pl-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-2">
                                                <MessageSquare className="w-3 h-3" /> Observações do Analista ({bloco.titulo})
                                            </Label>
                                            <Textarea
                                                defaultValue={bloco.id === "bloco1" ? notasAnalista.bloco1 : ""}
                                                placeholder="Insira as evidências observadas durante a entrevista..."
                                                className="bg-yellow-50/50 border-yellow-200 resize-none min-h-[80px] text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* ========================================================= */
                        /* MODO VISUALIZAÇÃO: Síntese e Linha do Tempo               */
                        /* ========================================================= */
                        <div className="space-y-6 animate-in fade-in">
                            {/* A SÍNTESE CLÍNICA (O que realmente importa pro Mentor) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                                    <h5 className="flex items-center gap-2 text-red-800 font-bold mb-2">
                                        <AlertTriangle className="w-4 h-4" /> Gargalo Principal
                                    </h5>
                                    <p className="text-sm text-red-900/80 leading-relaxed">
                                        {notasAnalista.gargaloPrincipal}
                                    </p>
                                </div>
                                <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
                                    <h5 className="flex items-center gap-2 text-orange-800 font-bold mb-2">
                                        <Droplet className="w-4 h-4" /> Vazamento Financeiro
                                    </h5>
                                    <p className="text-sm text-orange-900/80 leading-relaxed">
                                        {notasAnalista.vazamento}
                                    </p>
                                </div>
                            </div>

                            {/* RESUMO DAS RESPOSTAS DO CLIENTE */}
                            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                                        Respostas do Diagnóstico Base
                                    </h4>
                                </div>
                                <Accordion type="single" collapsible className="w-full">
                                    {FORMULARIO_DIAGNOSTICO.map((bloco) => (
                                        <AccordionItem key={bloco.id} value={bloco.id} className="px-4">
                                            <AccordionTrigger className="hover:no-underline text-sm font-semibold text-slate-700">
                                                {bloco.titulo}
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-4 space-y-4">
                                                {bloco.perguntas.map((p) => (
                                                    <div key={p.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                        <p className="text-xs font-semibold text-slate-500 mb-1">{p.texto}</p>
                                                        <p className="text-sm text-slate-800 font-medium flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#f84f08]" />
                                                            {respostas[p.id] || "Não respondido."}
                                                        </p>
                                                    </div>
                                                ))}
                                                {bloco.id === "bloco1" && (
                                                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                        <p className="text-xs font-bold text-yellow-800 uppercase mb-1">Nota do Analista</p>
                                                        <p className="text-sm text-yellow-900/80">{notasAnalista.bloco1}</p>
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>

                            {/* TIMELINE DE SESSÕES */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-slate-400" /> Histórico de Acompanhamento
                                    </h4>
                                    <Button size="sm" variant="outline" className="text-xs h-8">
                                        + Nova Nota de Sessão
                                    </Button>
                                </div>

                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                    {historicoSessoes.map((sessao) => (
                                        <div key={sessao.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                <div className="flex items-center justify-between mb-1">
                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px]">{sessao.tipo}</Badge>
                                                    <time className="font-medium text-xs text-slate-400">{sessao.data}</time>
                                                </div>
                                                <div className="text-sm text-slate-600 mt-2">{sessao.resumo}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* COLUNA DIREITA: Dicas ou Informações Fixas */}
                <div className="space-y-6">
                    <div className="bg-slate-800 rounded-xl p-5 text-white shadow-sm">
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-[#f84f08]" />
                            Diretrizes de Leitura
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="leading-relaxed">
                                <strong className="text-white block">Vazamento:</strong>
                                Perda recorrente que reduz lucro ou consome caixa sem necessidade.
                            </li>
                            <li className="leading-relaxed">
                                <strong className="text-white block">Gargalo Econômico:</strong>
                                O ponto central que trava previsibilidade, margem ou tomada de decisão.
                            </li>
                            <li className="pt-3 border-t border-slate-700 text-xs italic text-slate-400">
                                Dica: Sempre vincule a hipótese a uma evidência observada.
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}