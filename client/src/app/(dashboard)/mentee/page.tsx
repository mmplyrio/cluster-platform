export default function MenteeDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Minha Trilha</h1>
                <p className="text-slate-600">Acompanhe seu progresso no planejamento da sua empresa.</p>
            </div>

            {/* Card de Exemplo de Progresso */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800">Próximo Passo</h2>
                <p className="text-slate-600 mt-1">Módulo 2: Estruturação Financeira para PMEs</p>

                <div className="mt-4 w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">45% concluído</p>
            </div>
        </div>
    );
}