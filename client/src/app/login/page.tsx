import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cluster | Inovação e Tecnologia',
    description: 'Cluster | Inovação e Tecnologia',
    icons: {
        icon: '/logomarca.svg', // Opcional se você já colocou na raiz
    },
}
export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="/" className="flex items-center gap-2 font-medium">
                        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Cluster.
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:flex lg:items-center lg:justify-center">
                <img
                    src="/logo.svg"
                    alt="Image"
                    className="max-h-[80%] max-w-[80%] object-contain dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
