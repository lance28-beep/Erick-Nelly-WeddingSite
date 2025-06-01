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
  description: "Join us for our special day - May 6, 2025. Celebrate the union of Eric and Nelly in a beautiful ceremony filled with love and joy.",
  keywords: ["wedding", "Eric", "Nelly", "wedding invitation", "May 6 2025", "celebration"],
  authors: [{ name: "Eric & Nelly" }],
  creator: "Eric & Nelly",
  publisher: "Eric & Nelly",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon_io/favicon.ico',
    apple: '/favicon_io/apple-touch-icon.png',
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/favicon_io/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/favicon_io/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/favicon_io/site.webmanifest',
  openGraph: {
    title: "Eric & Nelly Wedding",
    description: "Join us for our special day - May 6, 2025. Celebrate the union of Eric and Nelly in a beautiful ceremony filled with love and joy.",
    type: "website",
    locale: "en_US",
    siteName: "Eric & Nelly Wedding",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eric & Nelly Wedding",
    description: "Join us for our special day - May 6, 2025",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-site-verification", // Replace with your actual verification code
  },
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
