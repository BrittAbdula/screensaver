'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserSavedAlbums } from '@/lib/spotify'

export default function CallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get('code')

      if (!code) {
        setError('No authorization code received')
        return
      }

      try {
        // Exchange code for access token
        const response = await fetch('/api/spotify/auth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to get access token')
        }

        const { access_token } = await response.json()
        
        // 获取用户专辑并存储在本地
        const albums = await getUserSavedAlbums(access_token)
        localStorage.setItem('spotifyAlbums', JSON.stringify(albums))
        
        // 重定向回主页
        router.push('/')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    }

    handleCallback()
  }, [router])

  if (error) {
    return <div>Error: {error}</div>
  }

  return <div>Loading...</div>
}