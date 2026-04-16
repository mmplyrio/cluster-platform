'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { convertLeadToAlunoAction } from '@/actions/admin';
import { Check, UserPlus, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ConvertLeadButton({ leadId, mentors }: { leadId: string, mentors: Array<{id: string, fullName: string}> }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showSelect, setShowSelect] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState('');
    const router = useRouter();

    const handleConvert = async () => {
        if (!selectedMentor) {
            setError('Selecione um mentor.');
            return;
        }
        
        if (!confirm('Deseja converter este lead num aluno e alocar à mentoria?')) return;
        
        setLoading(true);
        setError('');
        
        try {
            const result = await convertLeadToAlunoAction(leadId, selectedMentor);
            if (result.success) {
                setSuccess(true);
                setShowSelect(false);
                router.refresh();
            } else {
                setError(result.error || 'Erro ao converter lead');
            }
        } catch (e) {
            setError('Erro inesperado de rede');
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200 mt-2">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Lead convertido para Aluno com sucesso!</span>
            </div>
        );
    }

    if (showSelect) {
        return (
            <div className="flex flex-col items-end w-full max-w-sm mt-4 p-4 border border-slate-200 rounded-xl bg-white shadow-sm space-y-3">
                <h4 className="text-sm font-medium text-slate-700 w-full">Vincule um Mentor</h4>
                <select 
                    value={selectedMentor}
                    onChange={(e) => setSelectedMentor(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                    <option value="">Selecione um Mentor...</option>
                    {mentors.map(m => (
                        <option key={m.id} value={m.id}>{m.fullName}</option>
                    ))}
                </select>
                {error && <span className="text-xs text-rose-500 w-full">{error}</span>}
                <div className="flex justify-end gap-2 w-full pt-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowSelect(false)} disabled={loading}>
                        <X className="w-4 h-4 mr-1" /> Cancelar
                    </Button>
                    <Button onClick={handleConvert} disabled={loading || !selectedMentor} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                        Confirmar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-end">
            <button
                disabled={loading}
                onClick={() => setShowSelect(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-70"
            >
                <UserPlus className="w-4 h-4" />
                Tornar Aluno
            </button>
        </div>
    );
}
