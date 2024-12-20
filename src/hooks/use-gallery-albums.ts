"use client"

import { useState, useEffect } from 'react'
import type { Album } from '@/types/album'

const STORAGE_KEYS = {
  ALBUMS: 'galleryAlbums',
  COLUMNS: 'galleryColumns',
  SHOW_INFO: 'galleryShowInfo',
  FLIP_DELAY: 'galleryFlipDelay'
} as const

export function useGalleryAlbums() {
  const [galleryAlbums, setGalleryAlbums] = useState<Album[]>([])
  const [columns, setColumns] = useState(6)
  const [showInfo, setShowInfo] = useState(true)
  const [flipDelay, setFlipDelay] = useState(2000)
  const [isLoading, setIsLoading] = useState(true)

  // Load albums and settings from localStorage
  useEffect(() => {
    const savedAlbums = localStorage.getItem(STORAGE_KEYS.ALBUMS)
    const savedColumns = localStorage.getItem(STORAGE_KEYS.COLUMNS)
    const savedShowInfo = localStorage.getItem(STORAGE_KEYS.SHOW_INFO)
    const savedFlipDelay = localStorage.getItem(STORAGE_KEYS.FLIP_DELAY)

    if (savedAlbums) {
      setGalleryAlbums(JSON.parse(savedAlbums))
    }
    if (savedColumns) {
      setColumns(parseInt(savedColumns, 10))
    }
    if (savedShowInfo) {
      setShowInfo(savedShowInfo === 'true')
    }
    if (savedFlipDelay) {
      setFlipDelay(parseInt(savedFlipDelay, 10))
    }
    setIsLoading(false)
  }, [])

  const updateGalleryAlbums = (albums: Album[]) => {
    setGalleryAlbums(albums)
    localStorage.setItem(STORAGE_KEYS.ALBUMS, JSON.stringify(albums))
  }

  const updateColumns = (newColumns: number) => {
    setColumns(newColumns)
    localStorage.setItem(STORAGE_KEYS.COLUMNS, newColumns.toString())
  }

  const updateShowInfo = (show: boolean) => {
    setShowInfo(show)
    localStorage.setItem(STORAGE_KEYS.SHOW_INFO, show.toString())
  }

  const updateFlipDelay = (delay: number) => {
    setFlipDelay(delay)
    localStorage.setItem(STORAGE_KEYS.FLIP_DELAY, delay.toString())
  }

  return {
    galleryAlbums,
    columns,
    showInfo,
    flipDelay,
    isLoading,
    updateGalleryAlbums,
    updateColumns,
    updateShowInfo,
    updateFlipDelay
  }
}
