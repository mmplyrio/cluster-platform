"use client";

import { MessageCircle } from "lucide-react"; // Você pode usar um ícone do WhatsApp se tiver (ex: react-icons)
import { Button } from "@/components/ui/button";

interface WhatsAppCTAProps {
    nomeLead: string;       // O nome que você puxou do banco de dados ou do estado do formulário
    telefoneMentor: string; // O número do mentor (ex: 5511999999999)
}

export function WhatsAppCTA({ nomeLead, telefoneMentor }: WhatsAppCTAProps) {

    // 1. Limpa o telefone para garantir que só tem números (tira traços, espaços, parênteses)
    const numeroLimpo = telefoneMentor.replace(/\D/g, '');

    // 2. Monta a mensagem dinâmica injetando o nome do lead
    const mensagem = `Olá! Me chamo ${nomeLead}, acabei de realizar o diagnóstico na plataforma e gostaria de marcar um horário para conversarmos sobre os resultados.`;

    // 3. Codifica a mensagem para o formato de URL (URL Encode)
    const mensagemCodificada = encodeURIComponent(mensagem);

    // 4. Monta o link final da API do WhatsApp
    const linkWhatsapp = `https://wa.me/${numeroLimpo}?text=${mensagemCodificada}`;

    return (
        <Button
            className="w-max bg-[#f84f08] hover:bg-[#f84f08]/80 text-white font-bold h-12 px-8 text-lg shadow-lg shadow-green-500/30 transition-all"
            asChild
        >
            <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Agendar Sessão Estratégica
            </a>
        </Button>
    );
}