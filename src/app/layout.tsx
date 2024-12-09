import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'Album Screensaver',
  description: 'A beautiful screensaver displaying latest album artworks from Spotify, perfect for ambient displays.',
  keywords: ['screensaver', 'spotify', 'album art', 'music', 'ambient display'],
  authors: [{ name: 'auroroa' }],
  colorScheme: 'dark',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#000000',
  // manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    title: 'Album Screensaver',
    description: 'A beautiful screensaver displaying latest album artworks from Spotify.',
    siteName: 'Album Screensaver',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Album Screensaver Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Album Screensaver',
    description: 'A beautiful screensaver displaying latest album artworks from Spotify.',
    images: ['/x.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
