/**
 * Mock data for Pulse AI Briefing App
 * Contains 7 days of briefings with realistic AI news content
 */

import type {
  Briefing,
  BriefingItem,
  DailyBriefings,
  BriefingPeriod,
} from '@/types/briefing';

// Helper to generate dates
const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const formatDisplayDate = (daysAgo: number): string => {
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};

// Mock Briefing Items
export const mockItems: BriefingItem[] = [
  // Today's Morning Items
  {
    id: 'item-001',
    title: 'OpenAI drops API costs by 50% for GPT-4o',
    tldr:
      'In a move to capture more of the enterprise market, OpenAI has slashed pricing for its flagship model. The new pricing tier applies to batch processing and fine-tuning, making it significantly more affordable for high-volume applications.',
    whyItMatters: [
      'Cost reduction: Makes GPT-4o viable for high-volume production applications that were previously cost-prohibitive.',
      'Market pressure: Signals increased competition from Claude and Gemini, benefiting developers with more affordable options.',
    ],
    whatToTry: {
      description: 'Test the batch API with your existing prompts to see cost savings',
      code: 'curl https://api.openai.com/v1/batches \\\n  -H "Authorization: Bearer $OPENAI_API_KEY"',
      note: 'Batch processing available for requests > 1000 tokens',
    },
    sources: [
      {
        id: 's001',
        title: 'OpenAI Blog Announcement',
        url: 'https://openai.com/blog',
        domain: 'openai.com',
        type: 'blog',
      },
      {
        id: 's002',
        title: 'TechCrunch Coverage',
        url: 'https://techcrunch.com',
        domain: 'TechCrunch',
        type: 'article',
      },
    ],
    tags: [
      { id: 't001', label: 'GPT-4', type: 'model' },
      { id: 't002', label: 'Pricing', type: 'topic' },
      { id: 't003', label: 'OpenAI', type: 'tool' },
    ],
    category: 'releases',
    readTimeMinutes: 2,
    isRead: false,
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'item-002',
    title: 'React 19 Beta is officially out',
    tldr:
      'The long-awaited update introduces the new Compiler, eliminating the need for manual memoization. It also stabilizes Server Actions, providing a more seamless way to handle data mutations directly from components.',
    whyItMatters: [
      'Developer experience: No more useMemo/useCallback boilerplate - the compiler handles optimization automatically.',
      'Full-stack React: Server Actions enable true end-to-end type safety from database to UI.',
    ],
    whatToTry: {
      description: 'Try the React Compiler in your existing project',
      code: 'npm install react@beta react-dom@beta\nnpm install -D babel-plugin-react-compiler',
    },
    sources: [
      {
        id: 's003',
        title: 'React Blog',
        url: 'https://react.dev/blog',
        domain: 'react.dev',
        type: 'blog',
      },
    ],
    tags: [
      { id: 't004', label: 'React', type: 'tool' },
      { id: 't005', label: 'Frontend', type: 'topic' },
    ],
    category: 'releases',
    readTimeMinutes: 3,
    isRead: false,
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'item-003',
    title: 'Cursor AI hits 1M users, raises $60M Series B',
    tldr:
      'The AI-powered code editor has achieved explosive growth, doubling users in just 3 months. The new funding will be used to expand the model capabilities and add collaborative features.',
    whyItMatters: [
      'Market validation: Proves demand for AI-native development tools is real and growing rapidly.',
      'Competition heating up: Puts pressure on VS Code, JetBrains to accelerate their AI integrations.',
    ],
    whatToTry: {
      description: 'Try Cursor\'s Composer feature for multi-file edits',
      code: 'brew install --cask cursor',
      note: 'Free tier includes 50 premium requests/month',
    },
    sources: [
      {
        id: 's004',
        title: 'Cursor Blog',
        url: 'https://cursor.sh/blog',
        domain: 'cursor.sh',
        type: 'blog',
      },
    ],
    tags: [
      { id: 't006', label: 'Cursor', type: 'tool' },
      { id: 't007', label: 'IDE', type: 'topic' },
      { id: 't008', label: 'Funding', type: 'topic' },
    ],
    category: 'industry',
    readTimeMinutes: 2,
    isRead: false,
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'item-004',
    title: 'Claude now supports 200K context window for all users',
    tldr:
      'Anthropic has expanded the context window for Claude 3.5 Sonnet to 200K tokens for all API users, previously limited to enterprise customers. This enables processing entire codebases in a single request.',
    whyItMatters: [
      'Larger projects: Analyze complete repositories, legal documents, or research papers in one go.',
      'Better context: Reduced need for chunking strategies and RAG for many use cases.',
    ],
    whatToTry: {
      description: 'Test long-context capabilities with your codebase',
      code: 'find . -name "*.ts" -exec cat {} + | claude',
      note: 'Works best with structured content like code',
    },
    sources: [
      {
        id: 's005',
        title: 'Anthropic Docs',
        url: 'https://docs.anthropic.com',
        domain: 'anthropic.com',
        type: 'blog',
      },
    ],
    tags: [
      { id: 't009', label: 'Claude', type: 'model' },
      { id: 't010', label: 'Context Window', type: 'topic' },
    ],
    category: 'releases',
    readTimeMinutes: 2,
    isRead: false,
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'item-005',
    title: 'LangGraph Studio launches for visual agent debugging',
    tldr:
      'LangChain releases a desktop app for building and debugging AI agents visually. Includes real-time state inspection, step-through execution, and branch testing.',
    whyItMatters: [
      'Debugging agents: Finally a way to understand what\'s happening inside complex agent workflows.',
      'Faster iteration: Visual editing reduces the build-test cycle from minutes to seconds.',
    ],
    whatToTry: {
      description: 'Download LangGraph Studio and import an existing agent',
      code: 'pip install langgraph\nlanggraph studio',
    },
    sources: [
      {
        id: 's006',
        title: 'LangChain Blog',
        url: 'https://blog.langchain.dev',
        domain: 'langchain.dev',
        type: 'blog',
      },
    ],
    tags: [
      { id: 't011', label: 'LangGraph', type: 'tool' },
      { id: 't012', label: 'Agents', type: 'topic' },
    ],
    category: 'tools',
    readTimeMinutes: 2,
    isRead: false,
    publishedAt: new Date().toISOString(),
  },
  // Today's Afternoon Items
  {
    id: 'item-006',
    title: 'Mistral releases Codestral - specialized coding model',
    tldr:
      'Mistral\'s new 22B parameter model is optimized for code generation and achieves state-of-the-art performance on HumanEval. Available via API with a generous free tier.',
    whyItMatters: [
      'Open competition: Provides a strong alternative to GPT-4 and Claude for coding tasks.',
      'Efficiency: Smaller model size means faster inference and lower costs for coding workflows.',
    ],
    whatToTry: {
      description: 'Try Codestral through the Mistral API',
      code: 'curl https://api.mistral.ai/v1/chat/completions \\\n  -H "Authorization: Bearer $MISTRAL_API_KEY" \\\n  -d \'{"model": "codestral-latest"}\'',
    },
    sources: [
      {
        id: 's007',
        title: 'Mistral AI Blog',
        url: 'https://mistral.ai/news',
        domain: 'mistral.ai',
        type: 'blog',
      },
    ],
    tags: [
      { id: 't013', label: 'Mistral', type: 'model' },
      { id: 't014', label: 'Code Generation', type: 'topic' },
    ],
    category: 'releases',
    readTimeMinutes: 2,
    isRead: false,
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'item-007',
    title: 'Practical guide to building RAG with pgvector',
    tldr:
      'A comprehensive tutorial on implementing production-ready RAG using PostgreSQL and pgvector. Covers embedding strategies, indexing for scale, and hybrid search patterns.',
    whyItMatters: [
      'Simplify stack: Use your existing Postgres database instead of adding a vector DB.',
      'Production-ready: Battle-tested patterns from companies running RAG at scale.',
    ],
    whatToTry: {
      description: 'Add pgvector to your existing Postgres instance',
      code: 'CREATE EXTENSION vector;\nCREATE TABLE embeddings (\n  id SERIAL PRIMARY KEY,\n  embedding vector(1536)\n);',
    },
    sources: [
      {
        id: 's008',
        title: 'Supabase Guide',
        url: 'https://supabase.com/docs',
        domain: 'supabase.com',
        type: 'article',
      },
    ],
    tags: [
      { id: 't015', label: 'RAG', type: 'topic' },
      { id: 't016', label: 'pgvector', type: 'tool' },
      { id: 't017', label: 'PostgreSQL', type: 'tool' },
    ],
    category: 'workflows',
    readTimeMinutes: 4,
    isRead: false,
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'item-008',
    title: 'DeepSeek-V2 achieves GPT-4 parity at 1/10th cost',
    tldr:
      'Chinese AI lab DeepSeek releases a mixture-of-experts model matching GPT-4 benchmarks while using significantly fewer active parameters per inference.',
    whyItMatters: [
      'Cost efficiency: Opens up GPT-4-level capabilities to budget-constrained projects.',
      'Open weights: Model weights are available for self-hosting and fine-tuning.',
    ],
    whatToTry: {
      description: 'Try DeepSeek-V2 through their API or Ollama',
      code: 'ollama pull deepseek-v2\nollama run deepseek-v2',
    },
    sources: [
      {
        id: 's009',
        title: 'DeepSeek Research Paper',
        url: 'https://arxiv.org',
        domain: 'arxiv.org',
        type: 'paper',
      },
    ],
    tags: [
      { id: 't018', label: 'DeepSeek', type: 'model' },
      { id: 't019', label: 'MoE', type: 'topic' },
    ],
    category: 'research',
    readTimeMinutes: 3,
    isRead: false,
    publishedAt: new Date().toISOString(),
  },
  // Today's Evening Items
  {
    id: 'item-009',
    title: 'Vercel AI SDK 4.0 adds streaming tool calls',
    tldr:
      'Major update to the popular AI SDK introduces streaming support for function calling, enabling real-time UI updates as tools execute. Also adds native support for multi-modal inputs.',
    whyItMatters: [
      'Better UX: Users see tool execution progress in real-time instead of waiting.',
      'Multi-modal: Build apps that process images and audio alongside text.',
    ],
    whatToTry: {
      description: 'Upgrade to AI SDK 4.0 and try streaming tools',
      code: 'npm install ai@latest\n// Use streamUI for streaming tool results',
    },
    sources: [
      {
        id: 's010',
        title: 'Vercel AI SDK Docs',
        url: 'https://sdk.vercel.ai',
        domain: 'vercel.ai',
        type: 'blog',
      },
    ],
    tags: [
      { id: 't020', label: 'Vercel', type: 'tool' },
      { id: 't021', label: 'AI SDK', type: 'tool' },
    ],
    category: 'tools',
    readTimeMinutes: 2,
    isRead: false,
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'item-010',
    title: 'Q4 AI startup funding hits $12B despite market downturn',
    tldr:
      'AI startups continue to attract significant investment while broader tech funding remains flat. Infrastructure and enterprise AI tools lead the categories.',
    whyItMatters: [
      'Sector resilience: AI remains the bright spot in an otherwise cautious funding environment.',
      'Where money flows: Infrastructure (compute, vector DBs) attracting more than consumer AI.',
    ],
    whatToTry: {
      description: 'Read the full CB Insights report for detailed breakdowns',
    },
    sources: [
      {
        id: 's011',
        title: 'CB Insights Report',
        url: 'https://cbinsights.com',
        domain: 'cbinsights.com',
        type: 'article',
      },
    ],
    tags: [
      { id: 't022', label: 'Funding', type: 'topic' },
      { id: 't023', label: 'Market', type: 'topic' },
    ],
    category: 'industry',
    readTimeMinutes: 2,
    isRead: false,
    publishedAt: new Date().toISOString(),
  },
  // Yesterday's Items
  {
    id: 'item-011',
    title: 'GitHub Copilot adds workspace-aware suggestions',
    tldr:
      'New update allows Copilot to index your entire repository for more contextually relevant suggestions. Opt-in feature requires workspace trust configuration.',
    whyItMatters: [
      'Better suggestions: Understands your codebase patterns, not just the current file.',
      'Privacy control: You choose which repos to index and where data is processed.',
    ],
    whatToTry: {
      description: 'Enable workspace indexing in VS Code settings',
      code: '"github.copilot.advanced": {\n  "workspaceIndex": true\n}',
    },
    sources: [
      {
        id: 's012',
        title: 'GitHub Blog',
        url: 'https://github.blog',
        domain: 'github.blog',
        type: 'blog',
      },
    ],
    tags: [
      { id: 't024', label: 'GitHub Copilot', type: 'tool' },
      { id: 't025', label: 'IDE', type: 'topic' },
    ],
    category: 'tools',
    readTimeMinutes: 2,
    isRead: false,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'item-012',
    title: 'Fine-tuning GPT-4o is now available to all developers',
    tldr:
      'OpenAI opens up GPT-4o fine-tuning beyond the waitlist. Pricing starts at $25/M training tokens with a minimum of 10 examples required.',
    whyItMatters: [
      'Customization: Train GPT-4o on your specific domain, tone, or format requirements.',
      'Competitive advantage: Build differentiated AI products that can\'t be easily replicated.',
    ],
    whatToTry: {
      description: 'Start with a small fine-tuning job on your domain data',
      code: 'openai api fine_tuning.jobs.create \\\n  -t "training.jsonl" \\\n  -m "gpt-4o-2024-08-06"',
    },
    sources: [
      {
        id: 's013',
        title: 'OpenAI Docs',
        url: 'https://platform.openai.com/docs',
        domain: 'openai.com',
        type: 'blog',
      },
    ],
    tags: [
      { id: 't026', label: 'Fine-tuning', type: 'topic' },
      { id: 't027', label: 'GPT-4', type: 'model' },
    ],
    category: 'releases',
    readTimeMinutes: 3,
    isRead: false,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'item-013',
    title: 'Anthropic publishes interpretability research on Claude',
    tldr:
      'New paper reveals how Claude\'s internal representations map to human concepts. Researchers identified "features" corresponding to specific knowledge domains.',
    whyItMatters: [
      'AI safety: Understanding what models "know" is crucial for alignment and safety.',
      'Better prompting: Insights into model internals can inform more effective prompt strategies.',
    ],
    whatToTry: {
      description: 'Read the full research paper on interpretability',
    },
    sources: [
      {
        id: 's014',
        title: 'Anthropic Research',
        url: 'https://anthropic.com/research',
        domain: 'anthropic.com',
        type: 'paper',
      },
    ],
    tags: [
      { id: 't028', label: 'Interpretability', type: 'topic' },
      { id: 't029', label: 'Claude', type: 'model' },
      { id: 't030', label: 'AI Safety', type: 'topic' },
    ],
    category: 'research',
    readTimeMinutes: 4,
    isRead: false,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Helper to get items for a briefing
const getItemsForBriefing = (
  startIndex: number,
  count: number
): BriefingItem[] => {
  return mockItems.slice(startIndex, startIndex + count);
};

// Generate briefings for a specific day
const generateDayBriefings = (daysAgo: number): Briefing[] => {
  const date = getDateString(daysAgo);
  const itemOffset = daysAgo * 9; // 9 items per day (3 per briefing)

  const briefings: Briefing[] = [
    {
      id: `briefing-morning-${date}`,
      period: 'morning',
      date,
      scheduledTime: '07:30',
      executiveSummary:
        daysAgo === 0
          ? 'OpenAI announces new pricing tiers, while React 19 enters beta. Cursor AI celebrates 1M users milestone with new funding round.'
          : 'GitHub Copilot adds workspace awareness, GPT-4o fine-tuning opens to all developers, and Anthropic shares interpretability research.',
      items: getItemsForBriefing(
        Math.min(itemOffset, mockItems.length - 5),
        5
      ),
      totalReadTimeMinutes: 11,
      isAvailable: true,
      isRead: false,
    },
    {
      id: `briefing-afternoon-${date}`,
      period: 'afternoon',
      date,
      scheduledTime: '13:30',
      executiveSummary:
        'Mistral releases Codestral for code generation, practical RAG guide with pgvector, and DeepSeek-V2 matches GPT-4 benchmarks.',
      items: getItemsForBriefing(
        Math.min(itemOffset + 5, mockItems.length - 3),
        3
      ),
      totalReadTimeMinutes: 9,
      isAvailable: daysAgo > 0 || new Date().getHours() >= 13,
      isRead: false,
    },
    {
      id: `briefing-evening-${date}`,
      period: 'evening',
      date,
      scheduledTime: '20:30',
      executiveSummary:
        'Vercel AI SDK 4.0 brings streaming tools, Q4 AI funding report shows continued strength in the sector.',
      items: getItemsForBriefing(
        Math.min(itemOffset + 8, mockItems.length - 2),
        2
      ),
      totalReadTimeMinutes: 4,
      isAvailable: daysAgo > 0 || new Date().getHours() >= 20,
      isRead: false,
    },
  ];

  return briefings;
};

// Generate daily briefings for the past week
export const mockDailyBriefings: DailyBriefings[] = Array.from(
  { length: 7 },
  (_, i) => ({
    date: getDateString(i),
    displayDate: formatDisplayDate(i),
    briefings: generateDayBriefings(i),
  })
);

// Get today's briefings
export const getTodaysBriefings = (): Briefing[] => {
  return mockDailyBriefings[0]?.briefings ?? [];
};

// Get briefing by ID
export const getBriefingById = (id: string): Briefing | undefined => {
  for (const day of mockDailyBriefings) {
    const briefing = day.briefings.find((b) => b.id === id);
    if (briefing) return briefing;
  }
  return undefined;
};

// Get item by ID
export const getItemById = (id: string): BriefingItem | undefined => {
  return mockItems.find((item) => item.id === id);
};

// Get archive briefings (exclude today)
export const getArchiveBriefings = (): DailyBriefings[] => {
  return mockDailyBriefings;
};
