/**
 * Type definitions for the Pulse AI Briefing App
 */

// Category types for briefing items
export type BriefingCategory =
  | 'releases'
  | 'tools'
  | 'workflows'
  | 'research'
  | 'industry';

// Tag types for auto-tagging
export type TagType = 'model' | 'tool' | 'topic';

export interface BriefingTag {
  id: string;
  label: string;
  type: TagType;
}

// Source link structure
export interface BriefingSource {
  id: string;
  title: string;
  url: string;
  domain: string; // e.g., "TechCrunch", "GitHub", "Arxiv"
  type?: 'paper' | 'repository' | 'article' | 'blog';
}

// Individual briefing item
export interface BriefingItem {
  id: string;
  title: string;
  tldr: string;
  whyItMatters: string[]; // 2 bullet points
  whatToTry: {
    description: string;
    code?: string; // Optional code snippet
    note?: string; // Optional note (e.g., "Requires ~24GB VRAM")
  };
  sources: BriefingSource[];
  tags: BriefingTag[];
  category: BriefingCategory;
  readTimeMinutes: number;
  isRead: boolean; // Local storage tracking
  publishedAt: string; // ISO date string
}

// Briefing period types
export type BriefingPeriod = 'morning' | 'afternoon' | 'evening';

// A single briefing (Morning/Afternoon/Evening)
export interface Briefing {
  id: string;
  period: BriefingPeriod;
  date: string; // ISO date string (YYYY-MM-DD)
  scheduledTime: string; // e.g., "07:30", "13:30", "20:30"
  executiveSummary: string;
  items: BriefingItem[];
  totalReadTimeMinutes: number;
  isAvailable: boolean; // False if scheduled time hasn't passed
  isRead: boolean; // True if marked as read
}

// A day's worth of briefings
export interface DailyBriefings {
  date: string; // ISO date string (YYYY-MM-DD)
  displayDate: string; // e.g., "Tuesday, Oct 24" or "Today"
  briefings: Briefing[];
}

// Read status storage structure
export interface ReadStatus {
  briefingIds: string[];
  itemIds: string[];
  lastUpdated: string;
}
