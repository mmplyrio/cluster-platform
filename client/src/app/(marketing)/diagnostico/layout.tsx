import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cluster | Inovação e Tecnologia',
    description: 'Cluster | Inovação e Tecnologia',
    icons: {
        icon: '/logomarca.svg',
    },
};

export default function DiagnosticoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
