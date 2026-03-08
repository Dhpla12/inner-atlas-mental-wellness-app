import { db } from '@/database/schema';

export async function checkAIUsageLimit(userId: number): Promise<boolean> {
  const user = await db.users.get(userId);
  if (!user) return false;
  if (user.tier === 'premium') return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const usage = await db.aiUsage
    .where('userId')
    .equals(userId)
    .and((u) => u.date >= today)
    .first();

  const used = usage?.requestsUsed || 0;
  return used < 5; // free tier limit
}

export async function incrementAIUsage(userId: number): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const usage = await db.aiUsage
    .where('userId')
    .equals(userId)
    .and((u) => u.date >= today)
    .first();

  if (usage) {
    await db.aiUsage.update(usage.id!, { requestsUsed: usage.requestsUsed + 1 });
  } else {
    await db.aiUsage.add({ userId, date: today, requestsUsed: 1 });
  }
}
