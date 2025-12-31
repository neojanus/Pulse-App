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
    enabled: false, // Disabled: GitHub Actions IP gets 403 blocked
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
      // Tech News - AI Coverage (verified working)
      {
        url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
        name: 'TechCrunch AI',
        category: 'industry',
      },
      {
        url: 'https://www.wired.com/feed/tag/ai/latest/rss',
        name: 'Wired AI',
        category: 'industry',
      },

      // AI Company Blogs (verified working)
      {
        url: 'https://openai.com/blog/rss.xml',
        name: 'OpenAI Blog',
        category: 'releases',
      },
      {
        url: 'https://blog.google/technology/ai/rss/',
        name: 'Google AI Blog',
        category: 'releases',
      },

      // Research (verified working)
      {
        url: 'http://export.arxiv.org/rss/cs.AI',
        name: 'ArXiv AI',
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
    queries: ['LLM', 'OpenAI', 'AI'], // Reduced to top 3 productive queries
    minPoints: 100, // Higher threshold for quality
    limit: 10,
    category: 'industry',
  },

  bluesky: {
    enabled: false, // Disabled: Needs authentication (401 errors)
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
