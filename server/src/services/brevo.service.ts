export class BrevoService {
    static async enviarEmailDiagnostico(nome: string, email: string, score: number, linkResultado: string) {

        // Transformando em percentual caso queira mostrar em % (40 pontos dão 100%)
        const scorePercent = Math.round((score / 40) * 100);
        const numeroWhatsApp = "5573999070507"; // O número WhatsApp configurado da Base
        const msgWhatsapp = encodeURIComponent(`Olá, acabei de fazer o meu diagnóstico com nota ${score}/40 e gostaria de agendar uma consulta.`);

        const brevoPayload = {
            sender: {
                name: process.env.BREVO_SENDER_NAME || "Equipe Cluster",
                email: process.env.BREVO_SENDER_EMAIL,
            },
            to: [{ name: nome, email: email }],
            subject: "Seu Diagnóstico de Maturidade Financeira 📊",
            htmlContent: `
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="background-color: #f8fafc; margin: 0; padding: 40px 20px;">
                    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        
                        <!-- Header / Logo -->
                        <div style="text-align: center; margin-bottom: 30px;">
				<a href="https://www.clustersolucoes.com/"> <img src="https://www.clustersolucoes.com/logo.svg" alt="Logo Cluster" width="300" height="150">

</a>
                            <p style="color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px; font-weight: 600;">
                                Inovação e Estratégia
                            </p>
                        </div>

                        <!-- Main Content Box -->
                        <div style="background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.04); text-align: center; border: 1px solid #f1f5f9;">
                            <h2 style="color: #13293d; font-size: 24px; margin-top: 0; font-weight: 800;">Olá, ${nome}!</h2>
                            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                                Seu diagnóstico financeiro foi processado em nossa plataforma. Avaliamos a forma como sua empresa lê números, toma decisões e executa a rotina gerencial.
                            </p>
                            
                            <!-- Score Highlight -->
                            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 30px 20px; border-radius: 12px; margin-bottom: 30px;">
                                <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 10px 0; font-weight: bold;">
                                    Pontuação Final
                                </p>
                                <p style="font-size: 48px; color: #f84f08; font-weight: 900; margin: 0; line-height: 1; letter-spacing: -2px;">
                                    ${score}<span style="font-size: 20px; color: #94a3b8; font-weight: 600; letter-spacing: 0;">/40</span>
                                </p>
                                <p style="margin: 12px 0 0 0; font-size: 14px; color: #10b981; font-weight: 700;">
                                    Equivalente a ${scorePercent}% da eficiência máxima
                                </p>
                            </div>

                            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                                A nota isolada conta apenas um pedaço da história. Detalhamos os seus maiores <strong>riscos operacionais</strong> e as <strong>oportunidades financeiras invisíveis</strong> em um mapa completo.
                            </p>

                            <!-- CTA Buttons -->
                            <div style="margin-top: 20px;">
                                <div style="margin-bottom: 16px;">
                                    <a href="${linkResultado}" style="background-color: #13293d; color: #ffffff; padding: 18px 24px; text-decoration: none; border-radius: 8px; display: block; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px rgba(19, 41, 61, 0.2);">
                                        📊 Visualizar Diagnóstico Completo
                                    </a>
                                </div>
                                
                                <div>
                                    <a href="https://wa.me/${numeroWhatsApp}?text=${msgWhatsapp}" style="background-color: #fff4f0; color: #f84f08; border: 2px solid #f84f08; padding: 16px 24px; text-decoration: none; border-radius: 8px; display: block; font-weight: bold; font-size: 15px;">
                                        💬 Agendar Sessão Estratégica
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="text-align: center; margin-top: 40px;">
                            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 12px; font-weight: 500;">Acompanhe a Cluster nas redes</p>
                            <div style="margin-bottom: 24px;">
                                <a href="https://instagram.com/clusterconsultores" style="color: #13293d; text-decoration: none; margin: 0 12px; font-weight: bold; font-size: 14px;">
                                    <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="24" height="24" style="display: inline-block; border: none; outline: none;">
                                </a>
                                <span style="color: #cbd5e1;">|</span>
                                <a href="https://clustersolucoes.com" style="color: #13293d; text-decoration: none; margin: 0 12px; font-weight: bold; font-size: 14px;">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" width="24" height="24" style="display: inline-block; border: none; outline: none;">
                                </a>
                            </div>
                            <p style="color: #cbd5e1; font-size: 12px; margin: 0;">
                                © ${new Date().getFullYear()} Cluster Soluções Empresariais. Todos os direitos reservados.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        try {
            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "api-key": process.env.BREVO_API_KEY as string,
                },
                body: JSON.stringify(brevoPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erro no envio pelo Brevo:", errorData);
            }
        } catch (err) {
            console.error("Falha ao comunicar com a api do Brevo", err);
        }
    }
}