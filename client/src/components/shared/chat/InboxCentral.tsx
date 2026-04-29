"use client";

import { useState } from "react";
import {
    Search, Plus, MoreVertical, Send, Paperclip,
    Activity, Users, User as UserIcon, ArrowLeft, MessageSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Definição de tipos para garantir consistência entre perfis
export type UserRole = "MENTOR" | "ALUNO" | "ADMIN";

interface ChatContact {
    id: string;
    name: string;
    type: "INDIVIDUAL" | "GRUPO";
    role?: UserRole;
    lastMessage: string;
    time: string;
    unread: number;
    online?: boolean;
}

interface InboxCentralProps {
    userRole: UserRole;
    userId: string;
}

export function InboxCentral({ userRole, userId }: InboxCentralProps) {
    const [activeChat, setActiveChat] = useState<string | null>("c1");
    const [showChatOnMobile, setShowChatOnMobile] = useState<boolean>(false);

    // Mock de conversas (Em produção, isso viria filtrado pelo seu Backend via userId/role)
    const conversas: ChatContact[] = [
        { id: "c1", name: "Turma Agosto - Lucro Estruturado", type: "GRUPO", lastMessage: "João (Tech Solutions): Subi o arquivo.", time: "10:30", unread: 2 },
        { id: "c2", name: "Tech Solutions Ltda", type: "INDIVIDUAL", role: "ALUNO", lastMessage: "Obrigado pelo feedback!", time: "Ontem", unread: 0, online: true },
        { id: "c3", name: "Ana Costa", type: "INDIVIDUAL", role: "MENTOR", lastMessage: "Pode me ajudar com o caso?", time: "Ontem", unread: 0, online: false },
    ];

    return (
        <div className="flex flex-1 w-full h-full bg-white relative overflow-hidden rounded-r-2xl min-h-0">

            {/* LISTA DE CONVERSAS */}
            <div className={`w-full md:w-[350px] border-r border-slate-100 flex-col h-full bg-white shrink-0 ${showChatOnMobile ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800">Mensagens</h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="icon" className="h-8 w-8 rounded-full bg-[#f84f08] hover:bg-[#d94205] text-white shadow-sm">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Nova Conversa</DialogTitle>
                                <DialogDescription>Inicie um chat com sua rede na Cluster.</DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue="contatos" className="w-full mt-4">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="contatos">
                                        {userRole === "ALUNO" ? "Colegas de Turma" : "Alunos"}
                                    </TabsTrigger>
                                    <TabsTrigger value="suporte">
                                        {userRole === "ALUNO" ? "Meu Mentor" : "Equipe"}
                                    </TabsTrigger>
                                </TabsList>
                                <div className="py-8 text-center text-sm text-slate-400 border-2 border-dashed border-slate-100 rounded-xl mt-4">
                                    Filtrando contatos para perfil: {userRole}
                                </div>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="p-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input placeholder="Buscar conversa..." className="pl-9 bg-slate-50 border-slate-200 h-9 text-sm focus-visible:ring-[#f84f08]" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversas.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => {
                                setActiveChat(chat.id);
                                setShowChatOnMobile(true);
                            }}
                            className={`w-full flex items-start gap-3 p-3 transition-colors border-b border-slate-50 last:border-0 relative
                                ${activeChat === chat.id ? 'bg-[#f84f08]/5' : 'hover:bg-slate-50'}
                            `}
                        >
                            {activeChat === chat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f84f08]" />}
                            <Avatar className="h-10 w-10 border border-slate-100">
                                <AvatarFallback className={chat.type === "GRUPO" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"}>
                                    {chat.type === "GRUPO" ? <Users className="w-5 h-5" /> : chat.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0 text-left">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-bold text-slate-800 text-sm truncate">{chat.name}</span>
                                    <span className="text-[10px] text-slate-400">{chat.time}</span>
                                </div>
                                <span className="text-xs truncate block text-slate-500">{chat.lastMessage}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* JANELA DE CHAT */}
            <div className={`flex-1 flex-col h-full bg-slate-50/20 min-w-0 ${showChatOnMobile ? 'flex' : 'hidden md:flex'}`}>
                {activeChat ? (
                    <>
                        <div className="h-16 px-4 md:px-6 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2 md:gap-3">
                                <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={() => setShowChatOnMobile(false)}>
                                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                                </Button>
                                <Avatar className="h-9 w-9 border border-slate-200 shrink-0">
                                    <AvatarFallback>TS</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-sm text-slate-800 truncate">Tech Solutions Ltda</h3>
                                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Online agora</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 md:gap-2 shrink-0">
                                {/* Ação exclusiva para Mentores e Admins */}
                                {(userRole === "MENTOR" || userRole === "ADMIN") && (
                                    <Button variant="outline" size="sm" className="h-8 text-xs border-slate-300 hover:bg-slate-50 hidden sm:flex">
                                        <Activity className="w-3.5 h-3.5 mr-1.5" /> Raio-X
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreVertical className="w-4 h-4" /></Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0 p-4 md:p-6">
                            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm max-w-[85%] md:max-w-[70%]">
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    Olá! Recebi as instruções da etapa de Organização. Já estamos mapeando os processos.
                                </p>
                                <span className="text-[10px] text-slate-400 mt-1 block text-right">10:15</span>
                            </div>
                        </div>

                        <div className="p-3 md:p-4 bg-white border-t border-slate-100 shrink-0">
                            <div className="flex items-center gap-1 md:gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-1 focus-within:ring-[#f84f08]/50 transition-all">
                                <Button variant="ghost" size="icon" className="text-slate-400 shrink-0"><Paperclip className="w-5 h-5" /></Button>
                                <textarea
                                    placeholder="Mensagem..."
                                    className="flex-1 bg-transparent border-0 focus:ring-0 resize-none text-sm p-2 text-slate-700 min-w-0"
                                    rows={1}
                                />
                                <Button size="icon" className="bg-[#f84f08] hover:bg-[#d94205] text-white h-9 w-9 shrink-0"><Send className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center h-full text-slate-400">
                        <MessageSquare className="w-12 h-12 mb-4 text-slate-200" />
                        <p className="text-sm">Selecione uma conversa para começar</p>
                    </div>
                )}
            </div>
        </div>
    );
}