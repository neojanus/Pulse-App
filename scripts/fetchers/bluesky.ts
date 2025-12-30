import type { RawNewsItem, BlueskyAccount } from '../types';

/**
 * Bluesky API response types
 */
interface BlueskyPost {
  uri: string;
  cid: string;
  author: {
    handle: string;
    displayName?: string;
  };
  record: {
    text: string;
    createdAt: string;
    embed?: {
      external?: {
        uri: string;
        title?: string;
        description?: string;
      };
    };
  };
  embed?: {
    external?: {
      uri: string;
      title?: string;
      description?: string;
    };
  };
  indexedAt: string;
}

interface BlueskyFeedResponse {
  feed: Array<{
    post: BlueskyPost;
    reason?: unknown;
  }>;
  cursor?: string;
}

// Only include posts from the last 24 hours
const MAX_AGE_HOURS = 24;

/**
 * Check if a post is within the allowed age
 */
function isRecentEnough(dateStr: string): boolean {
  try {
    const postDate = new Date(dateStr);
    const now = new Date();
    const ageMs = now.getTime() - postDate.getTime();
    const ageHours = ageMs / (1000 * 60 * 60);
    return ageHours <= MAX_AGE_HOURS;
  } catch {
    return false;
  }
}

/**
 * Resolve a Bluesky handle to a DID (Decentralized Identifier)
 */
async function resolveDid(handle: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`
    );

    if (!response.ok) {
      console.error(`[Bluesky] Failed to resolve handle ${handle}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.did;
  } catch (error) {
    console.error(`[Bluesky] Error resolving handle ${handle}:`, error);
    return null;
  }
}

/**
 * Fetch posts from a Bluesky account
 */
export async function fetchBlueskyAccount(account: BlueskyAccount): Promise<RawNewsItem[]> {
  try {
    console.log(`[Bluesky] Fetching: @${account.handle}`);

    // Resolve handle to DID
    const did = await resolveDid(account.handle);
    if (!did) {
      console.log(`[Bluesky] Could not resolve handle: ${account.handle}`);
      return [];
    }

    // Fetch author feed
    const response = await fetch(
      `https://bsky.social/xrpc/app.bsky.feed.getAuthorFeed?actor=${did}&limit=20`
    );

    if (!response.ok) {
      console.error(`[Bluesky] Failed to fetch feed for ${account.handle}: ${response.status}`);
      return [];
    }

    const data: BlueskyFeedResponse = await response.json();
    const items: RawNewsItem[] = [];

    for (const { post } of data.feed) {
      // Skip reposts
      if (!post.record || !post.record.text) continue;

      // Filter for recent posts only
      if (!isRecentEnough(post.record.createdAt)) continue;

      const text = post.record.text;

      // Skip very short posts (likely not substantial content)
      if (text.length < 50) continue;

      // Get embedded link if available
      const externalUrl =
        post.embed?.external?.uri || post.record.embed?.external?.uri;
      const externalTitle =
        post.embed?.external?.title || post.record.embed?.external?.title;
      const externalDesc =
        post.embed?.external?.description || post.record.embed?.external?.description;

      // Create a more informative content string
      let content = text;
      if (externalTitle) {
        content += `\n\nLinked: ${externalTitle}`;
      }
      if (externalDesc) {
        content += `\n${externalDesc}`;
      }

      // Create post URL
      const postId = post.uri.split('/').pop();
      const postUrl = externalUrl || `https://bsky.app/profile/${account.handle}/post/${postId}`;

      // Generate a title from the text (first sentence or truncated)
      const title = generateTitle(text, externalTitle);

      items.push({
        id: `bluesky-${account.handle}-${post.cid}`,
        title,
        content: content.slice(0, 2000),
        url: postUrl,
        source: `@${account.handle} (Bluesky)`,
        sourceType: 'bluesky',
        category: account.category,
        publishedAt: post.record.createdAt,
        author: post.author.displayName || account.handle,
      });
    }

    console.log(`[Bluesky] Found ${items.length} recent posts from @${account.handle}`);
    return items;
  } catch (error) {
    console.error(`[Bluesky] Error fetching @${account.handle}:`, error);
    return [];
  }
}

/**
 * Generate a title from post text
 */
function generateTitle(text: string, externalTitle?: string): string {
  // Prefer external link title if available
  if (externalTitle && externalTitle.length > 10) {
    return externalTitle.slice(0, 100);
  }

  // Otherwise, use first sentence or truncate
  const firstSentence = text.split(/[.!?]/)[0];
  if (firstSentence && firstSentence.length > 20 && firstSentence.length < 100) {
    return firstSentence.trim();
  }

  // Truncate to first 100 chars
  return text.slice(0, 100).trim() + (text.length > 100 ? '...' : '');
}

/**
 * Fetch from all configured Bluesky accounts
 */
export async function fetchAllBlueskyAccounts(
  accounts: BlueskyAccount[]
): Promise<RawNewsItem[]> {
  const results = await Promise.allSettled(
    accounts.map((account) => fetchBlueskyAccount(account))
  );

  const items: RawNewsItem[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      items.push(...result.value);
    }
  }

  console.log(`[Bluesky] Total: ${items.length} items from ${accounts.length} accounts`);
  return items;
}
