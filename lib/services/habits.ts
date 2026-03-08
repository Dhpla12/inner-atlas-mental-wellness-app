import { createClient } from '@/lib/supabase/server'

export async function createHabit(
  userId: string,
  name: string,
  description: string,
  category: string,
  frequency: string,
  color: string
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('habits')
    .insert({
      user_id: userId,
      name,
      description,
      category,
      frequency,
      color,
      current_streak: 0,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getHabits(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function logHabitCompletion(userId: string, habitId: string, date?: string) {
  const supabase = await createClient()
  
  const { data: habit, error: habitError } = await supabase
    .from('habits')
    .select('current_streak')
    .eq('id', habitId)
    .eq('user_id', userId)
    .single()

  if (habitError) throw habitError

  const { data, error } = await supabase
    .from('habit_logs')
    .insert({
      user_id: userId,
      habit_id: habitId,
      completed_date: date || new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  if (error) throw error

  // Update streak
  const newStreak = (habit?.current_streak || 0) + 1
  await supabase
    .from('habits')
    .update({ current_streak: newStreak })
    .eq('id', habitId)
    .eq('user_id', userId)

  return data
}

export async function getHabitLogs(userId: string, habitId: string, days = 30) {
  const supabase = await createClient()
  
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)

  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('habit_id', habitId)
    .gte('completed_date', fromDate.toISOString().split('T')[0])
    .order('completed_date', { ascending: true })

  if (error) throw error
  return data
}

export async function deleteHabit(userId: string, habitId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
    .eq('user_id', userId)

  if (error) throw error
}
