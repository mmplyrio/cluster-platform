"use client";

import { Plus, GripVertical, Trash2, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Objetivo {
    id?: string;
    descricao: string;
}

interface Modulo {
    id?: string;
    titulo: string;
    objetivoMacro: string;
    objectives: Objetivo[];
}

interface TrackBuilderProps {
    modulos: Modulo[];
    setModulos: (modulos: Modulo[]) => void;
}

export function TrackBuilder({ modulos, setModulos }: TrackBuilderProps) {
    // Função para adicionar um novo Módulo vazio
    const adicionarModulo = () => {
        const novoModulo: Modulo = {
            id: `new-${Date.now()}`,
            titulo: `Novo Módulo ${modulos.length + 1}`,
            objetivoMacro: "",
            objectives: []
        };
        setModulos([...modulos, novoModulo]);
    };

    // Função para remover um Módulo
    const removerModulo = (id: string) => {
        setModulos(modulos.filter(m => (m.id || m.titulo) !== id));
    };

    // Função para atualizar textos do Módulo
    const atualizarModulo = (id: string, campo: keyof Modulo, valor: string) => {
        setModulos(modulos.map(m => (m.id || m.titulo) === id ? { ...m, [campo]: valor } : m));
    };

    // Função para adicionar Objetivo dentro de um Módulo específico
    const adicionarObjetivo = (idModulo: string) => {
        setModulos(modulos.map(m => {
            if ((m.id || m.titulo) === idModulo) {
                return {
                    ...m,
                    objectives: [...m.objectives, { descricao: "" }]
                };
            }
            return m;
        }));
    };

    // Função para atualizar texto de um Objetivo
    const atualizarObjetivo = (idModulo: string, indexObjetivo: number, valor: string) => {
        setModulos(modulos.map(m => {
            if ((m.id || m.titulo) === idModulo) {
                const newObjectives = [...m.objectives];
                newObjectives[indexObjetivo] = { ...newObjectives[indexObjetivo], descricao: valor };
                return {
                    ...m,
                    objectives: newObjectives
                };
            }
            return m;
        }));
    };

    // Função para remover Objetivo
    const removerObjetivo = (idModulo: string, indexObjetivo: number) => {
        setModulos(modulos.map(m => {
            if ((m.id || m.titulo) === idModulo) {
                return {
                    ...m,
                    objectives: m.objectives.filter((_, idx) => idx !== indexObjetivo)
                };
            }
            return m;
        }));
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-8">
            <div>
                <h3 className="text-lg font-bold text-slate-800">Módulos da Mentoria</h3>
                <p className="text-sm text-slate-500">
                    Defina a jornada do aluno. Os objetivos que você cadastrar aqui se transformarão em checklists interativos na tela de gestão.
                </p>
            </div>

            <div className="space-y-6">
                {modulos.map((modulo, index) => (
                    <div key={modulo.id || index} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 relative group">

                        {/* AÇÕES DO MÓDULO (Lixeira) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removerModulo(modulo.id || modulo.titulo)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10 mb-6">
                            <div className="space-y-2">
                                <Label className="text-[#f84f08] font-bold">Título do Módulo</Label>
                                <Input
                                    value={modulo.titulo}
                                    onChange={(e) => atualizarModulo(modulo.id || modulo.titulo, "titulo", e.target.value)}
                                    className="bg-white font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Objetivo Macro (Descrição Breve)</Label>
                                <Input
                                    value={modulo.objetivoMacro}
                                    onChange={(e) => atualizarModulo(modulo.id || modulo.titulo, "objetivoMacro", e.target.value)}
                                    placeholder="Ex: Estruturação de processos e fluxos..."
                                    className="bg-white"
                                />
                            </div>
                        </div>

                        {/* LISTA DE OBJETIVOS ALOCADOS */}
                        <div className="bg-white border border-slate-100 rounded-lg p-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <CheckSquare className="w-4 h-4" /> Objetivos de Aprendizado
                            </h4>

                            <div className="space-y-2">
                                {modulo.objectives.map((objetivo, objIndex) => (
                                    <div key={objIndex} className="flex items-center gap-2">
                                        <GripVertical className="w-4 h-4 text-slate-300 cursor-move" />
                                        <Input
                                            value={objetivo.descricao}
                                            onChange={(e) => atualizarObjetivo(modulo.id || modulo.titulo, objIndex, e.target.value)}
                                            placeholder="Digite uma meta acionável. Ex: Mapear fornecedores."
                                            className="h-8 text-sm bg-slate-50 border-slate-200"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removerObjetivo(modulo.id || modulo.titulo, objIndex)}
                                            className="h-8 w-8 text-slate-400 hover:text-red-500 shrink-0"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                ))}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => adicionarObjetivo(modulo.id || modulo.titulo)}
                                    className="w-full mt-2 border-dashed border-slate-300 text-slate-500 hover:text-[#f84f08] hover:border-[#f84f08]/50"
                                >
                                    <Plus className="w-3 h-3 mr-2" /> Adicionar Novo Objetivo
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Button
                onClick={adicionarModulo}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white py-6 rounded-xl border-2 border-slate-900 border-dashed"
            >
                <Plus className="w-5 h-5 mr-2" /> Adicionar Próximo Módulo
            </Button>
        </div>
    );
}