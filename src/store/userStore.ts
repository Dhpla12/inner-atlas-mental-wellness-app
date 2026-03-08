import { create } from 'zustand';
import { db, User } from '@/database/schema';
import { encryptPasscode } from '@/utils/encryption';

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (userId: number) => Promise<void>;
  register: (userData: Partial<User>) => Promise<User>;
  updateUser: (userId: number, updates: Partial<User>) => Promise<void>;
  setPasscode: (userId: number, passcode: string) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  isLoading: false,
  error: null,
  login: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const user = await db.users.get(userId);
      if (!user) throw new Error('User not found');
      set({ currentUser: user, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const id = await db.users.add({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        tier: 'free',
        theme: 'minimalist',
      } as User);
      const user = await db.users.get(id);
      set({ currentUser: user!, isLoading: false });
      return user!;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  updateUser: async (userId, updates) => {
    await db.users.update(userId, { ...updates, updatedAt: new Date() });
    const updated = await db.users.get(userId);
    set((state) => ({ currentUser: updated }));
  },
  setPasscode: async (userId, passcode) => {
    const hashed = await encryptPasscode(passcode);
    await db.users.update(userId, { hashedPasscode: hashed });
  },
  logout: () => set({ currentUser: null }),
}));
