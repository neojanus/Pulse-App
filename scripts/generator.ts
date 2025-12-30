import * as fs from 'fs';
import * as path from 'path';

import { sources } from './sources';
import { fetchAllRSSFeeds, fetchAllSubreddits, fetchAllTwitterAccounts, fetchHackerNews } from './fetchers';
import { processNewsItems } from './processor';
import type { RawNewsItem } from './types';
import type { Briefing, BriefingItem, BriefingPeriod, DailyBriefings } from '../types/briefing';

// Configuration
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'live', 'briefings.json');
const MAX_ITEMS_PER_BRIEFING = 5;
const MAX_DAYS_TO_KEEP = 7;

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

  // Step 1: Fetch from all sources
  console.log('\n📥 Fetching news from sources...');
  const rawItems: RawNewsItem[] = [];

  if (sources.rss.enabled) {
    const rssItems = await fetchAllRSSFeeds(sources.rss.feeds);
    rawItems.push(...rssItems);
  }

  if (sources.reddit.enabled) {
    const redditItems = await fetchAllSubreddits(sources.reddit.subreddits);
    rawItems.push(...redditItems);
  }

  if (sources.twitter.enabled) {
    const twitterItems = await fetchAllTwitterAccounts(sources.twitter.accounts);
    rawItems.push(...twitterItems);
  }

  if (sources.hackernews.enabled) {
    const hnItems = await fetchHackerNews(sources.hackernews);
    rawItems.push(...hnItems);
  }

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
  const itemsToProcess = uniqueItems.slice(0, 30);
  console.log(`📊 Processing top ${itemsToProcess.length} items`);

  // Step 3: Process with DeepSeek
  console.log('\n🤖 Processing with DeepSeek AI...');
  const processedItems = await processNewsItems(itemsToProcess, apiKey, {
    batchSize: 5,
    delayMs: 1500,
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

  console.log('\n' + '='.repeat(60));
  console.log('✅ Generation complete!');
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log(`Briefings: ${mergedData.length} days`);
  console.log('='.repeat(60));
}

/**
 * Deduplicate items by title similarity
 */
function deduplicateItems(items: RawNewsItem[]): RawNewsItem[] {
  const seen = new Set<string>();
  const unique: RawNewsItem[] = [];

  for (const item of items) {
    // Create a simple hash from the title
    const titleKey = item.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 50);

    if (!seen.has(titleKey)) {
      seen.add(titleKey);
      unique.push(item);
    }
  }

  return unique;
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
  console.error('Fatal error:', error);
  process.exit(1);
});
