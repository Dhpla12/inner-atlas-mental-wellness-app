import { createClient } from '@/lib/supabase/server'

export async function createJournalEntry(
  userId: string,
  title: string,
  content: string,
  mood: string
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: userId,
      title,
      content,
      mood,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getJournalEntries(userId: string, limit = 50) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function getJournalEntry(userId: string, entryId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', entryId)
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateJournalEntry(
  userId: string,
  entryId: string,
  updates: { title?: string; content?: string; mood?: string }
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('journal_entries')
    .update(updates)
    .eq('id', entryId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteJournalEntry(userId: string, entryId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function recordMoodSnapshot(userId: string, mood: string, intensity: number) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('mood_snapshots')
    .insert({
      user_id: userId,
      mood,
      intensity,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMoodHistory(userId: string, days = 30) {
  const supabase = await createClient()
  
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)

  const { data, error } = await supabase
    .from('mood_snapshots')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', fromDate.toISOString())
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}
