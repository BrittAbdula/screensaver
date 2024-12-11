"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { getSpotifyAuthUrl } from '@/lib/spotify'

interface Album {
  id: string
  title: string
  artist: string
  cover: string
  spotifyUrl: string
  addedAt?: string
}

interface AlbumGridProps {
  initialAlbums: Album[]
}

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
}

export function AlbumGrid({ initialAlbums }: AlbumGridProps) {
  const [flippedAlbums, setFlippedAlbums] = useState<string[]>([])
  const [flipDirections, setFlipDirections] = useState<Record<string, number>>({})
  const [backAlbums, setBackAlbums] = useState<Record<string, Album>>({})
  const [visibleAlbums, setVisibleAlbums] = useState<Album[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const [userAlbums, setUserAlbums] = useState<Album[]>([])

  // Load user albums from localStorage
  useEffect(() => {
    const savedAlbums = localStorage.getItem('spotifyAlbums')
    if (savedAlbums) {
      const albums = JSON.parse(savedAlbums)
      setUserAlbums(albums)
      setVisibleAlbums(albums) // Use user albums if available
    }
  }, [])

  // Detect OS after component mounts
  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes('mac'))
  }, [])

  const getRandomAlbum = (excludeId: string) => {
    const sourceAlbums = userAlbums.length ? userAlbums : initialAlbums
    const availableAlbums = sourceAlbums.filter(a => a.id !== excludeId)
    return availableAlbums[Math.floor(Math.random() * availableAlbums.length)]
  }

  // Calculate number of albums to show based on screen size
  useEffect(() => {
    const calculateVisibleAlbums = () => {
      const screenHeight = window.innerHeight
      const screenWidth = window.innerWidth

      let columns = 2
      if (screenWidth >= 1280) columns = 6
      else if (screenWidth >= 1024) columns = 4
      else if (screenWidth >= 768) columns = 3

      const albumSize = screenWidth / columns
      const rows = Math.ceil(screenHeight / albumSize)
      const totalAlbums = rows * columns

      const sourceAlbums = userAlbums.length ? userAlbums : initialAlbums
      const shuffled = [...sourceAlbums].sort(() => 0.5 - Math.random())
      setVisibleAlbums(shuffled.slice(0, totalAlbums))
    }

    calculateVisibleAlbums()
    window.addEventListener('resize', calculateVisibleAlbums)
    return () => window.removeEventListener('resize', calculateVisibleAlbums)
  }, [initialAlbums, userAlbums])

  // Flip animation logic
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

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenNow = !!(
        document.fullscreenElement ||
        (document as FullscreenDocument).webkitFullscreenElement ||
        (document as FullscreenDocument).mozFullScreenElement ||
        (document as FullscreenDocument).msFullscreenElement
      );
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isMac && e.shiftKey && e.metaKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
      else if (!isMac && e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isMac]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl()
  }

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
                      onClick={() => {
                        const targetAlbum = flippedAlbums.includes(album.id) && backAlbum
                          ? backAlbum
                          : album
                        window.open(targetAlbum.spotifyUrl, '_blank')
                      }}
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
        className={`fixed bottom-0 left-0 right-0 p-4 text-center bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4">
          {/* 左侧的全屏提示 */}
          <div 
            className="text-white/50 text-sm cursor-pointer"
            onClick={toggleFullscreen}
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
          </div>

          {/* 右侧的 Spotify 连接按钮 */}
          {!userAlbums.length && (
            <button
              onClick={handleLogin}
              className="flex items-center space-x-2 px-4 py-1.5 bg-[#1DB954] bg-opacity-90 hover:bg-opacity-100 text-white text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <svg 
                className="w-4 h-4" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span>Connect Spotify</span>
            </button>
          )}
        </div>
        <span className="hidden">{isFullscreen ? 'Fullscreen' : 'Not Fullscreen'}</span>
      </footer>
    </div>
  )
}