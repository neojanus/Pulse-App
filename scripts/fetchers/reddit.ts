import type { RawNewsItem, RedditSubreddit } from '../types';

const REDDIT_USER_AGENT = 'Pulse News Aggregator/1.0';

interface RedditPost {
  data: {
    id: string;
    title: string;
    selftext: string;
    url: string;
    permalink: string;
    subreddit: string;
    author: string;
    created_utc: number;
    score: number;
    num_comments: number;
  };
}

interface RedditResponse {
  data: {
    children: RedditPost[];
  };
}

/**
 * Fetch top posts from a subreddit using Reddit's public JSON API
 * (No authentication required for public subreddits)
 */
export async function fetchSubreddit(config: RedditSubreddit): Promise<RawNewsItem[]> {
  try {
    console.log(`[Reddit] Fetching: r/${config.name}`);

    // Use Reddit's public JSON API (no auth needed)
    const url = `https://www.reddit.com/r/${config.name}/hot.json?limit=${config.limit}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': REDDIT_USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: RedditResponse = await response.json();
    const items: RawNewsItem[] = [];

    for (const post of data.data.children) {
      const { data: postData } = post;

      // Skip stickied/pinned posts and posts with very low engagement
      if (postData.score < 10) continue;

      items.push({
        id: `reddit-${postData.id}`,
        title: postData.title,
        content: postData.selftext || `Discussion on r/${postData.subreddit} with ${postData.num_comments} comments`,
        url: postData.url.startsWith('http')
          ? postData.url
          : `https://reddit.com${postData.permalink}`,
        source: `r/${postData.subreddit}`,
        sourceType: 'reddit',
        category: config.category,
        publishedAt: new Date(postData.created_utc * 1000).toISOString(),
        author: postData.author,
      });
    }

    console.log(`[Reddit] Found ${items.length} posts from r/${config.name}`);
    return items;
  } catch (error) {
    console.error(`[Reddit] Error fetching r/${config.name}:`, error);
    return [];
  }
}

/**
 * Fetch from all configured subreddits
 */
export async function fetchAllSubreddits(
  subreddits: RedditSubreddit[]
): Promise<RawNewsItem[]> {
  // Fetch sequentially to avoid rate limiting
  const items: RawNewsItem[] = [];

  for (const subreddit of subreddits) {
    const posts = await fetchSubreddit(subreddit);
    items.push(...posts);

    // Small delay between requests to be nice to Reddit
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(`[Reddit] Total: ${items.length} posts from ${subreddits.length} subreddits`);
  return items;
}
