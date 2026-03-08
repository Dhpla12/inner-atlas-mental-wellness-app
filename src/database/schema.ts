import Dexie, { Table } from 'dexie';

export interface User {
  id?: number;
  username?: string;
  email?: string;
  hashedPasscode?: string; // for passcode lock
  theme: 'minimalist' | 'calm' | 'nature';
  tier: 'free' | 'premium';
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalEntry {
  id?: number;
  userId: number;
  title: string;
  content: string;
  moodScore?: number; // 1-5
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MoodEntry {
  id?: number;
  userId: number;
  date: Date; // day of mood
  moodScore: number; // 1-5
  notes?: string;
  createdAt: Date;
}

export interface Habit {
  id?: number;
  userId: number;
  name: string;
  description?: string;
  targetFrequency: 'daily' | 'weekly' | 'monthly'; // simple for now
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitCompletion {
  id?: number;
  habitId: number;
  date: Date; // day of completion
  completed: boolean; // true for completed, false for skipped
  createdAt: Date;
}

export interface AIReflection {
  id?: number;
  userId: number;
  journalEntryId?: number; // optional, if generated from entry
  content: string;
  type: 'entry_reflection' | 'weekly_summary' | 'chat';
  createdAt: Date;
}

export interface InsightReport {
  id?: number;
  userId: number;
  type: 'weekly' | 'monthly' | 'correlation';
  data: any; // JSON
  createdAt: Date;
}

export interface AIUsage {
  id?: number;
  userId: number;
  date: Date; // day
  requestsUsed: number;
}

export interface Settings {
  id?: number;
  userId: number;
  passcodeEnabled: boolean;
  autoLockMinutes: number;
  cloudSyncEnabled: boolean;
  updatedAt: Date;
}

export class InnerAtlasDB extends Dexie {
  users!: Table<User, number>;
  journalEntries!: Table<JournalEntry, number>;
  moodEntries!: Table<MoodEntry, number>;
  habits!: Table<Habit, number>;
  habitCompletions!: Table<HabitCompletion, number>;
  aiReflections!: Table<AIReflection, number>;
  insightReports!: Table<InsightReport, number>;
  aiUsage!: Table<AIUsage, number>;
  settings!: Table<Settings, number>;

  constructor() {
    super('InnerAtlasDB');
    this.version(1).stores({
      users: '++id, username, email, tier',
      journalEntries: '++id, userId, createdAt',
      moodEntries: '++id, userId, date',
      habits: '++id, userId',
      habitCompletions: '++id, habitId, date',
      aiReflections: '++id, userId, journalEntryId, createdAt',
      insightReports: '++id, userId, type, createdAt',
      aiUsage: '++id, userId, date',
      settings: '++id, userId',
    });
  }
}

export const db = new InnerAtlasDB();
