import { db, Habit, HabitCompletion } from '@/database/schema';

export async function createHabit(
  habit: Omit<Habit, 'id'>
): Promise<number> {
  return db.habits.add({
    ...habit,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function completeHabit(
  habitId: number,
  date: Date = new Date()
): Promise<void> {
  // Check if already completed today
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  const existing = await db.habitCompletions
    .where('habitId')
    .equals(habitId)
    .and((c) => c.date >= start && c.date <= end)
    .first();
  if (existing) {
    // Toggle or just ignore? We'll update if needed.
    await db.habitCompletions.update(existing.id!, { completed: true });
  } else {
    await db.habitCompletions.add({
      habitId,
      date,
      completed: true,
      createdAt: new Date(),
    });
  }
}

export async function getHabitStreak(habitId: number): Promise<number> {
  const completions = await db.habitCompletions
    .where('habitId')
    .equals(habitId)
    .and((c) => c.completed)
    .toArray();
  // Sort descending by date
  completions.sort((a, b) => b.date.getTime() - a.date.getTime());
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  for (const completion of completions) {
    const compDate = new Date(completion.date);
    compDate.setHours(0, 0, 0, 0);
    if (compDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export async function calculateCompletionRate(
  habitId: number,
  start: Date,
  end: Date
): Promise<number> {
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const completions = await db.habitCompletions
    .where('habitId')
    .equals(habitId)
    .and((c) => c.date >= start && c.date <= end && c.completed)
    .toArray();
  return completions.length / totalDays;
}
