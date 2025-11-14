/**
 * Guest Layout Configuration
 *
 * Caching Strategy: Next.js 16 Cache Components
 * - Guest pages (login, register) are mostly static HTML/CSS
 * - Content rarely changes (only on design updates)
 * - Cache Components feature provides revolutionary caching automatically
 * - Note: ISR revalidate removed due to conflict with cacheComponents in next.config.ts
 */

export default function GuestLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
