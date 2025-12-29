import type { Briefing, BriefingItem, DailyBriefings } from '@/types/briefing';
import {
  getTodaysBriefings as getMockTodaysBriefings,
  getArchiveBriefings as getMockArchiveBriefings,
  getBriefingById as getMockBriefingById,
  getItemById as getMockItemById,
} from '@/data/mock';

/**
 * GitHub Raw URL for live briefings
 *
 * Replace with your actual repository details:
 * - USERNAME: Your GitHub username
 * - REPO: Your repository name
 * - BRANCH: Usually 'main' or 'master'
 */
const GITHUB_RAW_URL =
  'https://raw.githubusercontent.com/USERNAME/REPO/main/data/live/briefings.json';

/**
 * Cache configuration
 */
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

let cachedData: DailyBriefings[] | null = null;
let cacheTimestamp = 0;

/**
 * Fetch live briefings from GitHub
 * Falls back to mock data on error
 */
export async function fetchLiveBriefings(): Promise<DailyBriefings[]> {
  // Check cache first
  if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION_MS) {
    return cachedData;
  }

  try {
    const response = await fetch(GITHUB_RAW_URL, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: DailyBriefings[] = await response.json();

    // Update cache
    cachedData = data;
    cacheTimestamp = Date.now();

    console.log('[BriefingsAPI] Fetched live data:', data.length, 'days');
    return data;
  } catch (error) {
    console.warn('[BriefingsAPI] Falling back to mock data:', error);
    return getMockArchiveBriefings();
  }
}

/**
 * Get today's briefings (live or mock)
 */
export async function getTodaysBriefings(): Promise<Briefing[]> {
  try {
    const allData = await fetchLiveBriefings();
    const today = allData.find((d) => d.displayDate === 'Today');
    return today?.briefings || [];
  } catch {
    return getMockTodaysBriefings();
  }
}

/**
 * Get archive briefings (live or mock)
 */
export async function getArchiveBriefings(): Promise<DailyBriefings[]> {
  try {
    return await fetchLiveBriefings();
  } catch {
    return getMockArchiveBriefings();
  }
}

/**
 * Get a specific briefing by ID (live or mock)
 */
export async function getBriefingById(id: string): Promise<Briefing | undefined> {
  try {
    const allData = await fetchLiveBriefings();

    for (const day of allData) {
      const briefing = day.briefings.find((b) => b.id === id);
      if (briefing) return briefing;
    }

    return undefined;
  } catch {
    return getMockBriefingById(id);
  }
}

/**
 * Get a specific item by ID (live or mock)
 */
export async function getItemById(id: string): Promise<BriefingItem | undefined> {
  try {
    const allData = await fetchLiveBriefings();

    for (const day of allData) {
      for (const briefing of day.briefings) {
        const item = briefing.items.find((i) => i.id === id);
        if (item) return item;
      }
    }

    return undefined;
  } catch {
    return getMockItemById(id);
  }
}

/**
 * Clear the cache (useful for pull-to-refresh)
 */
export function clearCache(): void {
  cachedData = null;
  cacheTimestamp = 0;
}

/**
 * Check if using live data or mock fallback
 */
export function isUsingLiveData(): boolean {
  return cachedData !== null;
}
