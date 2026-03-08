import { db } from '@/database/schema';

export async function detectPatterns(userId: number) {
  const entries = await db.journalEntries.where('userId').equals(userId).toArray();
  const moods = await db.moodEntries.where('userId').equals(userId).toArray();

  // Simple keyword analysis
  const keywords = ['stress', 'anxiety', 'happy', 'tired'];
  const keywordCounts: Record<string, number> = {};
  entries.forEach((e) => {
    keywords.forEach((kw) => {
      if (e.content.includes(kw) || e.title.includes(kw)) {
        keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
      }
    });
  });

  // Mood‑habit correlation (stub)
  return {
    frequentKeywords: keywordCounts,
    patterns: [],
  };
}
