import { DM_Sans } from "next/font/google";
import "./globals.scss";
import Providers from "@/components/providers";
import type { Metadata, Viewport } from "next";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true
});

export const metadata: Metadata = {
  title: {
    default: "Hypelive Dashboard - KOL Discovery Platform",
    template: "%s | Hypelive Dashboard"
  },
  description: "Discover and manage TikTok influencers with data-driven insights. Advanced KOL discovery platform with AI-powered search and analytics.",
  keywords: ["KOL", "influencer", "TikTok", "marketing", "analytics", "dashboard"],
  authors: [{ name: "Hypelive" }],
  creator: "Hypelive",
  publisher: "Hypelive",
  formatDetection: {
    telephone: false,
    email: false,
    address: false
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://dashboard.hypelive.studio"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Hypelive Dashboard",
    title: "Hypelive Dashboard - KOL Discovery Platform",
    description: "Discover and manage TikTok influencers with data-driven insights",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hypelive Dashboard"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Hypelive Dashboard - KOL Discovery Platform",
    description: "Discover and manage TikTok influencers with data-driven insights",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={dmSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
