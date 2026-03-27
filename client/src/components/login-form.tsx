"use client";

import { useActionState, useState } from "react"
import { loginAction, checkEmailAction, setupPasswordAction } from "@/actions/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [step, setStep] = useState<"email" | "login" | "setup">("email");
    const [emailCache, setEmailCache] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [loginState, loginActionRef, loginPending] = useActionState(loginAction, null);
    const [setupState, setupActionRef, setupPending] = useActionState(setupPasswordAction, null);

    const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEmailError("");
        setIsLoading(true);
        const email = new FormData(e.currentTarget).get("email") as string;
        
        const result = await checkEmailAction(email);
        setIsLoading(false);

        if (result.error) {
            setEmailError(result.error);
            return;
        }

        setEmailCache(email);
        if (result.isFirstAccess) {
            setStep("setup");
        } else {
            setStep("login");
        }
    };

    if (step === "email") {
        return (
            <form onSubmit={handleEmailSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
                <FieldGroup>
                    {emailError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md text-center">
                            {emailError}
                        </div>
                    )}
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h1 className="text-2xl font-bold">Acesse Nosso Ecossistema</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            Digite seu e-mail para continuar
                        </p>
                    </div>
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input id="email" name="email" type="email" defaultValue={emailCache} placeholder="m@example.com" required autoFocus />
                    </Field>
                    <Field>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Verificando..." : "Continuar"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        )
    }

    if (step === "login") {
        return (
            <form action={loginActionRef} className={cn("flex flex-col gap-6", className)} {...props}>
                <FieldGroup>
                    {loginState?.error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md text-center">
                            {loginState.error}
                        </div>
                    )}
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {emailCache}
                        </p>
                    </div>
                    <input type="hidden" name="email" value={emailCache} />
                    <Field>
                        <div className="flex items-center">
                            <FieldLabel htmlFor="password">Senha</FieldLabel>
                            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                                Esqueci minha senha?
                            </a>
                        </div>
                        <Input id="password" name="password" type="password" required autoFocus />
                    </Field>
                    <Field>
                        <Button type="submit" disabled={loginPending}>
                            {loginPending ? "Entrando..." : "Login"}
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => setStep("email")} className="mt-2 text-xs">
                            Entrar com outra conta
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        )
    }

    // step === "setup"
    return (
        <form action={setupActionRef} className={cn("flex flex-col gap-6", className)} {...props}>
            <FieldGroup>
                {setupState?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md text-center">
                        {setupState.error}
                    </div>
                )}
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Quase lá!</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Crie uma senha para o primeiro acesso de <br/><span className="font-semibold">{emailCache}</span>
                    </p>
                </div>
                <input type="hidden" name="email" value={emailCache} />
                <Field>
                    <FieldLabel htmlFor="password">Nova Senha</FieldLabel>
                    <Input id="password" name="password" type="password" required autoFocus minLength={6} />
                </Field>
                <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirmar nova senha</FieldLabel>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} />
                </Field>
                <Field>
                    <Button type="submit" disabled={setupPending}>
                        {setupPending ? "Salvando..." : "Salvar Senha e Entrar"}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setStep("email")} className="mt-2 text-xs">
                        Voltar
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
