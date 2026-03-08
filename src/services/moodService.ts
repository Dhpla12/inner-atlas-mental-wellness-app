import { db, MoodEntry } from '@/database/schema';

export async function recordMood(
  userId: number,
  moodScore: number,
  notes?: string
): Promise<number> {
  // Ensure only one entry per day? We'll allow multiple and use latest or average.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const id = await db.moodEntries.add({
    userId,
    date: today,
    moodScore,
    notes,
    createdAt: new Date(),
  });
  return id;
}

export async function getMoodHistory(
  userId: number,
  days = 30
): Promise<MoodEntry[]> {
  const start = new Date();
  start.setDate(start.getDate() - days);
  return db.moodEntries
    .where('userId')
    .equals(userId)
    .and((e) => e.date >= start)
    .toArray();
}

export function calculateAverageMood(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;
  const sum = entries.reduce((acc, e) => acc + e.moodScore, 0);
  return sum / entries.length;
}

export function calculateMoodTrend(entries: MoodEntry[]): number[] {
  // Simple moving average or linear regression? For now return daily scores.
  entries.sort((a, b) => a.date.getTime() - b.date.getTime());
  return entries.map((e) => e.moodScore);
}
