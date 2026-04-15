"use client";

import { useRef } from "react";
import { CheckCircle2, Clock, Lock, ChevronLeft, ChevronRight } from "lucide-react";

export interface ProgressStep {
    id: string;
    title: string;
    status: "completed" | "current" | "locked";
}

interface MentorshipProgressProps {
    steps: ProgressStep[];
    onStepClick?: (stepId: string) => void;
}

export function MentorshipProgress({ steps, onStepClick }: MentorshipProgressProps) {
    // Referência para controlar o scroll do carrossel
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Cálculos de Progresso
    const totalSteps = steps.length;
    const completedSteps = steps.filter(s => s.status === 'completed').length;
    const progressPercentage = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

    // Função de rolagem horizontal dos cards
    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 240; // Quantidade de pixels a rolar (aprox. 1 card)
            scrollContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    // Matemática do SVG para o Gráfico de Rosca
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm w-full flex flex-col md:flex-row gap-8 items-center md:items-stretch">

            {/* 1. BLOCO DO GRÁFICO (Lado Esquerdo) */}
            <div className="flex flex-col items-center justify-center shrink-0 md:border-r md:border-slate-100 md:pr-8">
                <div className="relative flex items-center justify-center w-32 h-32">
                    {/* SVG Base (Fundo Cinza) */}
                    <svg className="absolute w-full h-full transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r={radius}
                            fill="transparent"
                            stroke="#f1f5f9" // slate-100
                            strokeWidth="10"
                        />
                        {/* SVG de Progresso (Cor Laranja) */}
                        <circle
                            cx="64"
                            cy="64"
                            r={radius}
                            fill="transparent"
                            stroke="#f84f08" // Cor da Cluster
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    {/* Texto Central do Gráfico */}
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-800">{progressPercentage}%</span>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">Evolução</p>
                    <p className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-full mt-1 inline-block">
                        {completedSteps} de {totalSteps} etapas
                    </p>
                </div>
            </div>

            {/* 2. BLOCO DO CARROSSEL (Lado Direito) */}
            <div className="flex-1 flex flex-col min-w-0 w-full">

                {/* Cabeçalho do Carrossel e Botões de Navegação */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                        Trilha de Aprendizado
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll("left")}
                            className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Container de Cards com Scroll Horizontal Oculto */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto snap-x scroll-smooth pb-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Oculta a barra de rolagem nativa no Firefox/IE
                >
                    {/* Hack CSS Injetado para ocultar barra no Chrome/Safari */}
                    <style dangerouslySetInnerHTML={{ __html: `::-webkit-scrollbar { display: none; }` }} />

                    {steps.map((step, index) => {
                        const isCompleted = step.status === 'completed';
                        const isCurrent = step.status === 'current';
                        const isLocked = step.status === 'locked';

                        return (
                            <button
                                key={step.id}
                                onClick={() => onStepClick && onStepClick(step.id)}
                                disabled={isLocked}
                                className={`
                                    snap-start shrink-0 w-[200px] p-4 rounded-xl text-left transition-all duration-300 flex flex-col justify-between h-[120px]
                                    ${isCompleted ? 'bg-[#f84f08] border border-[#f84f08] hover:bg-[#d94205] shadow-md' : ''}
                                    ${isCurrent ? 'bg-white border-2 border-[#f84f08] hover:bg-slate-50 shadow-sm' : ''}
                                    ${isLocked ? 'bg-slate-50 border border-slate-200 opacity-70 cursor-not-allowed' : ''}
                                `}
                            >
                                {/* Linha 1 do Card: Badge + Ícone */}
                                <div className="flex items-center justify-between w-full">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                                        ${isCompleted ? 'bg-white/20 text-white' : ''}
                                        ${isCurrent ? 'bg-[#f84f08]/10 text-[#f84f08]' : ''}
                                        ${isLocked ? 'bg-slate-200 text-slate-500' : ''}
                                    `}>
                                        Módulo {index + 1}
                                    </span>

                                    {isCompleted && <CheckCircle2 className="w-5 h-5 text-white" />}
                                    {isCurrent && <Clock className="w-5 h-5 text-[#f84f08] animate-pulse" />}
                                    {isLocked && <Lock className="w-4 h-4 text-slate-300" />}
                                </div>

                                {/* Linha 2 do Card: Título e Status */}
                                <div>
                                    <h4 className={`text-sm font-bold leading-snug line-clamp-2
                                        ${isCompleted ? 'text-white' : ''}
                                        ${isCurrent ? 'text-slate-800' : ''}
                                        ${isLocked ? 'text-slate-500' : ''}
                                    `}>
                                        {step.title}
                                    </h4>
                                    <p className={`text-xs mt-1 font-medium
                                        ${isCompleted ? 'text-white/80' : ''}
                                        ${isCurrent ? 'text-slate-500' : ''}
                                        ${isLocked ? 'text-slate-400' : ''}
                                    `}>
                                        {isCompleted ? "Concluído" : isCurrent ? "Em Andamento" : "Bloqueado"}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}