"use client";

import { useActionState } from "react";
import { ArrowLeft } from "lucide-react";
import { forgotPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [state, action, isPending] = useActionState(forgotPasswordAction, null);

    return (
        <form action={action} className="flex flex-col gap-6">
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold text-[#13293d]">Recuperar Senha</h1>
                    <p className="text-sm text-muted-foreground">
                        Digite seu e-mail para receber um link de recuperação
                    </p>
                </div>

                {state?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md text-center">
                        {state.error}
                    </div>
                )}

                {state?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-600 text-sm p-3 rounded-md text-center">
                        {state.message}
                    </div>
                )}

                {!state?.success && (
                    <>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required autoFocus />
                        </Field>
                        <Field>
                            <Button type="submit" disabled={isPending} className="bg-[#f84f08] hover:bg-[#d84407]">
                                {isPending ? "Enviando..." : "Enviar Link de Recuperação"}
                            </Button>
                        </Field>
                    </>
                )}

                <div className="text-center mt-2">
                    <Link href="/login" className="text-sm text-muted-foreground hover:text-[#13293d] flex items-center justify-center gap-2">
                        <ArrowLeft className="size-4" />
                        Voltar para o Login
                    </Link>
                </div>
            </FieldGroup>
        </form>
    );
}
