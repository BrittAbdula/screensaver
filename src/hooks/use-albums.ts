"use client"

import { useState, useEffect } from 'react'
import type { Album } from '@/types/album'

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

interface CacheEntry {
  data: Album[]
  timestamp: number
}

export function useTrendingAlbums(market: string) {
  const [albums, setAlbums] = useState<Album[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(`albums-${market}`)
        if (cached) {
          const { data, timestamp }: CacheEntry = JSON.parse(cached)
          const now = Date.now()
          
          // If cache is still valid, use it
          if (now - timestamp < CACHE_DURATION) {
            setAlbums(data)
            setIsLoading(false)
            return
          }
        }

        // Fetch fresh data
        const response = await fetch(`/api/albums?market=${market}`)
        if (!response.ok) {
          throw new Error('Failed to fetch albums')
        }
        
        const data = await response.json()
        
        // Update cache
        const cacheEntry: CacheEntry = {
          data,
          timestamp: Date.now()
        }
        localStorage.setItem(`albums-${market}`, JSON.stringify(cacheEntry))
        
        setAlbums(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlbums()
  }, [market])

  return { albums, isLoading, error }
}
