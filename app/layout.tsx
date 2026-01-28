import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

// Configure fonts with error handling
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
  preload: true,
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: true,
  preload: true,
})

export const metadata: Metadata = {
  title: "NexLive - Enterprise Streaming. Fully Sovereign.",
  description: "Premium OTT platform for governments, broadcasters, and enterprises",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
