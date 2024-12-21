// import { getCachedData } from './cache'

const getAccessToken = async () => {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    throw new Error('Missing Spotify credentials in environment variables')
  }

  const refresh_token = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64')

//   console.log('Requesting access token...')
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${refresh_token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get access token: ${response.status} ${response.statusText}\n${errorText}`)
  }

  const tokenData = await response.json()
  return tokenData
}

interface SpotifyAlbum {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
  artists: Array<{
    name: string;
  }>;
  images: Array<{
    url: string;
  }>;
}

// 生成默认专辑数据
const generateDefaultAlbums = async (market: string) => {
  const defaultPlaylists = [
    { id: '37i9dQZEVXbNG2KDcFcKOF', name: 'Top 50 Global' },
    { id: '37i9dQZF1DX4JAvHpjipBk', name: 'New Music Friday' },
    { id: '37i9dQZF1DX0XUsuxWHRQd', name: 'RapCaviar' },
    { id: '37i9dQZF1DX4dyzvuaRJ0n', name: 'Electronic/Dance' },
  ]

  try {
    const tokenData = await getAccessToken()
    const playlistPromises = defaultPlaylists.map(async (playlist) => {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlist.id}`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch playlist ${playlist.name}`)
      }

      const data = await response.json()
      return {
        id: data.id,
        title: data.name,
        artist: 'Spotify',
        cover: data.images[0].url,
        spotifyUrl: `https://open.spotify.com/playlist/${data.id}`,
      }
    })

    return await Promise.all(playlistPromises)
  } catch (error) {
    console.error('Error generating default albums:', error)
    return []
  }
}

export const getNewReleases = async (market: string = 'US') => {
  try {
    const tokenData = await getAccessToken()

    const url = `https://api.spotify.com/v1/browse/new-releases?limit=50&market=${market}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      // 如果获取新发行失败，尝试获取默认专辑
      const defaultAlbums = await generateDefaultAlbums(market)
      if (defaultAlbums.length > 0) {
        return defaultAlbums
      }
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.albums?.items) {
      // 如果没有找到专辑，使用默认专辑
      const defaultAlbums = await generateDefaultAlbums(market)
      if (defaultAlbums.length > 0) {
        return defaultAlbums
      }
      throw new Error('No albums found in response')
    }

    const albums = data.albums.items.map((album: SpotifyAlbum) => ({
      id: album.id,
      title: album.name,
      artist: album.artists[0].name,
      cover: album.images[2].url,
      spotifyUrl: `https://open.spotify.com/album/${album.id}`,
    }))

    // console.log('Processed albums:', albums.map(a => ({ id: a.id, url: a.spotifyUrl })))
    return albums
  } catch (error) {
    console.error('Error fetching new releases:', error)
    // 最后尝试获取默认专辑
    const defaultAlbums = await generateDefaultAlbums(market)
    if (defaultAlbums.length > 0) {
      return defaultAlbums
    }
    throw error
  }
}

export const getUserSavedAlbums = async (accessToken: string) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/albums?limit=50', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user albums')
    }

    const data = await response.json()
    return data.items.map((album: SpotifyAlbum) => ({
      id: album.id,
      title: album.name,
      artist: album.artists[0].name,
      cover: album.images[2].url,
      spotifyUrl: `https://open.spotify.com/album/${album.id}`,
    }))
  } catch (error) {
    console.error('Error fetching user albums:', error)
    return []
  }
}

export const getSpotifyAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: 'https://screensaver-lyart.vercel.app/callback',
    scope: 'user-library-read',
  })

  return `https://accounts.spotify.com/authorize?${params.toString()}`
}