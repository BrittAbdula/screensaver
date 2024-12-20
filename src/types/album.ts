export interface Album {
  id: string
  title: string
  artist: string
  cover: string
  spotifyUrl?: string
  addedAt?: string
  isCustom?: boolean
}

export interface CustomAlbum extends Album {
  isCustom: true
  file: File | null
}
