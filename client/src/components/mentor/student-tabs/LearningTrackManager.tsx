"use client";

import { useState, useEffect } from "react";
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
    Plus,
    MessageSquare,
    Paperclip,
    CheckSquare,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    updateModuleStatusAction, 
    updateTaskStatusAction, 
    updateDeliverableStatusAction, 
    createTaskAction 
} from "@/actions/mentor";
import { toast } from "sonner";

interface LearningTrackManagerProps {
    studentData?: any;
    selectedJourneyId?: string | null;
}

export function LearningTrackManager({ studentData, selectedJourneyId }: LearningTrackManagerProps) {

    // Obtém os módulos reais do backend com base no contexto (jornada) selecionado
    let realModules = [];
    if (selectedJourneyId && studentData?.journeysData && studentData.journeysData[selectedJourneyId]) {
        realModules = studentData.journeysData[selectedJourneyId].modules || [];
    }

    // Se não houver módulos, exibimos uma mensagem amigável depois. 
    // Mas vamos inicializar o estado de status para todos os módulos encontrados.
    const [statusModulos, setStatusModulos] = useState<Record<string, string>>({});

    useEffect(() => {
        if (realModules.length > 0) {
            const initialStatus = Object.fromEntries(realModules.map((m: any) => [m.id, m.status === 'completed' ? 'concluido' : (m.status === 'current' || m.status === 'active' ? 'andamento' : 'bloqueado')]));
            setStatusModulos(initialStatus);
        }
    }, [selectedJourneyId, studentData]);

    const [novaTarefaAberta, setNovaTarefaAberta] = useState<string | null>(null);
    const [notasAbertas, setNotasAbertas] = useState<Record<string, boolean>>({});
    const [novaTarefaData, setNovaTarefaData] = useState({ titulo: '', descricao: '' });

    const handleStatusChange = async (id: string, novoStatus: string) => {
        const backendStatus = novoStatus === 'concluido' ? 'completed' : (novoStatus === 'andamento' ? 'active' : 'locked');
        setStatusModulos(prev => ({ ...prev, [id]: novoStatus }));
        
        const res = await updateModuleStatusAction(id, backendStatus);
        if (res.success) {
            toast.success("Status do módulo atualizado!");
        } else {
            toast.error("Erro ao atualizar status");
        }
    };

    const handleTaskCheck = async (taskId: string, checked: boolean) => {
        const newStatus = checked ? 'completed' : 'pending';
        const res = await updateTaskStatusAction(taskId, newStatus);
        if (res.success) {
            toast.success("Status da tarefa atualizado!");
        }
    };

    const handleDeliverableStatus = async (delivId: string, status: 'approved' | 'rejected') => {
        const res = await updateDeliverableStatusAction(delivId, status);
        if (res.success) {
            toast.success(status === 'approved' ? "Arquivo aprovado!" : "Arquivo recusado.");
        }
    };

    const handleCreateTask = async (moduleId: string) => {
        if (!selectedJourneyId) return;
        const res = await createTaskAction(moduleId, selectedJourneyId, novaTarefaData.titulo, novaTarefaData.descricao);
        if (res.success) {
            toast.success("Tarefa criada com sucesso!");
            setNovaTarefaAberta(null);
            setNovaTarefaData({ titulo: '', descricao: '' });
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">Gestão da Trilha e Entregas</h3>
                <p className="text-sm text-slate-500 mt-1">
                    Gerencie os módulos, objetivos e avalie os arquivos enviados pelo aluno.
                </p>
            </div>

            <div className="p-2">
                {realModules.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        Nenhum módulo encontrado para esta mentoria.
                    </div>
                ) : (
                    <Accordion type="single" collapsible defaultValue={realModules[0]?.id} className="space-y-2">
                        {realModules.map((modulo: any) => {
                            const statusAtual = statusModulos[modulo.id];
                            const isBloqueado = statusAtual === "bloqueado";
                            const isConcluido = statusAtual === "concluido";

                            return (
                                <AccordionItem
                                    key={modulo.id}
                                    value={modulo.id}
                                    className={`px-4 border rounded-lg transition-all ${isBloqueado ? "bg-slate-50/50 border-slate-100" :
                                        isConcluido ? "bg-emerald-50/20 border-emerald-100" : "bg-amber-50/30 border-amber-100"
                                        }`}
                                >
                                    {/* HEADER DO MÓDULO */}
                                    <AccordionTrigger className="hover:no-underline py-4">
                                        <div className="flex items-center gap-3 w-full pr-4">
                                            {isConcluido && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                                            {statusAtual === "andamento" && <Circle className="w-5 h-5 text-amber-500 fill-amber-100 shrink-0" />}
                                            {isBloqueado && <Lock className="w-5 h-5 text-slate-300 shrink-0" />}

                                            <div className="text-left flex-1">
                                                <span className={`block font-bold ${isBloqueado ? "text-slate-400" : "text-slate-800"}`}>
                                                    {modulo.title}
                                                </span>
                                                <span className="text-xs text-slate-500 font-normal">{modulo.objective}</span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent className="pt-0 pb-6 space-y-6">

                                        {/* CONTROLE DE STATUS (Agora compacto e discreto logo abaixo do título) */}
                                        <div className="flex items-center gap-3 bg-white/60 p-2 rounded-md border border-slate-200 mt-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-2">Status do Módulo:</span>
                                            <Select
                                                value={statusAtual}
                                                onValueChange={(val) => handleStatusChange(modulo.id, val)}
                                            >
                                                <SelectTrigger className="w-[160px] h-7 text-xs bg-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="concluido">Concluído</SelectItem>
                                                    <SelectItem value="andamento">Em Andamento</SelectItem>
                                                    <SelectItem value="bloqueado">Bloqueado</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {isBloqueado && (
                                                <div className="ml-auto flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded text-[10px] font-medium border border-amber-100">
                                                    <AlertCircle className="w-3 h-3" /> Oculto para o aluno
                                                </div>
                                            )}
                                        </div>

                                        {/* OBJETIVOS */}
                                        <div className="space-y-3 pt-2">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <CheckSquare className="w-3.5 h-3.5" /> Tarefas
                                            </h4>
                                            {modulo.tasks?.map((task: any) => (
                                                <div key={task.id} className="bg-white p-3 rounded-lg border border-slate-200 group">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-3">
                                                            <Checkbox 
                                                                id={`task-${task.id}`} 
                                                                className="mt-1" 
                                                                defaultChecked={task.status === 'completed'}
                                                                onCheckedChange={(checked) => handleTaskCheck(task.id, !!checked)}
                                                            />
                                                            <div className="cursor-pointer" onClick={() => {}}>
                                                                <label htmlFor={`task-${task.id}`} className="text-sm font-medium text-slate-700 cursor-pointer block">
                                                                    {task.titulo}
                                                                </label>
                                                                {task.descricao && (
                                                                    <p className="text-xs text-slate-400 mt-0.5">{task.descricao}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setNotasAbertas(p => ({ ...p, [task.id]: !p[task.id] }))}
                                                            className="h-6 text-slate-400 hover:text-[#f84f08]"
                                                        >
                                                            <MessageSquare className="w-3.5 h-3.5 mr-1" /> Nota
                                                        </Button>
                                                    </div>
                                                    {notasAbertas[task.id] && (
                                                        <Textarea
                                                            placeholder="Anotação interna sobre este objetivo (o aluno não vê)..."
                                                            className="mt-3 text-xs bg-yellow-50/50 border-yellow-200 resize-none h-16 placeholder:text-slate-400"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* TAREFAS E ENTREGÁVEIS (ARQUIVOS) */}
                                        <div className="pt-4 border-t border-slate-100">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <FileText className="w-3.5 h-3.5" /> Arquivos e Entregas
                                                </h4>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setNovaTarefaAberta(novaTarefaAberta === modulo.id ? null : modulo.id)}
                                                    className="h-7 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-white"
                                                >
                                                    <Plus className="w-3 h-3 mr-1" /> Nova Tarefa
                                                </Button>
                                            </div>

                                            {/* FORMULÁRIO DE NOVA TAREFA INLINE */}
                                            {novaTarefaAberta === modulo.id && (
                                                <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-inner animate-in zoom-in-95">
                                                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Criar Tarefa Personalizada</h5>
                                                    <div className="grid gap-3">
                                                        <Input 
                                                            placeholder="Título da tarefa..." 
                                                            className="h-8 text-sm bg-white" 
                                                            value={novaTarefaData.titulo}
                                                            onChange={(e) => setNovaTarefaData(p => ({ ...p, titulo: e.target.value }))}
                                                        />
                                                        <Textarea 
                                                            placeholder="Instruções para o aluno..." 
                                                            className="text-sm min-h-[60px] bg-white resize-none" 
                                                            value={novaTarefaData.descricao}
                                                            onChange={(e) => setNovaTarefaData(p => ({ ...p, descricao: e.target.value }))}
                                                        />
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Button variant="outline" size="sm" className="w-full justify-start text-slate-500 bg-white text-xs h-8">
                                                                <Paperclip className="w-3.5 h-3.5 mr-2" /> Anexar Documento Modelo (Opcional)
                                                            </Button>
                                                        </div>
                                                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 mt-2">
                                                            <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => setNovaTarefaAberta(null)}>Cancelar</Button>
                                                            <Button 
                                                                size="sm" 
                                                                className="bg-[#f84f08] hover:bg-[#d94205] text-white text-xs h-8"
                                                                onClick={() => handleCreateTask(modulo.id)}
                                                            >
                                                                Atribuir ao Aluno
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* LISTA DE ENTREGÁVEIS REAIS */}
                                            <div className="space-y-3">
                                                {(!modulo.tasks || modulo.tasks.filter((t: any) => t.deliverables?.length > 0).length === 0) && (
                                                    <p className="text-[11px] text-slate-400 italic text-center py-2 bg-slate-50/50 rounded-md border border-dashed border-slate-200">
                                                        Nenhum arquivo enviado para este módulo ainda.
                                                    </p>
                                                )}
                                                
                                                {modulo.tasks?.map((task: any) => (
                                                    task.deliverables?.map((deliv: any) => (
                                                        <div key={deliv.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-md transition-colors ${
                                                            deliv.status === 'approved' ? 'border-emerald-200 bg-emerald-50/30' : 
                                                            deliv.status === 'rejected' ? 'border-red-200 bg-red-50/30' : 'border-slate-200 bg-white'
                                                        }`}>
                                                            <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                                                <div className={`p-2 rounded ${deliv.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-slate-700">{deliv.fileName}</p>
                                                                    <p className="text-[11px] text-slate-400">Tarefa: {task.titulo}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 w-full sm:w-auto">
                                                                <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-8 text-xs text-slate-600 border-slate-300 bg-white" asChild>
                                                                    <a href={deliv.fileUrl} target="_blank" rel="noopener noreferrer">
                                                                        <Download className="w-3.5 h-3.5 mr-1.5" /> Baixar
                                                                    </a>
                                                                </Button>
                                                                {deliv.status === 'pending' && (
                                                                    <>
                                                                        <Button 
                                                                            variant="ghost" 
                                                                            size="sm" 
                                                                            className="flex-1 sm:flex-none h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                            onClick={() => handleDeliverableStatus(deliv.id, 'rejected')}
                                                                        >
                                                                            Recusar
                                                                        </Button>
                                                                        <Button 
                                                                            variant="default" 
                                                                            size="sm" 
                                                                            className="flex-1 sm:flex-none h-8 text-xs bg-emerald-500 hover:bg-emerald-600"
                                                                            onClick={() => handleDeliverableStatus(deliv.id, 'approved')}
                                                                        >
                                                                            Aprovar
                                                                        </Button>
                                                                    </>
                                                                )}
                                                                {deliv.status === 'approved' && (
                                                                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold self-center">Aprovado</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                ))}
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                )}
            </div>
        </div>
    );
}