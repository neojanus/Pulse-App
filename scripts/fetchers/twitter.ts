import type { RawNewsItem, TwitterAccount } from '../types';

/**
 * Twitter/X Fetcher
 *
 * NOTE: Twitter's API is expensive ($100/month minimum for basic access).
 * This file provides a placeholder implementation.
 *
 * Options for implementation:
 * 1. Use Twitter API v2 (requires paid access)
 * 2. Use Nitter instances for scraping (free but unreliable)
 * 3. Manual curation - add tweets manually to a curated file
 *
 * For now, this returns an empty array. You can:
 * - Implement Nitter scraping
 * - Add manual tweet data
 * - Use a third-party Twitter aggregation service
 */

// Nitter instances that may work (these change frequently)
const NITTER_INSTANCES = [
  'https://nitter.net',
  'https://nitter.privacydev.net',
  'https://nitter.poast.org',
];

/**
 * Attempt to fetch tweets from Nitter (public Twitter mirror)
 * This is unreliable and may break - use as fallback only
 */
export async function fetchTwitterAccount(
  account: TwitterAccount
): Promise<RawNewsItem[]> {
  console.log(`[Twitter] Skipping @${account.handle} (API not configured)`);

  // Nitter scraping is unreliable, so we return empty for now
  // Uncomment below to try Nitter scraping

  /*
  for (const instance of NITTER_INSTANCES) {
    try {
      const url = `${instance}/${account.handle}/rss`;
      const response = await fetch(url, { timeout: 5000 });

      if (response.ok) {
        // Parse RSS feed from Nitter
        // Implementation depends on rss-parser
        console.log(`[Twitter] Found working Nitter instance: ${instance}`);
      }
    } catch {
      continue;
    }
  }
  */

  return [];
}

/**
 * Fetch from all configured Twitter accounts
 */
export async function fetchAllTwitterAccounts(
  accounts: TwitterAccount[]
): Promise<RawNewsItem[]> {
  console.log(`[Twitter] ${accounts.length} accounts configured (fetching disabled)`);

  // For now, Twitter fetching is disabled
  // Enable when you have API access or a working Nitter solution

  return [];
}

/**
 * Manual tweet curation helper
 * Use this to manually add important tweets
 */
export function createManualTweet(
  handle: string,
  text: string,
  url: string,
  category: TwitterAccount['category']
): RawNewsItem {
  return {
    id: `twitter-manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: `@${handle}: ${text.slice(0, 100)}${text.length > 100 ? '...' : ''}`,
    content: text,
    url,
    source: `@${handle}`,
    sourceType: 'twitter',
    category,
    publishedAt: new Date().toISOString(),
    author: handle,
  };
}
