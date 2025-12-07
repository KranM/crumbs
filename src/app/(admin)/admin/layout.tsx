import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SessionProvider } from "@/components/session-provider";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar, adminNavItems } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarBreadcrumb } from "@/components/sidebar-breadcrumb";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    businessName: session.user.businessName,
    image: session.user.image,
    role: session.user.role,
  };

  return (
    <SessionProvider user={user}>
      <SidebarProvider>
        <AppSidebar navItems={adminNavItems} />
        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <SidebarBreadcrumb />
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
