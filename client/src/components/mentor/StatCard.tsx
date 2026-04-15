import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatCardProps {
    title: string;
    value: number | string;
    description: string;
    icon: LucideIcon; // Tipagem específica para ícones do Lucide
    linkText?: string;
    linkUrl?: string;
    iconColor?: string; // Opcional: permite customizar a cor do ícone
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon, // Renomeamos com letra maiúscula para usar como componente React
    linkText,
    linkUrl,
    iconColor = "text-slate-400" // Cor padrão caso nenhuma seja enviada
}: StatCardProps) {
    return (
        <Card className="w-full gap-1 max-w-sm hover:shadow-sm transition-shadow border-slate-200 flex flex-col justify-between">
            {/* HEADER: Título e Ícone Dinâmicos */}
            <CardHeader className="flex flex-row py-4 items-center justify-between space-y-0">
                {/* Nota: Corrigi 'text-4x1' para 'text-sm' pois 4xl fica gigante para subtítulo */}
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                    {title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />
            </CardHeader>

            {/* CONTENT: Dados Dinâmicos */}
            <CardContent className="py-0">
                <div className="text-4xl font-bold text-slate-800">{value}</div>
                <p className="text-sm text-slate-500 mt-1">
                    {description}
                </p>
            </CardContent>

            {/* FOOTER: Link e Call to Action Dinâmicos */}
            <CardFooter className="border-t border-slate-100 pt-2 mt-4">
                <Button
                    variant="ghost"
                    className="w-full justify-between text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2"
                    asChild
                >
                    <Link href={linkUrl || "#"}>
                        {linkText} <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}