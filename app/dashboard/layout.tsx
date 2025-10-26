import MainLayout from "@/components/main-layout";
import { QueryProvider } from "@/lib/providers/query-provider";

// Force dynamic rendering for all dashboard pages
export const dynamic = "force-dynamic";

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <MainLayout>{children}</MainLayout>
    </QueryProvider>
  );
}
