import type { BriefingCategory } from '../types/briefing';

/**
 * Raw news item fetched from a source before AI processing
 */
export interface RawNewsItem {
  id: string;
  title: string;
  content: string;
  url: string;
  source: string;
  sourceType: 'rss' | 'reddit' | 'twitter' | 'hackernews' | 'bluesky';
  category: BriefingCategory;
  publishedAt: string;
  author?: string;
}

/**
 * Twitter/X account configuration
 */
export interface TwitterAccount {
  handle: string;
  category: BriefingCategory;
}

/**
 * Reddit subreddit configuration
 */
export interface RedditSubreddit {
  name: string;
  category: BriefingCategory;
  limit: number;
}

/**
 * RSS feed configuration
 */
export interface RSSFeed {
  url: string;
  name: string;
  category: BriefingCategory;
}

/**
 * HackerNews configuration
 */
export interface HackerNewsConfig {
  enabled: boolean;
  queries: string[];
  minPoints: number;
  limit: number;
  category: BriefingCategory;
}

/**
 * Bluesky account configuration
 */
export interface BlueskyAccount {
  handle: string;
  category: BriefingCategory;
}

/**
 * All sources configuration
 */
export interface SourcesConfig {
  twitter: {
    enabled: boolean;
    accounts: TwitterAccount[];
  };
  reddit: {
    enabled: boolean;
    subreddits: RedditSubreddit[];
  };
  rss: {
    enabled: boolean;
    feeds: RSSFeed[];
  };
  hackernews: HackerNewsConfig;
  bluesky: {
    enabled: boolean;
    accounts: BlueskyAccount[];
  };
}
