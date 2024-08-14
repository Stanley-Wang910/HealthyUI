import { Query } from "@tanstack/react-query";

export type VideoType = {
  [videoId: string]: {
    items: Array<{
      id: string;
      snippet: {
        categoryId: string;
        channelId: string;
        channelTitle: string;
        description: string;
        publishedAt: string;
        tags: string[] | null;
        thumbnails: {
          default: {
            height: number;
            url: string;
            width: number;
          };
          high: {
            height: number;
            url: string;
            width: number;
          };
          maxres: {
            height: number;
            url: string;
            width: number;
          };
          medium: {
            height: number;
            url: string;
            width: number;
          };
          standard: {
            height: number;
            url: string;
            width: number;
          };
        };
        title: string;
      };
      statistics: {
        commentCount: string;
        dislikeCount: number;
        favoriteCount: string;
        likeCount: string;
        viewCount: string;
      };
      topicDetails?: {
        topicCategories: string[];
      };
    }>;
  };
}


export type FackCheckResponse = {
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