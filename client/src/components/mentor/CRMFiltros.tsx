"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export function CRMFiltros() {
    return (
        <div className="flex flex-col md:flex-row gap-4 pt-2">
            {/* Campo de Busca (Ocupa o maior espaço) */}
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                    type="search"
                    placeholder="Buscar por nome da empresa, contato ou CNPJ..."
                    className="pl-9 bg-slate-50 border-slate-200"
                />
            </div>

            {/* Filtros Secundários */}
            <div className="flex gap-2">
                <Select defaultValue="todos">
                    <SelectTrigger className="w-[160px] bg-white">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos os Status</SelectItem>
                        <SelectItem value="ativo">Em Mentoria Ativa</SelectItem>
                        <SelectItem value="pausado">Pausado / Risco</SelectItem>
                        <SelectItem value="concluido">Concluído (Alumni)</SelectItem>
                    </SelectContent>
                </Select>

                <Select defaultValue="todos_produtos">
                    <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Produto" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos_produtos">Todos os Produtos</SelectItem>
                        <SelectItem value="lucro">Lucro Estruturado</SelectItem>
                        <SelectItem value="vendas">Máquina de Vendas</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}