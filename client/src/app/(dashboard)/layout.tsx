import { AppSidebar } from '@/components/dashboard/Sidebar';
import { SiteHeader } from '@/components/dashboard/dashboard-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const user = await getUserProfile();
  
  const baseMetadata = {
    icons: {
      icon: '/logomarca.svg',
    },
  };

  if (!user) {
    return {
      ...baseMetadata,
      title: 'Cluster | Inovação & Tecnologia',
      description: 'Cluster | Inovação e Tecnologia',
    };
  }

  const role = (user.role || '').toUpperCase();

  if (role === 'MENTOR') {
    return {
      ...baseMetadata,
      title: 'Cluster | Dashboard do Mentor',
      description: 'Área exclusiva para mentores da Cluster.',
    };
  }

  if (role === 'ALUNO') {
    return {
      ...baseMetadata,
      title: 'Cluster | Dashboard do Aluno',
      description: 'Área exclusiva para alunos da Cluster.',
    };
  }

  return {
    ...baseMetadata,
    title: 'Cluster | Inovação & Tecnologia',
    description: 'Cluster | Inovação e Tecnologia',
  };
}

async function getUserProfile() {
  const token = (await cookies()).get('session')?.value;
  if (!token) return null;

  const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';
  try {
    const res = await fetch(`${apiUrl}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error(`[getUserProfile] Backend retornou status ${res.status} para ${apiUrl}/auth/me`);
      return null;
    }
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("[getUserProfile] Falha ao conectar com o backend:", error instanceof Error ? error.message : error);
    console.error("[getUserProfile] API_URL utilizada:", apiUrl);
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserProfile();

  if (!user) {
    redirect('/login?error=session_expired');
  }

  return (
    <SidebarProvider user={user}>
      <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
        <AppSidebar user={user} />

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
