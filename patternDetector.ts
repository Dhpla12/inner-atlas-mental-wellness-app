export interface Pattern {
  type: 'weekly_low' | 'habit_correlation' | 'keyword_cluster';
  description: string;
  confidence: number;
  data: any;
}

export async function detectEmotionalPatterns(userId: number): Promise<Pattern[]> {
  const patterns: Pattern[] = [];

  // 1. Weekly low mood detection
  const moods = await db.moodEntries.where('userId').equals(userId).toArray();
  if (moods.length > 10) {
    const dayOfWeekScores: number[][] = [[], [], [], [], [], [], []];
    moods.forEach((m) => {
      const day = m.date.getDay();
      dayOfWeekScores[day].push(m.moodScore);
    });
    const avgByDay = dayOfWeekScores.map((scores) =>
      scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    );
    const minDay = avgByDay.indexOf(Math.min(...avgByDay));
    if (avgByDay[minDay] < 2.5) {
      patterns.push({
        type: 'weekly_low',
        description: `Your mood tends to be lowest on ${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][minDay]}.`,
        confidence: 0.7,
        data: { day: minDay, averageMood: avgByDay[minDay] },
      });
    }
  }

  // 2. Habit correlation (simplified)
  const habits = await db.habits.where('userId').equals(userId).toArray();
  for (const habit of habits) {
    const completions = await db.habitCompletions.where('habitId').equals(habit.id!).toArray();
    // ... correlate with mood
  }

  return patterns;
}
