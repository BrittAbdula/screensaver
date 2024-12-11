import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  try {
    const tokenData = await getSpotifyAccessToken(code)
    return NextResponse.json(tokenData)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get access token ' + error }, { status: 500 })
  }
}

async function getSpotifyAccessToken(code: string) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'https://screensaver-lyart.vercel.app/callback',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get access token')
  }

  return response.json()
}