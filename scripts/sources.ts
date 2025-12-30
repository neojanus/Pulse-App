import type { SourcesConfig } from './types';

/**
 * News Sources Configuration
 *
 * Edit this file to add/remove sources. Push changes to update.
 * No UI needed - just edit and deploy.
 */
export const sources: SourcesConfig = {
  twitter: {
    enabled: true,
    accounts: [
      // AI Labs & Companies
      { handle: 'OpenAI', category: 'releases' },
      { handle: 'AnthropicAI', category: 'releases' },
      { handle: 'GoogleAI', category: 'releases' },
      { handle: 'MistralAI', category: 'releases' },
      { handle: 'MetaAI', category: 'releases' },
      { handle: 'xaborni', category: 'releases' },

      // AI Tools & Products
      { handle: 'cursor_ai', category: 'tools' },
      { handle: 'v0', category: 'tools' },
      { handle: 'veraborni', category: 'tools' },
      { handle: 'reaborni', category: 'tools' },

      // AI Researchers & Thought Leaders
      { handle: 'karpathy', category: 'research' },
      { handle: 'ylecun', category: 'research' },
      { handle: 'sama', category: 'industry' },

      // AI Tips & Workflows
      { handle: 'aiabornis', category: 'workflows' },
    ],
  },

  reddit: {
    enabled: true,
    subreddits: [
      { name: 'MachineLearning', category: 'research', limit: 10 },
      { name: 'LocalLLaMA', category: 'tools', limit: 10 },
      { name: 'artificial', category: 'industry', limit: 5 },
      { name: 'ChatGPT', category: 'workflows', limit: 5 },
      { name: 'ClaudeAI', category: 'workflows', limit: 5 },
    ],
  },

  rss: {
    enabled: true,
    feeds: [
      // Tech News - AI Coverage
      {
        url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
        name: 'TechCrunch AI',
        category: 'industry',
      },
      {
        url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
        name: 'The Verge AI',
        category: 'industry',
      },
      {
        url: 'https://arstechnica.com/tag/artificial-intelligence/feed/',
        name: 'Ars Technica AI',
        category: 'industry',
      },
      {
        url: 'https://www.wired.com/feed/tag/ai/latest/rss',
        name: 'Wired AI',
        category: 'industry',
      },
      {
        url: 'https://venturebeat.com/category/ai/feed/',
        name: 'VentureBeat AI',
        category: 'industry',
      },

      // AI Company Blogs
      {
        url: 'https://openai.com/blog/rss.xml',
        name: 'OpenAI Blog',
        category: 'releases',
      },
      {
        url: 'https://www.anthropic.com/news/rss.xml',
        name: 'Anthropic News',
        category: 'releases',
      },
      {
        url: 'https://blog.google/technology/ai/rss/',
        name: 'Google AI Blog',
        category: 'releases',
      },
      {
        url: 'https://ai.meta.com/blog/rss/',
        name: 'Meta AI Blog',
        category: 'releases',
      },

      // AI Newsletters & Curators (aggregate Twitter/X content)
      {
        url: 'https://www.therundown.ai/rss',
        name: 'The Rundown AI',
        category: 'industry',
      },
      {
        url: 'https://tldr.tech/ai/rss',
        name: 'TLDR AI',
        category: 'industry',
      },
      {
        url: 'https://bensbites.beehiiv.com/feed',
        name: "Ben's Bites",
        category: 'industry',
      },
      {
        url: 'https://importai.substack.com/feed',
        name: 'Import AI',
        category: 'research',
      },
      {
        url: 'https://lastweekin.ai/feed',
        name: 'Last Week in AI',
        category: 'industry',
      },

      // Research
      {
        url: 'http://export.arxiv.org/rss/cs.AI',
        name: 'ArXiv AI',
        category: 'research',
      },
      {
        url: 'http://export.arxiv.org/rss/cs.LG',
        name: 'ArXiv ML',
        category: 'research',
      },
      {
        url: 'https://huggingface.co/blog/feed.xml',
        name: 'Hugging Face Blog',
        category: 'tools',
      },
    ],
  },

  hackernews: {
    enabled: true,
    queries: [
      'artificial intelligence',
      'LLM',
      'GPT-4',
      'Claude AI',
      'OpenAI',
      'machine learning',
      'transformer model',
    ],
    minPoints: 50,
    limit: 15,
    category: 'industry',
  },

  bluesky: {
    enabled: true,
    accounts: [
      // AI Labs & Companies
      { handle: 'openai.bsky.social', category: 'releases' },
      { handle: 'anthropic.bsky.social', category: 'releases' },
      { handle: 'huggingface.co', category: 'tools' },

      // AI Researchers & Builders
      { handle: 'karpathy.bsky.social', category: 'research' },
      { handle: 'simonw.bsky.social', category: 'tools' },
      { handle: 'swyx.io', category: 'industry' },

      // AI Tools & Products
      { handle: 'cursor.com', category: 'tools' },
      { handle: 'replicate.com', category: 'tools' },
    ],
  },
};
