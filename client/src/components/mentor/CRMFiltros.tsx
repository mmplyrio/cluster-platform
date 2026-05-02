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

interface CRMFiltrosProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    productFilter: string;
    onProductChange: (value: string) => void;
}

export function CRMFiltros({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    productFilter,
    onProductChange
}: CRMFiltrosProps) {
    return (
        <div className="flex flex-col w-full md:flex-row md:items-center gap-4 pt-2">
            {/* Campo de Busca */}
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                    type="search"
                    placeholder="Buscar por nome da empresa, contato..."
                    className="pl-9 bg-slate-50 border-slate-200"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Filtros Secundários */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Select value={statusFilter} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-full sm:w-[160px] bg-white">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos os Status</SelectItem>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Pausado">Pausado</SelectItem>
                        <SelectItem value="Alumni">Alumni</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={productFilter} onValueChange={onProductChange}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-white">
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