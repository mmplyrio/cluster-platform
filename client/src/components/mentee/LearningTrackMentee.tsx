"use client";

import { useState, useRef } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import {
    CheckCircle2,
    Circle,
    Lock,
    FileText,
    Download,
    UploadCloud,
    CheckSquare,
    AlertCircle,
    FileImage
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export interface ModuloTrack {
    id: string;
    titulo: string;
    objetivo: string;
    statusInicial: string;
}

export function LearningTrackMentee({ modulos = [] }: { modulos?: ModuloTrack[] }) {
    // Para o aluno, o status é estático (governado pelo mentor/backend)
    const statusModulos = Object.fromEntries(modulos.map(m => [m.id, m.statusInicial]));
    
    // Simulação p/ demonstrar envio de arquivo
    const [enviado, setEnviado] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setEnviado(true);
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">Sua Jornada</h3>
                <p className="text-sm text-slate-500 mt-1">
                    Acompanhe seus passos, conclua os objetivos e envie os documentos solicitados pelo seu Mentor.
                </p>
            </div>

            <div className="p-2">
                <Accordion type="single" collapsible defaultValue={modulos[0]?.id || "mod1"} className="space-y-2">
                    {modulos.map((modulo) => {
                        const statusAtual = statusModulos[modulo.id];
                        const isBloqueado = statusAtual === "bloqueado";
                        const isConcluido = statusAtual === "concluido";

                        return (
                            <AccordionItem
                                key={modulo.id}
                                value={modulo.id}
                                disabled={isBloqueado} // Aluno não pode expandir módulo bloqueado
                                className={`px-4 border rounded-lg transition-all ${isBloqueado ? "bg-slate-50/50 border-slate-100 opacity-60" :
                                        isConcluido ? "bg-emerald-50/20 border-emerald-100" : "bg-blue-50/30 border-blue-100"
                                    }`}
                            >
                                {/* HEADER DO MÓDULO */}
                                <AccordionTrigger className="hover:no-underline py-4 disabled:cursor-not-allowed">
                                    <div className="flex items-center gap-3 w-full pr-4">
                                        {isConcluido && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                                        {statusAtual === "andamento" && <Circle className="w-5 h-5 text-blue-500 fill-blue-100 shrink-0" />}
                                        {isBloqueado && <Lock className="w-5 h-5 text-slate-300 shrink-0" />}

                                        <div className="text-left flex-1">
                                            <span className={`block font-bold ${isBloqueado ? "text-slate-400" : "text-slate-800"}`}>
                                                {modulo.titulo}
                                            </span>
                                            <span className="text-xs text-slate-500 font-normal">{modulo.objetivo}</span>
                                        </div>
                                        
                                        {isBloqueado && (
                                            <span className="text-[10px] uppercase font-bold text-slate-400">Bloqueado</span>
                                        )}
                                    </div>
                                </AccordionTrigger>

                                {!isBloqueado && (
                                    <AccordionContent className="pt-0 pb-6 space-y-6">

                                        {/* OBJETIVOS */}
                                        <div className="space-y-3 pt-2">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <CheckSquare className="w-3.5 h-3.5" /> Seus Objetivos
                                            </h4>
                                            
                                            <div className="bg-white p-3 rounded-lg border border-slate-200 group">
                                                <div className="flex items-start gap-3">
                                                    <Checkbox id={`aluno-obj-1-${modulo.id}`} className="mt-1" />
                                                    <label htmlFor={`aluno-obj-1-${modulo.id}`} className="text-sm font-medium text-slate-700 cursor-pointer">
                                                        Mapear todas as contas bancárias da empresa
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="bg-white p-3 rounded-lg border border-slate-200 group">
                                                <div className="flex items-start gap-3 justify-between w-full">
                                                    <div className="flex items-start gap-3">
                                                        <Checkbox id={`aluno-obj-2-${modulo.id}`} className="mt-1" defaultChecked={isConcluido} />
                                                        <label htmlFor={`aluno-obj-2-${modulo.id}`} className="text-sm font-medium text-slate-700 items-start cursor-pointer">
                                                            Lançar previsões de receitas para 3 meses
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* TAREFAS E ENTREGÁVEIS */}
                                        <div className="pt-4 border-t border-slate-100">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <FileText className="w-3.5 h-3.5" /> Entregáveis Pendentes
                                                </h4>
                                            </div>

                                            <div className="space-y-3">
                                                {/* Tarefa Não Enviada */}
                                                {!isConcluido && (
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50/30">
                                                        <div className="flex items-start gap-3 mb-3 sm:mb-0">
                                                            <div className="p-2 bg-blue-100 rounded text-blue-600 mt-1">
                                                                <FileText className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-800">DRE Projetada em Branco</p>
                                                                <p className="text-xs text-slate-500 max-w-sm mt-1">Baixe este arquivo modelo, preencha com seus dados do mês atual e envie preenchido.</p>
                                                                
                                                                <Button variant="link" className="p-0 h-auto text-xs text-blue-600 mt-2 font-bold" onClick={() => alert("Baixando DRE...")}>
                                                                    <Download className="w-3.5 h-3.5 mr-1" /> Baixar Modelo (Excel)
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="w-full sm:w-auto self-stretch sm:self-auto flex items-center justify-end">
                                                            {enviado && modulo.id === "mod3" ? (
                                                                <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
                                                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md font-bold whitespace-nowrap border border-amber-200 flex items-center gap-1.5">
                                                                        <FileImage className="w-3.5 h-3.5" /> Em Análise pelo Mentor
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <input 
                                                                        type="file" 
                                                                        ref={fileInputRef} 
                                                                        className="hidden" 
                                                                        onChange={handleFileChange}
                                                                    />
                                                                    <Button 
                                                                        onClick={handleUploadClick}
                                                                        className="w-full sm:w-auto bg-[#f84f08] hover:bg-[#d94205] text-white text-xs font-bold"
                                                                    >
                                                                        <UploadCloud className="w-4 h-4 mr-2" />
                                                                        Enviar Arquivo
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Tarefa Aprovada */}
                                                {isConcluido && (
                                                    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border border-emerald-200 rounded-lg bg-emerald-50">
                                                        <div className="flex items-center gap-3 w-full">
                                                            <div className="p-2 bg-emerald-100 rounded text-emerald-600 shrink-0">
                                                                <CheckCircle2 className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-emerald-900">Mapa_Custos_Fixos_Aprovado.xlsx</p>
                                                                <p className="text-[11px] text-emerald-700">Aprovado pelo mentor em 10 Abr 2026.</p>
                                                            </div>
                                                            <Button variant="outline" size="sm" className="hidden sm:flex h-8 bg-white text-xs text-emerald-700 border-emerald-200">
                                                                <Download className="w-3.5 h-3.5 mr-1.5" /> Baixar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                            </div>
                                        </div>
                                    </AccordionContent>
                                )}
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </div>
        </div>
    );
}
