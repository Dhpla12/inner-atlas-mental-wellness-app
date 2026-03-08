import { db, JournalEntry } from '@/database/schema';

export async function createJournalEntry(
  entry: Omit<JournalEntry, 'id'>
): Promise<number> {
  const id = await db.journalEntries.add({
    ...entry,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  // Optionally trigger AI reflection generation here
  return id;
}

export async function updateJournalEntry(
  id: number,
  updates: Partial<JournalEntry>
): Promise<void> {
  await db.journalEntries.update(id, { ...updates, updatedAt: new Date() });
}

export async function deleteJournalEntry(id: number): Promise<void> {
  await db.journalEntries.delete(id);
  // Also delete related AI reflections? Or keep for history?
}

export async function getJournalEntriesByDateRange(
  userId: number,
  start: Date,
  end: Date
): Promise<JournalEntry[]> {
  return db.journalEntries
    .where('userId')
    .equals(userId)
    .and((e) => e.createdAt >= start && e.createdAt <= end)
    .toArray();
}
