"use client";

import { useState } from "react";
import { Camera, Save, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserProfileForm() {
    const [nome, setNome] = useState("João Paulo");
    const [email, setEmail] = useState("joao@cluster.com");

    return (
        <div className="space-y-8 animate-in fade-in">
            <div>
                <h3 className="text-lg font-bold text-slate-800">Meu Perfil</h3>
                <p className="text-sm text-slate-500 mt-1">
                    Gerencie suas informações pessoais e credenciais de acesso.
                </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                {/* Avatar Upload */}
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                    <div className="relative group cursor-pointer">
                        <Avatar className="h-20 w-20 border-2 border-slate-100">
                            <AvatarFallback className="bg-slate-100 text-2xl text-slate-500 font-bold">
                                JP
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">Foto de Perfil</h4>
                        <p className="text-xs text-slate-500 mt-1 mb-3">Recomendado: JPG ou PNG quadrado, máx 2MB.</p>
                        <Button variant="outline" size="sm" className="h-8 text-xs font-bold">
                            Fazer Upload
                        </Button>
                    </div>
                </div>

                {/* Dados Pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold">Nome Completo</Label>
                        <Input value={nome} onChange={(e) => setNome(e.target.value)} className="bg-white" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold">E-mail de Acesso</Label>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="bg-white text-slate-500" />
                    </div>
                </div>

                {/* Alterar Senha */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#f84f08]" /> Segurança
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-bold">Nova Senha</Label>
                            <Input type="password" placeholder="••••••••" className="bg-white" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-bold">Confirmar Nova Senha</Label>
                            <Input type="password" placeholder="••••••••" className="bg-white" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button className="bg-[#f84f08] hover:bg-[#d94205] text-white">
                        <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                    </Button>
                </div>
            </div>
        </div>
    );
}