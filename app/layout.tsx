import type { Metadata } from "next"
import { Bricolage_Grotesque, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

// Display font for headings and dashboard titles
const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "700"],  // Extreme weight contrast
  display: "swap",
})

// Body font for paragraphs and UI text - Using DM Sans (clean, modern alternative to Geist)
const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Hypelive Dashboard - KOL Campaign Management",
  description: "Comprehensive dashboard for managing KOL campaigns, content creation, and analytics",
  keywords: ["KOL", "influencer marketing", "campaign management", "analytics", "content creation"],
  authors: [{ name: "Hypelive Team" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${displayFont.variable} ${bodyFont.variable} font-body antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}