import type { BriefingItem, BriefingSource, BriefingTag } from '../types/briefing';
import type { RawNewsItem } from './types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';
const API_TIMEOUT_MS = 30000; // 30 second timeout per request

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
  relevanceScore: number;
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

const SYSTEM_PROMPT = `You are an expert AI news curator for tech founders building AI products.

Your task: Transform raw news into HIGH-SIGNAL briefings that founders can act on.

QUALITY CRITERIA:
- Relevance: Is this directly useful for someone building AI products?
- Actionability: Can the reader DO something with this information?
- Timeliness: Is this news (not evergreen content)?
- Signal: Does this contain genuine insight (not just hype)?

Output ONLY valid JSON with this exact structure:
{
  "relevanceScore": 7,
  "title": "Catchy headline (max 80 chars)",
  "tldr": "1-2 sentence summary - what happened and why it matters",
  "whyItMatters": ["Business impact", "Technical impact"],
  "whatToTry": {
    "description": "Specific action the reader can take - a clear, actionable suggestion in plain text",
    "note": "optional: caveat or tip"
  },
  "tags": [{"label": "Tag", "type": "model|tool|topic"}],
  "readTimeMinutes": 2
}

RELEVANCE SCORING (1-10):
- 8-10: Breaking releases, major funding, breakthrough research, new APIs
- 5-7: Useful tools, interesting papers, significant industry moves
- 1-4: Rehashed news, hype pieces, minor updates, opinion pieces

MULTI-SOURCE ITEMS:
When the content contains multiple perspectives from different sources (marked with [Source Name]:), this indicates a trending story. For these:
- BOOST relevance score by 1-2 points (trending = more important)
- Synthesize insights from ALL sources into a cohesive summary
- Note in tldr when multiple major outlets are covering it

GUIDELINES:
- Be concise and actionable
- Focus on practical implications for founders
- Be skeptical of marketing claims - avoid hype
- readTimeMinutes: 1-5 based on complexity
- DO NOT include code snippets - keep "whatToTry" as plain text suggestions only
- Tags: "model" for AI models, "tool" for products, "topic" for concepts`;

/**
 * Result of processing a news item, including relevance score
 */
export interface ProcessedResult {
  item: BriefingItem;
  relevanceScore: number;
}

/**
 * Process a single news item with DeepSeek
 */
export async function processNewsItem(
  item: RawNewsItem,
  apiKey: string
): Promise<ProcessedResult | null> {
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

    // Add timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
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
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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

      // Parse sources - check if this is a merged item with multiple sources
      const sources: BriefingSource[] = parseMultipleSources(item);

      // Create the full BriefingItem
      const briefingItem: BriefingItem = {
        id: item.id,
        title: processed.title,
        tldr: processed.tldr,
        whyItMatters: processed.whyItMatters,
        whatToTry: processed.whatToTry,
        sources,
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

      return {
        item: briefingItem,
        relevanceScore: processed.relevanceScore || 5,
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error(`Request timed out after ${API_TIMEOUT_MS / 1000}s`);
      }
      throw fetchError;
    }
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
  options: { batchSize?: number; delayMs?: number; minRelevanceScore?: number } = {}
): Promise<BriefingItem[]> {
  const { batchSize = 5, delayMs = 1000, minRelevanceScore = 5 } = options;
  const results: ProcessedResult[] = [];

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

  // Filter by relevance score and sort by score descending
  const filteredResults = results
    .filter((r) => r.relevanceScore >= minRelevanceScore)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  console.log(`[Processor] Processed ${results.length} items, ${filteredResults.length} passed relevance filter (>=${minRelevanceScore})`);

  // Return just the items, sorted by relevance
  return filteredResults.map((r) => r.item);
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

/**
 * Parse multiple sources from a merged item
 * Merged items have source field like "Source1, Source2, Source3"
 */
function parseMultipleSources(item: RawNewsItem): BriefingSource[] {
  // Check if source contains multiple sources (comma-separated)
  const sourceNames = item.source.split(', ').map((s) => s.trim());

  // If only one source, return simple source array
  if (sourceNames.length === 1) {
    return [
      {
        id: `src-${item.id}`,
        title: item.title,
        url: item.url,
        domain: extractDomain(item.url),
        type: inferSourceType(item.url),
      },
    ];
  }

  // For merged items, try to extract URLs from content
  // Content format: "[Source Name]: content text\n\n[Another Source]: more text"
  const sources: BriefingSource[] = [];
  const urlPattern = /https?:\/\/[^\s]+/g;
  const contentUrls = item.content.match(urlPattern) || [];

  // Create a source entry for each source name
  for (let i = 0; i < sourceNames.length; i++) {
    const sourceName = sourceNames[i];
    // Try to find a matching URL in content, or use primary URL
    const sourceUrl = contentUrls[i] || item.url;

    sources.push({
      id: `src-${item.id}-${i}`,
      title: sourceName,
      url: sourceUrl,
      domain: extractDomain(sourceUrl),
      type: inferSourceType(sourceUrl),
    });
  }

  return sources;
}
