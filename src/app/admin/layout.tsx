import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Home, Calendar, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <h1 className="font-headline text-lg font-bold text-primary">Admin</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={true}>
                <Link href="/admin">
                  <Calendar />
                  Events
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <Home />
                  Back to Site
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-6 bg-background">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger className="md:hidden" />
            <h2 className="text-2xl font-bold text-foreground">Events Dashboard</h2>
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
