'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2, Mail, User, Briefcase, ShieldCheck } from 'lucide-react';
import { createTeamMemberAction } from '@/actions/admin';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function CreateTeamMemberSheet() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState('');
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const form = e.currentTarget;
        const formData = new FormData(form);

        // Asigurando que o valor do Select do Shadcn entre no form data customizado
        if (role) {
            formData.set('roleName', role);
        } else {
            setError('Selecione o cargo do membro.');
            setLoading(false);
            return;
        }

        try {
            const res = await createTeamMemberAction(formData);
            if (res.success) {
                setOpen(false);
                router.refresh();
                form.reset();
                setRole('');
            } else {
                setError(res.error || 'Falha ao cadastrar membro.');
            }
        } catch (err) {
            setError('Erro fatal de comunicação.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="bg-[#f84f08] hover:bg-[#d94205] text-white font-medium shadow-sm transition-all">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Nova Conta Equipe
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[500px] overflow-y-auto p-0">
                <SheetHeader className="pb-6 border-b border-slate-100 px-6 pt-6">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-2">
                        <ShieldCheck className="w-6 h-6 text-indigo-600" />
                    </div>
                    <SheetTitle className="text-2xl font-bold text-slate-800 tracking-tight">
                        Nova Conta
                    </SheetTitle>
                    <SheetDescription className="text-slate-500 leading-relaxed">
                        Preencha os dados do novo <b>Mentor</b> ou <b>Comercial</b>. No primeiro acesso deles à plataforma, o sistema exigirá o cadastramento da senha.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6 px-6">
                    <div className="space-y-3">
                        <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">
                            Identificação
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-slate-400" />
                            </div>
                            <Input
                                id="fullName"
                                name="fullName"
                                required
                                className="pl-10 border-slate-200 focus-visible:ring-indigo-500 bg-slate-50/50"
                                placeholder="Ex: João da Silva"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                            E-mail Institucional
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-slate-400" />
                            </div>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="pl-10 border-slate-200 focus-visible:ring-indigo-500 bg-slate-50/50"
                                placeholder="joao@cluster.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="roleName" className="text-sm font-medium text-slate-700">
                            Cargo e Permissão
                        </Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="w-full border-slate-200 bg-slate-50/50 focus:ring-indigo-500">
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Briefcase className="h-4 w-4 text-slate-400" />
                                    <SelectValue placeholder="Defina a função" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MENTOR" className="py-2.5">Mentor (Especialista)</SelectItem>
                                <SelectItem value="COMERCIAL" className="py-2.5">Comercial (Vendas)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {error && (
                        <div className="p-3 mt-2 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <SheetFooter className="pt-6 border-t border-slate-100 mt-8 pb-6">
                        <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !role}
                            className="bg-[#f84f08] hover:bg-[#d94205] text-white"
                        >
                            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                            Salvar Equipe
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
