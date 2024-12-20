"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Loader2, Smile, Music, TrendingUp, Settings2 } from "lucide-react"
import type { Album } from "@/types/album"
import Image from "next/image"
import { useGalleryAlbums } from "@/hooks/use-gallery-albums"
import { useTrendingAlbums } from "@/hooks/use-albums"
import { useEmojiAlbums } from "@/hooks/use-emoji-albums"

export default function SettingsPage() {
  const [isDragging, setIsDragging] = useState(false)
  const { 
    galleryAlbums, 
    columns,
    updateGalleryAlbums, 
    updateColumns,
    isLoading: isGalleryLoading,
    showInfo,
    updateShowInfo,
    flipDelay,
    updateFlipDelay
  } = useGalleryAlbums()
  
  const { albums: trendingAlbums, isLoading: isTrendingLoading } = useTrendingAlbums(
    typeof window !== 'undefined' 
      ? navigator.language.split('-')[1]?.toUpperCase() || 'US'
      : 'US'
  )

  const [isLoadingEmojis, setIsLoadingEmojis] = useState(false)
  const [isLoadingTrending, setIsLoadingTrending] = useState(false)

  const { generateEmojiAlbums } = useEmojiAlbums()

  // State for settings panels
  const [activePanel, setActivePanel] = useState<'layout' | 'albums' | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    await handleFiles(files)
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      await handleFiles(files)
    }
  }

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    const newAlbums: Album[] = await Promise.all(
      imageFiles.map(async (file) => {
        const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const imageUrl = URL.createObjectURL(file)
        
        return {
          id,
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "Custom Upload",
          cover: imageUrl,
          isCustom: true,
          addedAt: new Date().toISOString()
        }
      })
    )

    const updatedAlbums = [...newAlbums, ...galleryAlbums]
    updateGalleryAlbums(updatedAlbums)
  }

  const removeAlbum = (id: string) => {
    const newAlbums = galleryAlbums.filter(album => album.id !== id)
    updateGalleryAlbums(newAlbums)
  }

  const resetToTrending = async () => {
    setIsLoadingTrending(true)
    updateGalleryAlbums(trendingAlbums)
    setIsLoadingTrending(false)
  }

  const resetToEmojis = async () => {
    setIsLoadingEmojis(true)
    const newEmojiAlbums = generateEmojiAlbums()
    updateGalleryAlbums(newEmojiAlbums)
    setIsLoadingEmojis(false)
  }

  if (isGalleryLoading || isTrendingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative pb-[300px]">
      {/* Preview Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Gallery Settings</h1>
          <Settings2 className="w-8 h-8 text-muted-foreground" />
        </div>

        {/* Preview Grid */}
        <div className="bg-card rounded-lg p-6">
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: 0,
            overflow: 'hidden',
            borderRadius: '0.5rem'
          }}>
            {/* Upload Area - First Grid Item */}
            <div className="aspect-square relative group">
              <div
                className={`absolute inset-0 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
                  isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/5'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 mb-2 text-muted-foreground group-hover:text-primary/80 transition-colors" />
                <p className="text-xs text-muted-foreground text-center px-2 group-hover:text-primary/80 transition-colors">
                  Drop images here<br />or click to upload
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="absolute inset-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Album Grid */}
            {galleryAlbums.slice(0, columns * 3 - 1).map((album) => (
              <motion.div
                key={album.id}
                layout
                className="relative group aspect-square"
              >
                <Image
                  src={album.cover}
                  alt={album.title}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeAlbum(album.id)}
                  className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                >
                  <X className="w-4 h-4" />
                </button>
                {showInfo && (
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-sm font-medium text-white truncate">{album.title}</p>
                    <p className="text-xs text-white/80 truncate">{album.artist}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Settings Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-background">
        {/* Settings Content */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: 20 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border"
            >
              <div className="container mx-auto">
                <div className="p-6 space-y-6">
                  {/* Layout Settings */}
                  {activePanel === 'layout' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label htmlFor="columns" className="text-sm font-medium text-muted-foreground">
                              Number of Columns
                            </label>
                            <span className="text-sm text-muted-foreground">{columns}</span>
                          </div>
                          <input
                            type="range"
                            id="columns"
                            min="2"
                            max="8"
                            value={columns}
                            onChange={(e) => updateColumns(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>2</span>
                            <span>8</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label htmlFor="flip-delay" className="text-sm font-medium text-muted-foreground">
                              Flip Delay (seconds)
                            </label>
                            <span className="text-sm text-muted-foreground">{flipDelay / 1000}</span>
                          </div>
                          <input
                            type="range"
                            id="flip-delay"
                            min="1"
                            max="5"
                            step="1"
                            value={flipDelay / 1000}
                            onChange={(e) => updateFlipDelay(parseFloat(e.target.value) * 1000)}
                            className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>1s</span>
                            <span>5s</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <label htmlFor="show-info" className="text-sm font-medium text-muted-foreground">
                          Show Album Information
                        </label>
                        <button
                          id="show-info"
                          onClick={() => updateShowInfo(!showInfo)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                            showInfo ? 'bg-primary' : 'bg-input'
                          }`}
                        >
                          <span
                            className={`${
                              showInfo ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-background transition-transform`}
                          />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Album Sources */}
                  {activePanel === 'albums' && (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={resetToTrending}
                        disabled={isLoadingTrending}
                        className="flex items-center justify-center gap-3 p-4 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
                      >
                        {isLoadingTrending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <TrendingUp className="w-5 h-5" />
                        )}
                        <span>Reset to Trending</span>
                      </button>
                      
                      <button
                        onClick={resetToEmojis}
                        disabled={isLoadingEmojis}
                        className="flex items-center justify-center gap-3 p-4 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
                      >
                        {isLoadingEmojis ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Smile className="w-5 h-5" />
                        )}
                        <span>Reset to Emojis</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Tabs - Always visible at bottom */}
        <div className="container mx-auto border-t border-border">
          <div className="grid grid-cols-2">
            <button
              onClick={() => setActivePanel(activePanel === 'layout' ? null : 'layout')}
              className={`p-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activePanel === 'layout' ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/5'
              }`}
            >
              <Settings2 className="w-4 h-4" />
              Layout Settings
            </button>
            <button
              onClick={() => setActivePanel(activePanel === 'albums' ? null : 'albums')}
              className={`p-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activePanel === 'albums' ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/5'
              }`}
            >
              <Music className="w-4 h-4" />
              Album Sources
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
