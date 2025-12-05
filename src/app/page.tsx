import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="w-full px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="CRUMBS Logo"
              width={40}
              height={40}
              priority
            />
            <span className="text-foreground text-lg font-bold sm:text-xl">
              CRUMBS
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <Image
          src="/logo.svg"
          alt="CRUMBS Logo"
          width={120}
          height={120}
          className="mb-6"
        />
        <h1 className="text-foreground max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          AI-Assisted Costing, Pricing & Recipe Management for Food Businesses
        </h1>
        <p className="text-muted-foreground mt-4 max-w-lg text-lg">
          Manage your inventory, create recipes with auto-calculated costs, and
          track production — all in one place.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </main>

      <footer className="text-muted-foreground py-6 text-center text-sm">
        © {new Date().getFullYear()} CRUMBS. All rights reserved.
      </footer>
    </div>
  );
}
