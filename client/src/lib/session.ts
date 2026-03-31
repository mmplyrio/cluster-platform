import { cookies } from "next/headers";

export type UserSession = {
    userId: string;
    email: string;
    role: "master" | "admin" | "mentor" | "mentorado" | "colaborador" | "user";
    iat: number;
    exp: number;
};

/**
 * Lẽ o token JWT armazenado no cookie `session` e decodifica o Payload em Base64.
 * Como a segurança criptográfica dos endpoints é validada no backend Node (via SECRET),
 * o frontend apenas precisa do payload decifrado para desenhar o layout correto.
 */
export async function verifySession(): Promise<UserSession | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return null;

    try {
        const payloadBase64Url = token.split(".")[1];
        if (!payloadBase64Url) return null;
        
        // Base64Url decode compatible
        const payloadBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(payloadBase64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        
        return JSON.parse(jsonPayload) as UserSession;
    } catch (e) {
        console.error("Falha ao decodificar sessão do Token JWT", e);
        return null;
    }
}
