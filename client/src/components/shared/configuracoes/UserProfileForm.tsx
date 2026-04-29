"use client";

import { useState, useEffect } from "react";
import { Camera, Save, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export function UserProfileForm({ initialUser }: { initialUser?: any }) {
    const router = useRouter();
    const [nome, setNome] = useState(initialUser?.name || "João Paulo");
    const [email, setEmail] = useState(initialUser?.email || "joao@cluster.com");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initialUser) {
            if (initialUser.name) setNome(initialUser.name);
            if (initialUser.email) setEmail(initialUser.email);
        }
    }, [initialUser]);

    const handleSave = async () => {
        if (password && password !== confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        setSaving(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
            const token = document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1];

            const body: any = { fullName: nome, email };
            if (password) body.password = password;

            const res = await fetch(`${apiUrl}/auth/me`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                alert("Perfil atualizado com sucesso!");
                setPassword("");
                setConfirmPassword("");
                router.refresh(); // Trigger re-fetch of layout data (Sidebar)
            } else {
                const json = await res.json();
                alert(`Erro ao atualizar perfil: ${json.error}`);
            }
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
            alert("Erro de conexão ao salvar perfil.");
        } finally {
            setSaving(false);
        }
    };

    const avatarFallback = nome.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'JP';

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
                            <AvatarImage src={initialUser?.avatar} alt={nome} />
                            <AvatarFallback className="bg-slate-100 text-2xl text-slate-500 font-bold">
                                {avatarFallback}
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
                            <Input type="password" placeholder="••••••••" className="bg-white" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-bold">Confirmar Nova Senha</Label>
                            <Input type="password" placeholder="••••••••" className="bg-white" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button 
                        className="bg-[#f84f08] hover:bg-[#d94205] text-white"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Salvando..." : <><Save className="w-4 h-4 mr-2" /> Salvar Alterações</>}
                    </Button>
                </div>
            </div>
        </div>
    );
}