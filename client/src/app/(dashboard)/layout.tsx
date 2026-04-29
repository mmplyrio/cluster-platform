import { AppSidebar } from '@/components/dashboard/Sidebar';
import { SiteHeader } from '@/components/dashboard/dashboard-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getUserProfile() {
  const token = (await cookies()).get('session')?.value;
  if (!token) return null;

  const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';
  try {
    const res = await fetch(`${apiUrl}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });
    
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
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
    redirect('/login');
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
