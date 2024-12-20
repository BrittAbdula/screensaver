import { getNewReleases } from "@/lib/spotify"
import { getMarketFromLanguage } from "@/lib/utils"
import { NextRequest, NextResponse } from 'next/server'
import { getCachedData } from "@/lib/cache"

export async function GET(request: NextRequest) {
  try {
    const headersList = request.headers
    const acceptLanguage = headersList.get('accept-language')
    const market = getMarketFromLanguage(acceptLanguage)
    
    const albums = await getCachedData(
      `albums-${market}`,
      () => getNewReleases(market)
    )
    
    return NextResponse.json(albums)
  } catch (error) {
    console.error('Failed to fetch albums:', error)
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 })
  }
}
