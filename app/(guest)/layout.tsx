// Force dynamic rendering for guest pages with theme support
export const dynamic = "force-dynamic";

export default function GuestLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
