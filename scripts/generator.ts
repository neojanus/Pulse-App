import * as fs from 'fs';
import * as path from 'path';

import { sources } from './sources';
import {
  fetchAllRSSFeeds,
  fetchAllSubreddits,
  fetchAllTwitterAccounts,
  fetchHackerNews,
  fetchAllBlueskyAccounts,
} from './fetchers';
import { processNewsItems } from './processor';
import type { RawNewsItem } from './types';
import type { Briefing, BriefingItem, BriefingPeriod, DailyBriefings } from '../types/briefing';

// Configuration
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'live', 'briefings.json');
const MAX_ITEMS_PER_BRIEFING = 10;
const MAX_DAYS_TO_KEEP = 7;
const SCRIPT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minute overall timeout

// Set up script-level timeout
const scriptTimeout = setTimeout(() => {
  console.error('\n❌ FATAL: Script exceeded maximum execution time of 5 minutes');
  console.error('This usually means an API is unresponsive. Check DeepSeek status.');
  process.exit(1);
}, SCRIPT_TIMEOUT_MS);

/**
 * Main generator function
 */
async function generate() {
  console.log('='.repeat(60));
  console.log('Pulse Briefing Generator');
  console.log('='.repeat(60));
  console.log(`Started at: ${new Date().toISOString()}`);

  // Check for API key
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error('ERROR: DEEPSEEK_API_KEY environment variable is required');
    process.exit(1);
  }

  // Step 1: Fetch from all sources IN PARALLEL
  console.log('\n📥 Fetching news from sources (parallel)...');

  const fetchPromises: Promise<RawNewsItem[]>[] = [];

  if (sources.rss.enabled) {
    fetchPromises.push(fetchAllRSSFeeds(sources.rss.feeds));
  }
  if (sources.reddit.enabled) {
    fetchPromises.push(fetchAllSubreddits(sources.reddit.subreddits));
  }
  if (sources.twitter.enabled) {
    fetchPromises.push(fetchAllTwitterAccounts(sources.twitter.accounts));
  }
  if (sources.hackernews.enabled) {
    fetchPromises.push(fetchHackerNews(sources.hackernews));
  }
  if (sources.bluesky.enabled) {
    fetchPromises.push(fetchAllBlueskyAccounts(sources.bluesky.accounts));
  }

  const fetchResults = await Promise.all(fetchPromises);
  const rawItems: RawNewsItem[] = fetchResults.flat();

  console.log(`\n📊 Total raw items fetched: ${rawItems.length}`);

  if (rawItems.length === 0) {
    console.error('ERROR: No items fetched. Check source configuration.');
    process.exit(1);
  }

  // Step 2: Deduplicate and sort by recency
  const uniqueItems = deduplicateItems(rawItems);
  console.log(`📊 After deduplication: ${uniqueItems.length} items`);

  // Sort by date (most recent first)
  uniqueItems.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Take only the most recent items for processing
  // Process 15 items max (we only keep 10, so 15 gives buffer for filtering)
  const itemsToProcess = uniqueItems.slice(0, 15);
  console.log(`📊 Processing top ${itemsToProcess.length} items`);

  // Step 3: Process with DeepSeek
  console.log('\n🤖 Processing with DeepSeek AI...');
  const processedItems = await processNewsItems(itemsToProcess, apiKey, {
    batchSize: 15,   // Process all at once
    delayMs: 0,      // No delay needed
  });

  console.log(`\n✅ Processed ${processedItems.length} items successfully`);

  // Step 4: Generate briefings
  console.log('\n📋 Generating briefings...');
  const briefings = generateBriefings(processedItems);

  // Step 5: Load existing data and merge
  const existingData = loadExistingData();
  const mergedData = mergeWithExisting(briefings, existingData);

  // Step 6: Save output
  console.log('\n💾 Saving output...');
  saveOutput(mergedData);

  // Clear script timeout on success
  clearTimeout(scriptTimeout);

  console.log('\n' + '='.repeat(60));
  console.log('✅ Generation complete!');
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log(`Briefings: ${mergedData.length} days`);
  console.log('='.repeat(60));
}

/**
 * Extract key terms from text for similarity comparison
 */
function extractKeyTerms(text: string): Set<string> {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
    'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
    'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above',
    'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here',
    'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'just', 'and', 'but', 'if', 'or',
    'because', 'until', 'while', 'although', 'though', 'after', 'before',
    'new', 'now', 'says', 'said', 'according', 'report', 'reports', 'its',
    'this', 'that', 'these', 'those', 'it', 'they', 'we', 'you', 'he', 'she',
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  return new Set(words);
}

/**
 * Calculate similarity score between two items (0-1)
 */
function calculateSimilarity(item1: RawNewsItem, item2: RawNewsItem): number {
  const terms1 = extractKeyTerms(item1.title + ' ' + item1.content.slice(0, 500));
  const terms2 = extractKeyTerms(item2.title + ' ' + item2.content.slice(0, 500));

  if (terms1.size === 0 || terms2.size === 0) return 0;

  // Calculate Jaccard similarity using Array.from for compatibility
  const terms1Array = Array.from(terms1);
  const terms2Array = Array.from(terms2);

  const intersection = terms1Array.filter((x) => terms2.has(x));
  const unionSet = new Set(terms1Array.concat(terms2Array));

  return intersection.length / unionSet.size;
}

/**
 * Merge similar items into one with combined sources
 */
function mergeItems(items: RawNewsItem[]): RawNewsItem {
  // Sort by content length (prefer longer/more detailed)
  items.sort((a, b) => b.content.length - a.content.length);

  const primary = items[0];
  const allSources = items.map((item) => item.source).join(', ');

  // Combine content from all sources for richer context
  const combinedContent = items
    .map((item) => `[${item.source}]: ${item.content}`)
    .join('\n\n')
    .slice(0, 3000);

  return {
    ...primary,
    content: combinedContent,
    source: allSources,
  };
}

/**
 * Smart deduplication that groups and merges similar stories
 */
function deduplicateItems(items: RawNewsItem[]): RawNewsItem[] {
  const SIMILARITY_THRESHOLD = 0.35; // Items with >35% term overlap are considered similar
  const groups: RawNewsItem[][] = [];
  const assigned = new Set<number>();

  console.log(`[Dedup] Starting smart deduplication of ${items.length} items...`);

  // Group similar items together
  for (let i = 0; i < items.length; i++) {
    if (assigned.has(i)) continue;

    const group: RawNewsItem[] = [items[i]];
    assigned.add(i);

    for (let j = i + 1; j < items.length; j++) {
      if (assigned.has(j)) continue;

      const similarity = calculateSimilarity(items[i], items[j]);
      if (similarity >= SIMILARITY_THRESHOLD) {
        group.push(items[j]);
        assigned.add(j);
      }
    }

    groups.push(group);
  }

  // Log merging stats
  const mergedCount = groups.filter((g) => g.length > 1).length;
  const totalMerged = items.length - groups.length;
  if (mergedCount > 0) {
    console.log(`[Dedup] Merged ${totalMerged} items into ${mergedCount} combined stories`);
    for (const group of groups.filter((g) => g.length > 1)) {
      console.log(`  - "${group[0].title.slice(0, 50)}..." (${group.length} sources)`);
    }
  }

  // Merge each group into a single item
  return groups.map((group) => (group.length === 1 ? group[0] : mergeItems(group)));
}

/**
 * Generate briefings from processed items
 * Items are already sorted by relevance score (highest first) from the processor
 */
function generateBriefings(items: BriefingItem[]): DailyBriefings[] {
  const now = new Date();
  const today = formatDate(now);
  const period = getCurrentPeriod(now);

  // Take the top items by relevance (already sorted by processor)
  const briefingItems = items.slice(0, MAX_ITEMS_PER_BRIEFING);

  // Create the briefing
  const briefing: Briefing = {
    id: `briefing-${today}-${period}`,
    period,
    date: today,
    scheduledTime: getScheduledTime(period),
    executiveSummary: generateExecutiveSummary(briefingItems),
    items: briefingItems,
    totalReadTimeMinutes: briefingItems.reduce((sum, item) => sum + item.readTimeMinutes, 0),
    isAvailable: true,
    isRead: false,
  };

  // Create daily briefings structure
  const dailyBriefings: DailyBriefings = {
    date: today,
    displayDate: 'Today',
    briefings: [briefing],
  };

  return [dailyBriefings];
}

/**
 * Generate executive summary from items
 */
function generateExecutiveSummary(items: BriefingItem[]): string {
  if (items.length === 0) {
    return 'No significant AI news this period.';
  }

  const highlights = items.slice(0, 3).map((item) => item.title);
  return `Today's highlights: ${highlights.join(', ')}.`;
}

/**
 * Get current briefing period based on time
 */
function getCurrentPeriod(date: Date): BriefingPeriod {
  const hour = date.getHours();

  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

/**
 * Get scheduled time for a period
 */
function getScheduledTime(period: BriefingPeriod): string {
  switch (period) {
    case 'morning':
      return '07:30';
    case 'afternoon':
      return '13:30';
    case 'evening':
      return '20:30';
  }
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Load existing briefings data
 */
function loadExistingData(): DailyBriefings[] {
  try {
    if (fs.existsSync(OUTPUT_PATH)) {
      const content = fs.readFileSync(OUTPUT_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn('Could not load existing data:', error);
  }
  return [];
}

/**
 * Merge new briefings with existing data
 */
function mergeWithExisting(
  newBriefings: DailyBriefings[],
  existing: DailyBriefings[]
): DailyBriefings[] {
  const merged = new Map<string, DailyBriefings>();

  // Add existing data
  for (const day of existing) {
    merged.set(day.date, day);
  }

  // Merge or add new briefings
  for (const newDay of newBriefings) {
    const existingDay = merged.get(newDay.date);

    if (existingDay) {
      // Merge briefings for the same day
      for (const newBriefing of newDay.briefings) {
        const existingIndex = existingDay.briefings.findIndex(
          (b) => b.period === newBriefing.period
        );

        if (existingIndex >= 0) {
          // Replace existing briefing for this period
          existingDay.briefings[existingIndex] = newBriefing;
        } else {
          // Add new briefing period
          existingDay.briefings.push(newBriefing);
        }
      }

      // Sort briefings by period
      existingDay.briefings.sort((a, b) => {
        const order: Record<BriefingPeriod, number> = { morning: 0, afternoon: 1, evening: 2 };
        return order[a.period] - order[b.period];
      });
    } else {
      merged.set(newDay.date, newDay);
    }
  }

  // Convert to array and sort by date (most recent first)
  let result = Array.from(merged.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Keep only the last N days
  result = result.slice(0, MAX_DAYS_TO_KEEP);

  // Update display dates
  const today = formatDate(new Date());
  const yesterday = formatDate(new Date(Date.now() - 86400000));

  for (const day of result) {
    if (day.date === today) {
      day.displayDate = 'Today';
    } else if (day.date === yesterday) {
      day.displayDate = 'Yesterday';
    } else {
      day.displayDate = new Date(day.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    }
  }

  return result;
}

/**
 * Save output to file
 */
function saveOutput(data: DailyBriefings[]): void {
  // Ensure directory exists
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Saved ${data.length} days of briefings`);
}

// Run the generator
generate().catch((error) => {
  clearTimeout(scriptTimeout);
  console.error('Fatal error:', error);
  process.exit(1);
});
