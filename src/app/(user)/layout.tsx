import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { SessionProvider } from "@/components/session-provider";
import { ModeToggle } from "@/components/mode-toggle";

export default async function UserLayout({
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

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    businessName: (session.user as { businessName?: string }).businessName,
  };

  return (
    <SessionProvider user={user}>
      <div className="bg-background flex min-h-svh flex-col">
        <header className="border-b">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="CRUMBS" width={32} height={32} />
              <span className="text-xl font-bold">CRUMBS</span>
            </Link>
            <div className="flex items-center gap-2">
              <LogoutButton />
              <ModeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 py-8">
          <div className="mx-auto max-w-6xl px-4">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}
