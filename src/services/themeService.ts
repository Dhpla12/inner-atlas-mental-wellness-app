import { db } from '@/database/schema';

export async function setTheme(userId: number, theme: 'minimalist' | 'calm' | 'nature') {
  await db.users.update(userId, { theme, updatedAt: new Date() });
  // Apply theme to document root
  document.documentElement.setAttribute('data-theme', theme);
}

export async function loadTheme(userId: number) {
  const user = await db.users.get(userId);
  if (user?.theme) {
    document.documentElement.setAttribute('data-theme', user.theme);
  }
}
