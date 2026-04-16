import { AppSidebar } from '@/components/dashboard/Sidebar';
import { SiteHeader } from '@/components/dashboard/dashboard-header';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // MOCK DE AUTENTICAÇÃO
  // Para testar a visão do aluno, basta trocar 'mentor' para 'mentee' e salvar o arquivo.


  // Mock provisório do usuário logado
  const mockUser = {
    name: "João Silva",
    email: "joao@exemplo.com",
    avatar: "https://github.com/shadcn.png"
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
        <AppSidebar user={mockUser} />

        <div className="flex flex-col flex-1 overflow-hidden">
          <SiteHeader />

          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
