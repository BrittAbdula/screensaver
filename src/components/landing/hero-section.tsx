"use client"

import { motion } from "framer-motion"
import { AlbumGrid } from "../album-grid"
import Link from "next/link"
import type { Album } from "@/types/album"


interface HeroSectionProps {
  albums: Album[]
}

export function HeroSection({ albums }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden bg-gradient-to-b from-background to-background/80">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          Your Digital Art Gallery
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Transform your screen into a dynamic canvas of album artworks. 
          Create your perfect screensaver with your favorite music albums.
        </p>
        <Link 
          href="/gallery"
          className="inline-flex items-center px-6 py-3 text-lg font-medium text-black bg-primary rounded-full hover:bg-primary/90 transition-colors"
        >
          View Full Gallery
        </Link>
      </motion.div>
      
      <div className="w-full max-w-6xl mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
        <div className="h-[50vh] overflow-hidden">
          <AlbumGrid initialAlbums={albums} />
        </div>
      </div>
    </section>
  )
}
