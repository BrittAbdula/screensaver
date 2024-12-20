"use client"

import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { useTrendingAlbums } from "@/hooks/use-albums"
import { Loader2 } from "lucide-react"

export default function Home() {
  const market = typeof window !== 'undefined' 
    ? navigator.language.split('-')[1]?.toUpperCase() || 'US'
    : 'US'
  
  const { albums, isLoading, error } = useTrendingAlbums(market)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error loading albums: {error.message}
      </div>
    )
  }
  
  return (
    <main className="min-h-screen bg-background">
      <HeroSection albums={albums} />
      <FeaturesSection />
    </main>
  )
}