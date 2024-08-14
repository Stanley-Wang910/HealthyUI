export type VideoType = {
  id: string
  title: string
  thumbnail: string
  'channel-thumbnail': string
  author: string
  date: string
  youtubeStatistics: {
    commentCount: string
    dislikeCount: number
    favoriteCount: string
    likeCount: string
    viewCount: string
  }
  huiMeta: {
    spectrum_calc: number
    title: string
    placeholder: string
    description: string
  }
}
