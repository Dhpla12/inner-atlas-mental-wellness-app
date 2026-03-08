export async function encryptData(data: any, password: string): Promise<string> {
  // Use Web Crypto to encrypt with a key derived from password
  // Stub
  return JSON.stringify(data);
}

export async function decryptData(encrypted: string, password: string): Promise<any> {
  // Stub
  return {};
}

export async function uploadBackup(userId: number, password: string): Promise<void> {
  // Gather all user data
  const user = await db.users.get(userId);
  const entries = await db.journalEntries.where('userId').equals(userId).toArray();
  const moods = await db.moodEntries.where('userId').equals(userId).toArray();
  // ... etc.
  const backup = { user, entries, moods };
  const encrypted = await encryptData(backup, password);
  // Send to server (fetch)
  console.log('Upload backup', encrypted);
}

export async function downloadBackup(userId: number, password: string): Promise<void> {
  // Fetch encrypted data, decrypt, and merge
}
