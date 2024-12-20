"use client"

import { useEffect, useState, useRef } from "react"
import { AlbumGrid } from "@/components/album-grid"
import { Loader2 } from "lucide-react"
import { useGalleryAlbums } from "@/hooks/use-gallery-albums"
import { Maximize2, Minimize2 } from "lucide-react"

export default function ScreenSaver() {
  const { galleryAlbums, columns, showInfo, flipDelay, isLoading } = useGalleryAlbums()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isControlsVisible, setIsControlsVisible] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes('mac'))
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = () => {
      setIsControlsVisible(true)
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      if (isFullscreen) {
        controlsTimeoutRef.current = setTimeout(() => {
          setIsControlsVisible(false)
        }, 2000)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isFullscreen])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenNow = !!document.fullscreenElement
      setIsFullscreen(isFullscreenNow)
      setIsControlsVisible(!isFullscreenNow)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <main className={`flex-1 ${
      isFullscreen 
        ? '-mt-14 h-screen overflow-hidden' 
        : ''
    }`}>
      <button
        onClick={toggleFullscreen}
        className={`fixed bottom-4 right-4 flex items-center space-x-2 px-4 py-1.5 bg-primary/90 hover:bg-primary text-primary-foreground text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105 z-50 ${
          isFullscreen && !isControlsVisible ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {isFullscreen ? (
          <>
            <Minimize2 className="w-4 h-4" />
            <span>Exit Fullscreen</span>
          </>
        ) : (
          <>
            <Maximize2 className="w-4 h-4" />
            <span>Enter Fullscreen</span>
          </>
        )}
      </button>
      
      <AlbumGrid 
        initialAlbums={galleryAlbums} 
        columns={columns} 
        showInfo={showInfo}
        flipDelay={flipDelay}
      />
    </main>
  )
}
