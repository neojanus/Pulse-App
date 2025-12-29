import Parser from 'rss-parser';
import type { RawNewsItem, RSSFeed } from '../types';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Pulse News Aggregator/1.0',
  },
});

/**
 * Fetch news items from an RSS feed
 */
export async function fetchRSSFeed(feed: RSSFeed): Promise<RawNewsItem[]> {
  try {
    console.log(`[RSS] Fetching: ${feed.name} (${feed.url})`);

    const result = await parser.parseURL(feed.url);
    const items: RawNewsItem[] = [];

    // Get the 10 most recent items
    const recentItems = result.items.slice(0, 10);

    for (const item of recentItems) {
      if (!item.title || !item.link) continue;

      // Get content from various possible fields
      const content =
        item.contentSnippet ||
        item.content ||
        item.summary ||
        item.description ||
        '';

      items.push({
        id: `rss-${feed.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: item.title,
        content: cleanHtml(content).slice(0, 2000), // Limit content length
        url: item.link,
        source: feed.name,
        sourceType: 'rss',
        category: feed.category,
        publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
        author: item.creator || item.author || undefined,
      });
    }

    console.log(`[RSS] Found ${items.length} items from ${feed.name}`);
    return items;
  } catch (error) {
    console.error(`[RSS] Error fetching ${feed.name}:`, error);
    return [];
  }
}

/**
 * Fetch from all configured RSS feeds
 */
export async function fetchAllRSSFeeds(feeds: RSSFeed[]): Promise<RawNewsItem[]> {
  const results = await Promise.allSettled(feeds.map((feed) => fetchRSSFeed(feed)));

  const items: RawNewsItem[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      items.push(...result.value);
    }
  }

  console.log(`[RSS] Total: ${items.length} items from ${feeds.length} feeds`);
  return items;
}

/**
 * Simple HTML tag stripper
 */
function cleanHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}
