"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { resetPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [state, action, isPending] = useActionState(resetPasswordAction, null);

    if (!token) {
        return (
            <div className="w-full max-w-xs text-center space-y-4">
                <h1 className="text-2xl font-bold text-red-600">Token Inválido</h1>
                <p className="text-muted-foreground">O link de recuperação parece ser inválido ou expirou.</p>
                <Button asChild className="w-full">
                    <Link href="/forgot-password">Solicitar novo link</Link>
                </Button>
            </div>
        );
    }

    if (state?.success) {
        return (
            <div className="w-full max-w-xs text-center space-y-6">
                <div className="flex justify-center">
                    <CheckCircle2 className="size-16 text-green-500" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-[#13293d]">Senha Redefinida!</h1>
                    <p className="text-muted-foreground">Sua senha foi atualizada com sucesso. Agora você já pode acessar sua conta.</p>
                </div>
                <Button asChild className="w-full bg-[#f84f08] hover:bg-[#d84407]">
                    <Link href="/login">Ir para o Login</Link>
                </Button>
            </div>
        );
    }

    return (
        <form action={action} className="flex flex-col gap-6">
            <input type="hidden" name="token" value={token} />
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold text-[#13293d]">Nova Senha</h1>
                    <p className="text-sm text-muted-foreground">
                        Crie uma nova senha para sua conta
                    </p>
                </div>

                {state?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md text-center">
                        {state.error}
                    </div>
                )}

                <Field>
                    <FieldLabel htmlFor="password">Nova Senha</FieldLabel>
                    <Input id="password" name="password" type="password" required autoFocus minLength={6} />
                </Field>
                <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirmar Nova Senha</FieldLabel>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} />
                </Field>
                <Field>
                    <Button type="submit" disabled={isPending} className="bg-[#f84f08] hover:bg-[#d84407]">
                        {isPending ? "Redefinindo..." : "Redefinir Senha"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f84f08]"></div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
