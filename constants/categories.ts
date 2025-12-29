/**
 * Category and period configuration for Pulse Briefings
 */

import type { BriefingCategory, BriefingPeriod } from '@/types/briefing';

// Category display configuration
export const CategoryConfig: Record<
  BriefingCategory,
  {
    label: string;
    colors: {
      bg: string;
      bgDark: string;
      text: string;
    };
  }
> = {
  releases: {
    label: 'Releases',
    colors: {
      bg: 'rgba(43, 140, 238, 0.1)',
      bgDark: 'rgba(43, 140, 238, 0.15)',
      text: '#2b8cee',
    },
  },
  tools: {
    label: 'Tools',
    colors: {
      bg: 'rgba(16, 185, 129, 0.1)',
      bgDark: 'rgba(16, 185, 129, 0.15)',
      text: '#10b981',
    },
  },
  workflows: {
    label: 'Workflows & Tips',
    colors: {
      bg: 'rgba(168, 85, 247, 0.1)',
      bgDark: 'rgba(168, 85, 247, 0.15)',
      text: '#a855f7',
    },
  },
  research: {
    label: 'Research / Models',
    colors: {
      bg: 'rgba(249, 115, 22, 0.1)',
      bgDark: 'rgba(249, 115, 22, 0.15)',
      text: '#f97316',
    },
  },
  industry: {
    label: 'Industry News',
    colors: {
      bg: 'rgba(236, 72, 153, 0.1)',
      bgDark: 'rgba(236, 72, 153, 0.15)',
      text: '#ec4899',
    },
  },
};

// Briefing period configuration
export const PeriodConfig: Record<
  BriefingPeriod,
  {
    label: string;
    icon: string;
    color: string;
    time: string;
    greeting: string;
  }
> = {
  morning: {
    label: 'Morning',
    icon: 'wb_twilight',
    color: '#fb923c',
    time: '07:30',
    greeting: 'Good morning',
  },
  afternoon: {
    label: 'Afternoon',
    icon: 'sunny',
    color: '#facc15',
    time: '13:30',
    greeting: 'Good afternoon',
  },
  evening: {
    label: 'Evening',
    icon: 'bedtime',
    color: '#818cf8',
    time: '20:30',
    greeting: 'Good evening',
  },
};

// All categories for filtering
export const ALL_CATEGORIES: BriefingCategory[] = [
  'releases',
  'tools',
  'workflows',
  'research',
  'industry',
];

// All periods in order
export const ALL_PERIODS: BriefingPeriod[] = ['morning', 'afternoon', 'evening'];
