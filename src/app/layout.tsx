import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/header";
import {cn} from "@/lib/utils";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
}

export const metadata: Metadata = {
  title: 'FlipVerse',
  description: 'A beautiful digital art gallery that brings your favorite album artworks to life. Perfect for ambient displays and creating immersive visual experiences.',
  keywords: ['flipverse', 'flip-verse', 'digital art', 'gallery', 'album art', 'ambient display', 'screensaver', 'visual experience'],
  authors: [{ name: 'FlipVerse Team' }],
  metadataBase: new URL('https://flip-verse.com'),
  openGraph: {
    title: 'FlipVerse - Digital Art Gallery',
    description: 'Transform your screen into a living art gallery with FlipVerse',
    url: 'https://flip-verse.com',
    siteName: 'FlipVerse',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlipVerse - Digital Art Gallery',
    description: 'Transform your screen into a living art gallery with FlipVerse',
    creator: '@flipverse',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  category: 'technology'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased overflow-x-hidden",
        geistSans.variable
      )}>
        <div className="relative flex min-h-screen flex-col">
          <Header />          
          <div className="flex-1 pt-14">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
