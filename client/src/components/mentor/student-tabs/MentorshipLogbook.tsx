"use client";

import { useState, useEffect } from "react";
import { FileText, Edit, Save, Clock, AlertTriangle, Droplet, Stethoscope, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { createLogbookEntryAction, updateCompanyNotesAction, updateDiagnosisAction } from "@/actions/mentor";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// 1. Perguntas Padrão (Fallback caso a mentoria não tenha um bloco de diagnóstico no Builder)
const FORMULARIO_PADRAO = [
    {
        id: "interprete",
        titulo: "Interpretação e Leitura de Números",
        perguntas: [
            { id: "p1", tipo: "radio", texto: "Produto por R$100; CMV 35; impostos 10; taxa 5. O que se conclui com mais segurança?", opcoes: ["lucro de R$50", "margem para pagar estrutura e formar resultado", "50% de lucro líquido", "nada relevante"] },
            { id: "p3", tipo: "radio", texto: "Qual indicador isolado é menos confiável para concluir que a empresa vai bem?", opcoes: ["faturamento", "margem de contribuição", "resultado operacional", "geração de caixa"] },
            { id: "p6", tipo: "radio", texto: "Vendeu bem, mas terminou pressionada no caixa. Hipótese principal?", opcoes: ["problema só nas vendas", "vender, gerar margem, receber e manter caixa são coisas diferentes", "precisa só vender mais", "caixa e lucro são a mesma coisa"] },
        ]
    },
    {
        id: "criterio",
        titulo: "Critério e Tomada de Decisão",
        perguntas: [
            { id: "p2", tipo: "radio", texto: "Caixa apertado. Qual o melhor critério para decidir aumento de preço?", opcoes: ["concorrente subiu", "caixa está baixo", "avaliar custos, margem, sensibilidade e volume", "subir nos mais vendidos"] },
            { id: "p4", tipo: "radio", texto: "Produto vende muito, mas quase não sobra dinheiro. Leitura mais madura?", opcoes: ["volume compensa", "rever preço, custo, combo, processo ou papel estratégico", "investir mais nele", "importante é vender"] },
            { id: "p5", tipo: "radio", texto: "Como avaliar se um desconto 'cabe'?", opcoes: ["cliente pressionou", "concorrente cobra menos", "calcular impacto na margem de contribuição", "dar se a venda parecer importante"] },
            { id: "p8", tipo: "radio", texto: "Base de maior confiança antes de decidir?", opcoes: ["sensação de mercado", "saldo em conta", "indicadores + operação + contexto", "opinião comercial"] },
            { id: "p10", tipo: "radio", texto: "Cenário mais perigoso para crescer com segurança?", opcoes: ["vender muito sem entender margem, estrutura e caixa", "poucos clientes novos no mês", "não acompanhar redes da concorrência", "manter preço parecido com o mercado"] },
        ]
    },
    {
        id: "rotina",
        titulo: "Rotina e Gestão",
        perguntas: [
            { id: "p7", tipo: "radio", texto: "Frequência mínima para consolidar e analisar números?", opcoes: ["só quando há problema", "pelo menos mensalmente, com leitura recorrente", "semestral", "quando o contador entregar"] },
            { id: "p9", tipo: "radio", texto: "Qual visão mostra maior maturidade sobre a função financeira?", opcoes: ["contador já cuida", "serve para obrigação e pagar contas", "transformar números em leitura de decisão", "basta extrato"] },
        ]
    }
];

interface MentorshipLogbookProps {
    studentData?: any;
}

export function MentorshipLogbook({ studentData }: MentorshipLogbookProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [novaNota, setNovaNota] = useState("");
    const [isAddingNota, setIsAddingNota] = useState(false);

    // 2. Construir Formulário Dinâmico a partir do Template (se houver)
    const [formularioDinamico, setFormularioDinamico] = useState<any[]>(FORMULARIO_PADRAO);

    useEffect(() => {
        if (studentData?.templateStructure?.modules) {
            // Se houver módulos, verificamos se algum é de "Diagnóstico"
            const diagModules = studentData.templateStructure.modules.filter((m: any) => 
                m.titulo.toLowerCase().includes('diagnóstico') || m.titulo.toLowerCase().includes('prontuário')
            );

            if (diagModules.length > 0) {
                const dynamic = diagModules.map((m: any, bIdx: number) => ({
                    id: m.id,
                    titulo: m.titulo,
                    perguntas: m.objectives.map((obj: any, qIdx: number) => {
                        const parts = (obj.descricao || "").split(' | ');
                        const textoReal = parts[0] || "";
                        const tipoPart = parts.find((p: string) => p.startsWith('Tipo: ')) || "";
                        const opcoesPart = parts.find((p: string) => p.startsWith('Opções: ')) || "";
                        
                        const tipoRaw = tipoPart.replace('Tipo: ', '');
                        const opcoes = opcoesPart.replace('Opções: ', '').split(',').filter(Boolean);

                        // Mapear tipos do builder para tipos do formulário
                        let tipoForm = "text";
                        if (tipoRaw === "multipla_escolha") tipoForm = "radio";
                        if (tipoRaw === "texto_longo") tipoForm = "textarea";

                        return {
                            id: `p${qIdx + 1 + (bIdx * 5)}`,
                            tipo: tipoForm,
                            texto: textoReal,
                            opcoes: opcoes.length > 0 ? opcoes : (obj.opcoes || [])
                        };
                    })
                }));
                setFormularioDinamico(dynamic);
            }
        }
    }, [studentData]);

    // 1. Mapear as respostas reais do banco de dados (se houverem)
    const dbResponse = studentData?.diagnostico?.[0] || {};
    
    // Convertemos o formato do Drizzle (q1, q2...) para o formato do formulário (p1, p2...)
    const initialRespostas: Record<string, string> = {};
    for (let i = 1; i <= 10; i++) {
        const val = dbResponse[`q${i}`];
        if (val) initialRespostas[`p${i}`] = val;
    }

    const [respostas, setRespostas] = useState<Record<string, string>>(initialRespostas);
    const [historicoSessoes, setHistoricoSessoes] = useState<any[]>([]);
    const [notasAnalista, setNotasAnalista] = useState({
        bloco1: studentData?.empresa?.notes || "Sem observações registradas.",
        gargaloPrincipal: studentData?.score?.gargaloPrincipal || "Analise o diagnóstico para identificar o gargalo.",
        vazamento: "Analise o diagnóstico para identificar vazamentos."
    });

    useEffect(() => {
        if (studentData?.logbook) {
            setHistoricoSessoes(studentData.logbook.map((item: any) => ({
                id: item.id,
                data: new Date(item.createdAt).toLocaleDateString('pt-BR'),
                tipo: "Acompanhamento",
                resumo: item.texto,
                autor: item.autorNome
            })));
        }
    }, [studentData]);

    const handleAddNota = async () => {
        if (!novaNota.trim()) return;

        const res = await createLogbookEntryAction(studentData.id, novaNota);
        if (res.success) {
            const created = res.data[0];
            setHistoricoSessoes(prev => [{
                id: created.id,
                data: new Date(created.criadoEm).toLocaleDateString('pt-BR'),
                tipo: "Acompanhamento",
                resumo: created.texto,
                autor: "Você" // Simplificação
            }, ...prev]);
            setNovaNota("");
            setIsAddingNota(false);
            toast.success("Nota adicionada ao prontuário!");
        } else {
            toast.error("Erro ao salvar nota");
        }
    };

    const handleToggleEdit = async () => {
        if (isEditing) {
            const loadingToast = toast.loading("Salvando diagnóstico...");
            const resNotes = await updateCompanyNotesAction(studentData.id, notasAnalista.bloco1);
            
            const alunoId = studentData?.id;
            if (!alunoId) {
                toast.error("Erro: ID do aluno não encontrado.");
                toast.dismiss(loadingToast);
                return;
            }

            const leadData: any = {};
            Object.keys(respostas).forEach(key => {
                const num = parseInt(key.replace('p', ''));
                if (num >= 1 && num <= 10) {
                    leadData[`q${num}`] = respostas[key];
                }
            });

            const resDiagnosis = await updateDiagnosisAction(alunoId, leadData);

            toast.dismiss(loadingToast);
            if (resNotes.success && resDiagnosis.success) {
                toast.success("Diagnóstico atualizado com sucesso!");
                setIsEditing(false);
            } else {
                const errorMsg = resDiagnosis.error || resNotes.error || "Erro desconhecido";
                toast.error(`Erro ao salvar: ${errorMsg}`);
            }
        } else {
            setIsEditing(true);
        }
    };

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
                    onClick={handleToggleEdit}
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
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-in fade-in">
                            <div className="mb-6 pb-4 border-b border-slate-100">
                                <h4 className="font-bold text-slate-800">Roteiro de Entrevista e Aprofundamento</h4>
                                <p className="text-xs text-slate-500 mt-1">Preencha os dados com base na conversa com o cliente.</p>
                            </div>

                            <div className="space-y-8">
                                {formularioDinamico.map((bloco) => (
                                    <div key={bloco.id} className="space-y-6">
                                        <h5 className="text-sm font-bold text-[#f84f08] uppercase tracking-wider bg-[#f84f08]/5 p-2 rounded-md">
                                            {bloco.titulo}
                                        </h5>

                                        {bloco.perguntas.map((pergunta: any) => (
                                            <div key={pergunta.id} className="space-y-3 pl-2 border-l-2 border-slate-100">
                                                <Label className="text-sm font-semibold text-slate-700 leading-snug">
                                                    {pergunta.texto}
                                                </Label>

                                                {pergunta.tipo === "radio" && pergunta.opcoes && (
                                                    <RadioGroup
                                                        defaultValue={respostas[pergunta.id]}
                                                        onValueChange={(val) => setRespostas({ ...respostas, [pergunta.id]: val })}
                                                        className="space-y-2 mt-2"
                                                    >
                                                        {pergunta.opcoes.map((opcao: string) => (
                                                            <div key={opcao} className="flex items-center space-x-2">
                                                                <RadioGroupItem value={opcao} id={`${pergunta.id}-${opcao}`} />
                                                                <Label htmlFor={`${pergunta.id}-${opcao}`} className="font-normal text-slate-600 cursor-pointer">
                                                                    {opcao}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                )}

                                                {pergunta.tipo === "text" && (
                                                    <Input 
                                                        value={respostas[pergunta.id] || ""}
                                                        onChange={(e: any) => setRespostas({ ...respostas, [pergunta.id]: e.target.value })}
                                                        className="bg-slate-50 border-slate-200"
                                                        placeholder="Sua resposta..."
                                                    />
                                                )}

                                                {pergunta.tipo === "textarea" && (
                                                    <Textarea 
                                                        value={respostas[pergunta.id] || ""}
                                                        onChange={(e) => setRespostas({ ...respostas, [pergunta.id]: e.target.value })}
                                                        className="bg-slate-50 border-slate-200 min-h-[80px]"
                                                        placeholder="Descreva aqui..."
                                                    />
                                                )}
                                            </div>
                                        ))}

                                        <div className="mt-4 pl-2">
                                            <Label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-2">
                                                <MessageSquare className="w-3 h-3" /> Observações do Analista ({bloco.titulo})
                                            </Label>
                                            <Textarea
                                                value={bloco.id === "bloco1" ? notasAnalista.bloco1 : ""}
                                                onChange={(e) => {
                                                    if (bloco.id === "bloco1") {
                                                        setNotasAnalista({ ...notasAnalista, bloco1: e.target.value });
                                                    }
                                                }}
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
                                    {formularioDinamico.map((bloco) => (
                                        <AccordionItem key={bloco.id} value={bloco.id} className="px-4">
                                            <AccordionTrigger className="hover:no-underline text-sm font-semibold text-slate-700">
                                                {bloco.titulo}
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-4 space-y-4">
                                                {bloco.perguntas.map((p: any) => (
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
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="text-xs h-8"
                                        onClick={() => setIsAddingNota(!isAddingNota)}
                                    >
                                        {isAddingNota ? "Cancelar" : "+ Nova Nota de Sessão"}
                                    </Button>
                                </div>

                                {isAddingNota && (
                                    <div className="mb-6 p-4 bg-blue-50/50 border border-blue-100 rounded-lg animate-in slide-in-from-top-2">
                                        <Label className="text-xs font-bold text-blue-700 uppercase mb-2 block">Nova Anotação de Sessão</Label>
                                        <Textarea 
                                            value={novaNota}
                                            onChange={(e) => setNovaNota(e.target.value)}
                                            placeholder="Descreva o que foi discutido nesta sessão..."
                                            className="bg-white border-blue-200 min-h-[100px] mb-3"
                                        />
                                        <div className="flex justify-end">
                                            <Button size="sm" onClick={handleAddNota} className="bg-blue-600 hover:bg-blue-700 text-white">
                                                Salvar Nota
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                    {historicoSessoes.length === 0 ? (
                                        <div className="text-center py-8 text-slate-400 text-sm italic">
                                            Nenhuma anotação de sessão registrada.
                                        </div>
                                    ) : (
                                        historicoSessoes.map((sessao) => (
                                            <div key={sessao.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px]">{sessao.autor || sessao.tipo}</Badge>
                                                        <time className="font-medium text-xs text-slate-400">{sessao.data}</time>
                                                    </div>
                                                    <div className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{sessao.resumo}</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
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