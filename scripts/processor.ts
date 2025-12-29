import type { BriefingItem, BriefingSource, BriefingTag } from '../types/briefing';
import type { RawNewsItem } from './types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface ProcessedItem {
  title: string;
  tldr: string;
  whyItMatters: string[];
  whatToTry: {
    description: string;
    code?: string;
    note?: string;
  };
  tags: { label: string; type: 'model' | 'tool' | 'topic' }[];
  readTimeMinutes: number;
}

const SYSTEM_PROMPT = `You are an AI news curator for tech founders building AI-powered products. Your job is to transform raw news into actionable briefings.

Output ONLY valid JSON with this exact structure:
{
  "title": "Catchy headline (max 80 chars)",
  "tldr": "1-2 sentence summary for busy founders",
  "whyItMatters": ["Impact point 1", "Impact point 2"],
  "whatToTry": {
    "description": "Actionable suggestion",
    "code": "optional code snippet",
    "note": "optional note"
  },
  "tags": [{"label": "Tag", "type": "model|tool|topic"}],
  "readTimeMinutes": 2
}

Guidelines:
- Be concise and actionable
- Focus on practical implications for founders
- Avoid hype, be factual
- readTimeMinutes should be 1-5 based on complexity
- Include code snippets only if relevant (API calls, CLI commands, etc.)
- Tags: use "model" for AI models (GPT-4, Claude), "tool" for products, "topic" for concepts`;

/**
 * Process a single news item with DeepSeek
 */
export async function processNewsItem(
  item: RawNewsItem,
  apiKey: string
): Promise<BriefingItem | null> {
  try {
    const userPrompt = `Transform this news into a briefing item:

Title: ${item.title}
Source: ${item.source}
Content: ${item.content.slice(0, 1500)}
URL: ${item.url}
Category: ${item.category}

Return only valid JSON.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ];

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages,
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data: DeepSeekResponse = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from DeepSeek');
    }

    // Parse JSON from response (handle markdown code blocks)
    const jsonStr = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const processed: ProcessedItem = JSON.parse(jsonStr);

    // Create the full BriefingItem
    const briefingItem: BriefingItem = {
      id: item.id,
      title: processed.title,
      tldr: processed.tldr,
      whyItMatters: processed.whyItMatters,
      whatToTry: processed.whatToTry,
      sources: [
        {
          id: `src-${item.id}`,
          title: item.title,
          url: item.url,
          domain: extractDomain(item.url),
          type: inferSourceType(item.url),
        },
      ],
      tags: processed.tags.map((tag, idx) => ({
        id: `tag-${item.id}-${idx}`,
        label: tag.label,
        type: tag.type,
      })),
      category: item.category,
      readTimeMinutes: processed.readTimeMinutes,
      isRead: false,
      publishedAt: item.publishedAt,
    };

    return briefingItem;
  } catch (error) {
    console.error(`[Processor] Error processing "${item.title}":`, error);
    return null;
  }
}

/**
 * Process multiple news items in batches
 */
export async function processNewsItems(
  items: RawNewsItem[],
  apiKey: string,
  options: { batchSize?: number; delayMs?: number } = {}
): Promise<BriefingItem[]> {
  const { batchSize = 5, delayMs = 1000 } = options;
  const results: BriefingItem[] = [];

  console.log(`[Processor] Processing ${items.length} items in batches of ${batchSize}`);

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    console.log(`[Processor] Batch ${Math.floor(i / batchSize) + 1}: Processing ${batch.length} items`);

    const batchResults = await Promise.all(
      batch.map((item) => processNewsItem(item, apiKey))
    );

    for (const result of batchResults) {
      if (result) {
        results.push(result);
      }
    }

    // Delay between batches to avoid rate limiting
    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  console.log(`[Processor] Successfully processed ${results.length}/${items.length} items`);
  return results;
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

/**
 * Infer source type from URL
 */
function inferSourceType(url: string): BriefingSource['type'] {
  if (url.includes('arxiv.org')) return 'paper';
  if (url.includes('github.com')) return 'repository';
  if (url.includes('blog') || url.includes('medium.com')) return 'blog';
  return 'article';
}
