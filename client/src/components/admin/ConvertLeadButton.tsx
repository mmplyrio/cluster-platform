'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { convertLeadToAlunoAction } from '@/actions/admin';
import { Check, UserPlus, Loader2 } from 'lucide-react';

export function ConvertLeadButton({ leadId }: { leadId: string }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleConvert = async () => {
        if (!confirm('Deseja converter este lead num aluno e alocar à mentoria?')) return;
        
        // Passando fake MentorId para testar, no futuro isso pode vir de um Select. 
        // Assumindo que temos o mentor@cluster.com
        const mentorId = 'dummy-will-update'; 

        setLoading(true);
        setError('');
        
        try {
            const result = await convertLeadToAlunoAction(leadId, mentorId);
            if (result.success) {
                setSuccess(true);
                router.refresh();
            } else {
                setError(result.error);
            }
        } catch (e) {
            setError('Erro inesperado');
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Lead convertido para Aluno com sucesso!</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-end">
            <button
                disabled={loading}
                onClick={handleConvert}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-70"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Tornar Aluno
            </button>
            {error && <span className="text-xs text-rose-500 mt-2">{error}</span>}
        </div>
    );
}
