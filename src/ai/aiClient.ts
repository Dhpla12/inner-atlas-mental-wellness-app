export interface AIClient {
  generateReflection(entry: { title: string; content: string }): Promise<string>;
  detectEmotionalPatterns(entries: Array<{ content: string; moodScore?: number }>): Promise<any>;
  generateWeeklyReport(data: any): Promise<string>;
  chat(message: string, context?: any): Promise<string>;
}

export class MockAIClient implements AIClient {
  async generateReflection(entry: { title: string; content: string }): Promise<string> {
    return `I notice you wrote about "${entry.title}". It sounds like you're processing some emotions. Remember to be kind to yourself.`;
  }
  async detectEmotionalPatterns(entries: any[]): Promise<any> {
    return { patterns: [], summary: 'Your mood seems stable this week.' };
  }
  async generateWeeklyReport(data: any): Promise<string> {
    return 'This week you had 3 high‑mood days and 2 low‑mood days. Your journal entries often mentioned "work" on low days.';
  }
  async chat(message: string, context?: any): Promise<string> {
    return "I'm here to listen. Tell me more.";
  }
}
