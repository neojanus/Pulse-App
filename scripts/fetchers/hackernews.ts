import type { RawNewsItem, HackerNewsConfig } from '../types';

const HN_ALGOLIA_URL = 'https://hn.algolia.com/api/v1/search';

interface HNAlgoliaHit {
  objectID: string;
  title: string;
  url: string | null;
  author: string;
  points: number;
  story_text: string | null;
  created_at: string;
  num_comments: number;
}

interface HNAlgoliaResponse {
  hits: HNAlgoliaHit[];
  nbHits: number;
}

/**
 * Fetch AI-related stories from HackerNews using Algolia API
 */
export async function fetchHackerNews(config: HackerNewsConfig): Promise<RawNewsItem[]> {
  if (!config.enabled) {
    console.log('[HackerNews] Disabled, skipping');
    return [];
  }

  console.log('[HackerNews] Fetching stories for queries:', config.queries);

  const allItems: RawNewsItem[] = [];
  const seenIds = new Set<string>();

  // Fetch stories for each query
  for (const query of config.queries) {
    try {
      // Search for stories from the last 24 hours
      const timestamp24hAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
      const url = `${HN_ALGOLIA_URL}?tags=story&query=${encodeURIComponent(query)}&numericFilters=created_at_i>${timestamp24hAgo},points>${config.minPoints}&hitsPerPage=20`;

      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`[HackerNews] Failed to fetch query "${query}": ${response.status}`);
        continue;
      }

      const data: HNAlgoliaResponse = await response.json();

      for (const hit of data.hits) {
        // Skip if already seen or no URL
        if (seenIds.has(hit.objectID) || !hit.url) {
          continue;
        }
        seenIds.add(hit.objectID);

        const item: RawNewsItem = {
          id: `hn-${hit.objectID}`,
          title: hit.title,
          content: hit.story_text || `${hit.title} - Discussion on HackerNews with ${hit.num_comments} comments and ${hit.points} points.`,
          url: hit.url,
          source: 'HackerNews',
          sourceType: 'hackernews',
          category: config.category,
          publishedAt: hit.created_at,
          author: hit.author,
        };

        allItems.push(item);
      }

      console.log(`[HackerNews] Query "${query}": ${data.hits.length} hits`);
    } catch (error) {
      console.error(`[HackerNews] Error fetching query "${query}":`, error);
    }
  }

  // Sort by points (implicit in the results, but we deduplicated) and limit
  const sortedItems = allItems
    .slice(0, config.limit);

  console.log(`[HackerNews] Total unique items: ${sortedItems.length}`);
  return sortedItems;
}
