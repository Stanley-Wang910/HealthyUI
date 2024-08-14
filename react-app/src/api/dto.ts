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

// export type VideoType = {
//     [videoId: string]: {
//         items: Array<{
//             id: string;
//             snippet: {
//                 categoryId: string;
//                 channelId: string;
//                 channelTitle: string;
//                 description: string;
//                 publishedAt: string;
//                 tags: string[] | null;
//                 thumbnails: {
//                     default: {
//                         height: number;
//                         url: string;
//                         width: number;
//                     };
//                     high: {
//                         height: number;
//                         url: string;
//                         width: number;
//                     };
//                     maxres: {
//                         height: number;
//                         url: string;
//                         width: number;
//                     };
//                     medium: {
//                         height: number;
//                         url: string;
//                         width: number;
//                     };
//                     standard: {
//                         height: number;
//                         url: string;
//                         width: number;
//                     };
//                 };
//                 title: string;
//             };
//             statistics: {
//                 commentCount: string;
//                 dislikeCount: number;
//                 favoriteCount: string;
//                 likeCount: string;
//                 viewCount: string;
//             };
//             topicDetails?: {
//                 topicCategories: string[];
//             };
//         }>;
//     };
// }