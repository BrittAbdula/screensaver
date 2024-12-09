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

export const getNewReleases = async (market: string = 'US') => {
//   return getCachedData(`spotify-new-releases-${market}`, async () => {
    try {
      const tokenData = await getAccessToken()
      // console.log('Got access token:', tokenData.access_token ? 'Yes' : 'No')

      const url = `https://api.spotify.com/v1/browse/new-releases?limit=50&market=${market}`
      // console.log('Fetching new releases from:', url)

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Spotify API error: ${response.status} ${response.statusText}\n${errorText}`)
      }

      const data = await response.json()
      // console.log('Spotify API response:', data)

      if (!data.albums?.items) {
        throw new Error('No albums found in response')
      }
      // console.log('----Spotify API response:', data.albums[0])

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
      return []
    }
//   })
}