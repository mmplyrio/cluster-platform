"use client";

import { useState, useMemo } from "react";
import { CRMFiltros } from "./CRMFiltros";
import { TableCRM, CRMClient } from "./TableCRM";

interface CRMContentProps {
    clientes: CRMClient[];
}

export function CRMContent({ clientes }: CRMContentProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("todos");
    const [productFilter, setProductFilter] = useState("todos_produtos");

    const filteredClientes = useMemo(() => {
        return clientes.filter((client) => {
            // Filtro de Busca
            const matchesSearch = 
                client.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.contato.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Filtro de Status
            const matchesStatus = statusFilter === "todos" || client.status === statusFilter;
            
            // Filtro de Produto (baseado no nome da turma atual por enquanto)
            const matchesProduct = productFilter === "todos_produtos" || 
                (client.turmaAtual && client.turmaAtual.toLowerCase().includes(productFilter.toLowerCase()));

            return matchesSearch && matchesStatus && matchesProduct;
        });
    }, [clientes, searchTerm, statusFilter, productFilter]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
                <CRMFiltros 
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    productFilter={productFilter}
                    onProductChange={setProductFilter}
                />
            </div>
            <TableCRM data={filteredClientes} />
        </div>
    );
}
