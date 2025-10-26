"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center space-y-4">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-3xl font-bold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been moved or deleted.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={() => router.back()} variant="outline" className="gap-2">
          <ArrowLeft className="size-4" />
          Go Back
        </Button>
        <Button asChild>
          <Link href="/dashboard/kol-discovery" className="gap-2">
            <Home className="size-4" />
            Go to Dashboard
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/kol-discovery" className="gap-2">
            <Search className="size-4" />
            Search KOLs
          </Link>
        </Button>
      </div>
    </div>
  );
}
