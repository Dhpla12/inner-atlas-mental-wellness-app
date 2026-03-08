import { db } from '@/database/schema';
import { calculateAverageMood } from './moodService';
import { detectEmotionalPatterns } from '@/ai/patternDetector';

export async function generateWeeklyReport(userId: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);

  const moods = await db.moodEntries
    .where('userId')
    .equals(userId)
    .and((m) => m.date >= start && m.date <= end)
    .toArray();
  const avgMood = calculateAverageMood(moods);
  const entries = await db.journalEntries
    .where('userId')
    .equals(userId)
    .and((e) => e.createdAt >= start && e.createdAt <= end)
    .toArray();

  // Get patterns relevant to this week
  const patterns = await detectEmotionalPatterns(userId);
  const weeklyPatterns = patterns.filter((p) => p.confidence > 0.6);

  const report = {
    weekStart: start,
    weekEnd: end,
    averageMood: avgMood,
    entryCount: entries.length,
    patterns: weeklyPatterns,
  };

  // Store report
  await db.insightReports.add({
    userId,
    type: 'weekly',
    data: report,
    createdAt: new Date(),
  });

  return report;
}
