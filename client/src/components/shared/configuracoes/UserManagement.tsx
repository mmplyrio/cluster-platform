"use client";

import { Users, UserPlus, MoreVertical, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function UserManagement() {
    const usuarios = [
        { id: 1, nome: "Carlos Mendes", email: "carlos@cluster.com", role: "MENTOR", status: "Ativo" },
        { id: 2, nome: "Tech Solutions (Ana)", email: "ana@tech.com", role: "ALUNO", status: "Pendente" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Gestão de Acessos</h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Convide novos alunos ou cadastre mentores na sua organização.
                    </p>
                </div>
                {/* Aqui entrará um Sheet/Modal de convite no futuro */}
                <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                    <UserPlus className="w-4 h-4 mr-2" /> Convidar Usuário
                </Button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Usuário</th>
                                <th className="px-6 py-4">Nível de Acesso</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {usuarios.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800">{user.nome}</div>
                                        <div className="text-slate-500 text-xs mt-0.5">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className={`text-[10px] uppercase font-bold border-0
                                            ${user.role === 'MENTOR' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}
                                        `}>
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className={`text-[10px] uppercase font-bold border-0
                                            ${user.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                                        `}>
                                            {user.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user.status === 'Pendente' && (
                                            <Button variant="ghost" size="icon" className="text-[#f84f08] hover:bg-[#f84f08]/10 mr-1" title="Reenviar Convite">
                                                <Mail className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-700">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}