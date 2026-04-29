import { LoginForm } from "@/components/login-form"
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cluster | Login',
    description: 'Acesse o ecossistema Cluster',
}

export default function LoginPage() {
    return <LoginForm />
}
