import { Query } from "@tanstack/react-query";

// export type VideoType = {
//   id: string
//   title: string
//   thumbnail: string
//   'channel-thumbnail': string
//   author: string
//   date: string
//   youtubeStatistics: {
//     commentCount: string
//     dislikeCount: number
//     favoriteCount: string
//     likeCount: string
//     viewCount: string
//   }
//   huiMeta: {
//     spectrum_calc: number
//     title: string
//     placeholder: string
//     description: string
//   }
// }

// left this is in for reference
// however we only need the list of things in 'items'
// as frontend expects a flat list of videos for now
export type YoutubeAPIResType = {
    [videoId: string]: {
        items: VideoType[]
    }
}



export type VideoType = {
  id: string
  snippet: {
    categoryId: string
    channelId: string
    channelTitle: string
    description: string
    publishedAt: string
    tags: string[] | null
    thumbnails: {
      default: {
        height: number
        url: string
        width: number
      }
      high: {
        height: number
        url: string
        width: number
      }
      maxres: {
        height: number
        url: string
        width: number
      }
      medium: {
        height: number
        url: string
        width: number
      }
      standard: {
        height: number
        url: string
        width: number
      }
    }
    title: string
  }
  statistics: {
    commentCount: string
    dislikeCount: number
    favoriteCount: string
    likeCount: string
    viewCount: string
  }
  topicDetails?: {
    topicCategories: string[]
  }
  // keep this for now to illutrate that we might want to add custom meta at some point
  // but most likely spectrum_calc will get added by a new API request by id later
  huiMeta: {
    spectrum_calc: number
    title: string
    placeholder: string
    description: string
  }
}


export type FactCheckResponse = {
  [videoId: string]: VideoFactCheck;
}

export type VideoFactCheck = {
  fact_checks: {
    [query: string]: QueryFactCheck;
  };
  query_strings: string[];
  }

export type QueryFactCheck = {
    claims: Claim[];
    next_page_token: string;
    numer_of_claims: number;
    query: string;
  }

export type Claim = {
  claimDate?: string;
  claimReview: ClaimReview[];
  claimant?: string;
  text: string;
}

export type ClaimReview = {
  name: string;
  reviewDate: string;
  site: string;
  textualRating: string;
  title: string;
  url: string;
}
