import type React from "react"
import type { Metadata } from "next"
import { Great_Vibes, Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
})

export const metadata: Metadata = {
  title: "Eric & Nelly Wedding",
  description: "Join us for our special day - May 6, 2025",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${greatVibes.variable}`}>{children}</body>
    </html>
  )
}
