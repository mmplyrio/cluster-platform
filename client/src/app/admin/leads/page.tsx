import { getDashboardKPIs, getLeadsList } from '@/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, ClipboardCheck, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cluster | Inovação e Tecnologia',
    description: 'Cluster | Inovação e Tecnologia',
    icons: {
        icon: '/logomarca.svg', // Opcional se você já colocou na raiz
    },
}
export default async function LeadsDashboardPage() {
    const [kpisResponse, leadsResponse] = await Promise.all([
        getDashboardKPIs(),
        getLeadsList(),
    ]);

    const kpis = kpisResponse.data || { totalLeads: 0, totalDiagnostics: 0, totalAppointments: 0 };
    const leads = leadsResponse.data || [];

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard de Leads</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {/* KPI 1 */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpis.totalLeads}</div>
                    </CardContent>
                </Card>

                {/* KPI 2 */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Diagnósticos Concluídos</CardTitle>
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpis.totalDiagnostics}</div>
                    </CardContent>
                </Card>

                {/* KPI 3 */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpis.totalAppointments}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="rounded-md border bg-white shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Nome do Lead</TableHead>
                                <TableHead>Empresa</TableHead>
                                <TableHead>WhatsApp</TableHead>
                                <TableHead>Perfil Identificado</TableHead>
                                <TableHead className="text-right">Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        Nenhum lead encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                leads.map((lead: any) => (
                                    <TableRow key={lead.id}>
                                        <TableCell>
                                            {new Intl.DateTimeFormat('pt-BR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            }).format(new Date(lead.createdAt))}
                                        </TableCell>
                                        <TableCell className="font-medium">{lead.nome}</TableCell>
                                        <TableCell>{lead.empresa || '-'}</TableCell>
                                        <TableCell>{lead.telefone || '-'}</TableCell>
                                        <TableCell>
                                            {lead.perfil ? (
                                                <Badge variant="secondary">{lead.perfil}</Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm" className="ml-auto">
                                                <Link href={`/admin/leads/${lead.id}`}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Ver Relatório
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
