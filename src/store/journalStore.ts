import { create } from 'zustand';
import { db, JournalEntry } from '@/database/schema';
import * as journalService from '@/services/journalService';

interface JournalState {
  entries: JournalEntry[];
  currentEntry: JournalEntry | null;
  isLoading: boolean;
  error: string | null;
  fetchEntries: (userId: number) => Promise<void>;
  getEntry: (id: number) => Promise<void>;
  addEntry: (entry: Omit<JournalEntry, 'id'>) => Promise<JournalEntry>;
  updateEntry: (id: number, updates: Partial<JournalEntry>) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
  searchEntries: (query: string, userId: number) => Promise<JournalEntry[]>;
  setCurrentEntry: (entry: JournalEntry | null) => void;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  currentEntry: null,
  isLoading: false,
  error: null,
  fetchEntries: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const entries = await db.journalEntries
        .where('userId').equals(userId)
        .reverse()
        .sortBy('createdAt');
      set({ entries, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  getEntry: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const entry = await db.journalEntries.get(id);
      set({ currentEntry: entry || null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  addEntry: async (entry) => {
    set({ isLoading: true, error: null });
    try {
      const id = await journalService.createJournalEntry(entry);
      const newEntry = await db.journalEntries.get(id);
      set((state) => ({
        entries: [newEntry!, ...state.entries],
        isLoading: false,
      }));
      return newEntry!;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  updateEntry: async (id, updates) => {
    await journalService.updateJournalEntry(id, updates);
    const updated = await db.journalEntries.get(id);
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? updated! : e)),
      currentEntry: updated,
    }));
  },
  deleteEntry: async (id) => {
    await journalService.deleteJournalEntry(id);
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
      currentEntry: state.currentEntry?.id === id ? null : state.currentEntry,
    }));
  },
  searchEntries: async (query, userId) => {
    // simple search in title/content
    const all = await db.journalEntries.where('userId').equals(userId).toArray();
    return all.filter(
      (e) => e.title.includes(query) || e.content.includes(query)
    );
  },
  setCurrentEntry: (entry) => set({ currentEntry: entry }),
}));
