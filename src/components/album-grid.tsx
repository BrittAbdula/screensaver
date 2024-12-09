"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface Album {
  id: string
  title: string
  artist: string
  cover: string
  spotifyUrl: string
}

interface AlbumGridProps {
  initialAlbums: Album[]
}

export default function AlbumGrid({ initialAlbums }: AlbumGridProps) {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums)
  const [flippedAlbums, setFlippedAlbums] = useState<string[]>([])
  const [flipDirections, setFlipDirections] = useState<Record<string, number>>({})
  const [backAlbums, setBackAlbums] = useState<Record<string, Album>>({})
  const [visibleAlbums, setVisibleAlbums] = useState<Album[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMac, setIsMac] = useState(false)

  // Detect OS after component mounts
  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes('mac'))
  }, [])

  const getRandomAlbum = (excludeId: string) => {
    const availableAlbums = albums.filter(a => a.id !== excludeId)
    return availableAlbums[Math.floor(Math.random() * availableAlbums.length)]
  }

  // Calculate number of albums to show based on screen size
  useEffect(() => {
    const calculateVisibleAlbums = () => {
      const screenHeight = window.innerHeight
      const screenWidth = window.innerWidth

      // Calculate number of columns based on screen width
      let columns = 2 // default for mobile
      if (screenWidth >= 1280) columns = 6 // xl
      else if (screenWidth >= 1024) columns = 4 // lg
      else if (screenWidth >= 768) columns = 3 // md

      // Calculate number of rows that fit in the screen height
      // Each album is a square, so its height is screenWidth / columns
      const albumSize = screenWidth / columns
      const rows = Math.ceil(screenHeight / albumSize)

      // Calculate total number of albums needed
      const totalAlbums = rows * columns

      // Get random albums from the initial set
      const shuffled = [...albums].sort(() => 0.5 - Math.random())
      setVisibleAlbums(shuffled.slice(0, totalAlbums))
    }

    calculateVisibleAlbums()
    window.addEventListener('resize', calculateVisibleAlbums)
    return () => window.removeEventListener('resize', calculateVisibleAlbums)
  }, [albums])

  useEffect(() => {
    const interval = setInterval(() => {
      const randomAlbum = visibleAlbums[Math.floor(Math.random() * visibleAlbums.length)]
      if (randomAlbum) {
        if (flippedAlbums.includes(randomAlbum.id)) {
          setFlippedAlbums(flippedAlbums.filter(id => id !== randomAlbum.id))
        } else {
          setFlipDirections(prev => ({
            ...prev,
            [randomAlbum.id]: Math.random() < 0.5 ? -180 : 180
          }))
          setBackAlbums(prev => ({
            ...prev,
            [randomAlbum.id]: getRandomAlbum(randomAlbum.id)
          }))
          setFlippedAlbums([...flippedAlbums, randomAlbum.id])
        }
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [visibleAlbums, flippedAlbums])

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenNow = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      console.log('Fullscreen changed:', isFullscreenNow);
      setIsFullscreen(isFullscreenNow);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Mac shortcut: Shift + Command + F
      if (isMac && e.shiftKey && e.metaKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
      // Windows/Linux shortcut: F11
      else if (!isMac && e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isMac]);

  const MotionDiv = motion.div

  return (
    <div className="min-h-screen bg-black">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {visibleAlbums.map((album) => {
          const flipDirection = flipDirections[album.id] || 180
          const backAlbum = backAlbums[album.id]
          return (
            <div key={album.id} className="relative aspect-square">
              <AnimatePresence>
                <MotionDiv
                  initial={false}
                  animate={{
                    rotateY: flippedAlbums.includes(album.id) ? flipDirection : 0,
                  }}
                  transition={{
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const targetAlbum = flippedAlbums.includes(album.id) && backAlbum
                      ? backAlbum
                      : album
                    window.open(targetAlbum.spotifyUrl, '_blank')
                  }}
                >
                  {/* Front of card */}
                  <MotionDiv
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <img
                      src={album.cover}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                  </MotionDiv>

                  {/* Back of card */}
                  <MotionDiv
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      transform: flipDirection === 180 ? 'rotateY(180deg)' : 'rotateY(-180deg)',
                    }}
                  >
                    {backAlbum && (
                      <img
                        src={backAlbum.cover}
                        alt={backAlbum.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </MotionDiv>
                </MotionDiv>
              </AnimatePresence>
            </div>
          )
        })}
      </div>
      <footer 
        className={`fixed bottom-0 left-0 right-0 p-4 text-center text-white/50 text-sm bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={toggleFullscreen}
        style={{ cursor: 'pointer' }}
      >
        {isMac ? (
          <>
            Press <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded-md mx-1">⇧</kbd>
            <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded-md mx-1">⌘</kbd>
            <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded-md mx-1">F</kbd>
          </>
        ) : (
          <>
            Press <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded-md mx-1">F11</kbd>
          </>
        )}
        to enter fullscreen
        <span className="hidden">{isFullscreen ? 'Fullscreen' : 'Not Fullscreen'}</span>
      </footer>
    </div>
  )
}