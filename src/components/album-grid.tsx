"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import type { Album } from "@/types/album"

interface AlbumGridProps {
  initialAlbums: Album[]
  columns?: number
  showInfo?: boolean
  flipDelay?: number
}

export function AlbumGrid({ 
  initialAlbums, 
  columns = 6,
  showInfo = true,
  flipDelay = 2000
}: AlbumGridProps) {
  const [flippedAlbums, setFlippedAlbums] = useState<string[]>([])
  const [flipDirections, setFlipDirections] = useState<Record<string, number>>({})
  const [backAlbums, setBackAlbums] = useState<Record<string, Album>>({})
  const [visibleAlbums, setVisibleAlbums] = useState<Album[]>([])

  const getRandomAlbum = (excludeId: string) => {
    const availableAlbums = initialAlbums.filter(a => a.id !== excludeId)
    return availableAlbums[Math.floor(Math.random() * availableAlbums.length)]
  }

  // Calculate visible albums based on screen size and columns
  useEffect(() => {
    const calculateVisibleAlbums = () => {
      const albumSize = Math.floor(window.innerWidth / columns) // Width per column
      const screenHeight = window.innerHeight
      const rows = Math.ceil(screenHeight / albumSize)
      const totalAlbums = rows * columns

      const shuffled = [...initialAlbums].sort(() => 0.5 - Math.random())
      setVisibleAlbums(shuffled.slice(0, totalAlbums))
    }

    calculateVisibleAlbums()
    window.addEventListener('resize', calculateVisibleAlbums)
    return () => window.removeEventListener('resize', calculateVisibleAlbums)
  }, [initialAlbums, columns])

  // Flip animation logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (visibleAlbums.length === 0) return

      // Randomly select an album to flip
      const unflippedAlbums = visibleAlbums
        .filter(album => !flippedAlbums.includes(album.id))
        .map(album => album.id)

      if (unflippedAlbums.length === 0) {
        // Reset if all albums are flipped
        setFlippedAlbums([])
        setBackAlbums({})
        return
      }

      const albumToFlip = unflippedAlbums[Math.floor(Math.random() * unflippedAlbums.length)]
      
      // Get a random album for the back side
      const backAlbum = getRandomAlbum(albumToFlip)
      
      // Random flip direction (0: X-axis, 1: Y-axis)
      const direction = Math.round(Math.random())
      
      setFlipDirections(prev => ({ ...prev, [albumToFlip]: direction }))
      setBackAlbums(prev => ({ ...prev, [albumToFlip]: backAlbum }))
      setFlippedAlbums(prev => [...prev, albumToFlip])
    }, flipDelay)

    return () => clearInterval(interval)
  }, [visibleAlbums, flippedAlbums, flipDelay])

  const MotionDiv = motion.div

  // Generate grid columns style
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: 0,
    padding: 0,
    background: 'black',
    alignContent: 'start', 
    minHeight: '100vh'
  }

  return (
    <div style={gridStyle}>
      <AnimatePresence>
        {visibleAlbums.map((album) => {
          const isFlipped = flippedAlbums.includes(album.id)
          const flipDirection = flipDirections[album.id]
          const backAlbum = backAlbums[album.id]

          return (
            <MotionDiv
              key={album.id}
              className="relative aspect-square"
              initial={false}
              animate={{
                rotateX: isFlipped && flipDirection === 0 ? 180 : 0,
                rotateY: isFlipped && flipDirection === 1 ? 180 : 0,
              }}
              transition={{ duration: 1 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front side */}
              <MotionDiv
                className="absolute inset-0"
                style={{
                  backfaceVisibility: 'hidden',
                }}
              >
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
                {showInfo && (
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-sm font-medium text-white truncate">{album.title}</p>
                    <p className="text-xs text-white/80 truncate">{album.artist}</p>
                  </div>
                )}
              </MotionDiv>

              {/* Back side */}
              {backAlbum && (
                <MotionDiv
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: `rotate${flipDirection === 0 ? 'X' : 'Y'}(180deg)`,
                  }}
                >
                  <img
                    src={backAlbum.cover}
                    alt={backAlbum.title}
                    className="w-full h-full object-cover"
                  />
                  {showInfo && (
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-sm font-medium text-white truncate">{backAlbum.title}</p>
                      <p className="text-xs text-white/80 truncate">{backAlbum.artist}</p>
                    </div>
                  )}
                </MotionDiv>
              )}
            </MotionDiv>
          )
        })}
      </AnimatePresence>
    </div>
  )
}