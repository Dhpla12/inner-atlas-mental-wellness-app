import { AIClient, MockAIClient } from './aiClient';
import { db } from '@/database/schema';

let aiClient: AIClient = new MockAIClient(); // Will be replaced with real client later

export async function generateReflectionForEntry(
  userId: number,
  entryId: number
): Promise<string> {
  const entry = await db.journalEntries.get(entryId);
  if (!entry) throw new Error('Entry not found');
  const reflection = await aiClient.generateReflection({
    title: entry.title,
    content: entry.content,
  });
  // Store reflection in database
  await db.aiReflections.add({
    userId,
    journalEntryId: entryId,
    content: reflection,
    type: 'entry_reflection',
    createdAt: new Date(),
  });
  return reflection;
}
