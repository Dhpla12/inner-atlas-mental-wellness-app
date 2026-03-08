import { createClient } from '@/lib/supabase/server'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get recent journal entries
    const { data: entries, error: entriesError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (entriesError) throw entriesError

    // Get recent mood data
    const { data: moods, error: moodsError } = await supabase
      .from('mood_snapshots')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (moodsError) throw moodsError

    // Get habit data
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)

    if (habitsError) throw habitsError

    // Prepare context for AI
    const context = {
      recentEntries: entries?.map((e: any) => ({
        title: e.title,
        content: e.content.substring(0, 500),
        mood: e.mood,
        date: e.created_at,
      })) || [],
      moodTrend: moods?.map((m: any) => m.mood) || [],
      activeHabits: habits?.map((h: any) => ({
        name: h.name,
        streak: h.current_streak,
      })) || [],
    }

    // Generate insight using AI
    const prompt = `Based on this user's wellness data, provide a personalized, encouraging insight about their patterns and progress. Keep it concise (2-3 sentences), warm, and actionable.

Recent Journal Entries:
${context.recentEntries.map((e: any) => `- ${e.title} (${e.mood} mood): ${e.content}`).join('\n')}

Mood Trend (last 10): ${context.moodTrend.join(', ') || 'No data'}

Active Habits:
${context.activeHabits.map((h: any) => `- ${h.name}: ${h.streak} day streak`).join('\n')}

Provide an insight that acknowledges their progress and offers gentle guidance.`

    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt,
      temperature: 0.7,
      maxTokens: 200,
    })

    // Extract a title from the first sentence
    const text = result.text
    const firstSentence = text.split('.')[0] + '.'
    const title = firstSentence.length > 100 
      ? firstSentence.substring(0, 100) + '...'
      : firstSentence

    // Save insight to database
    const { data: insight, error: saveError } = await supabase
      .from('insights')
      .insert({
        user_id: userId,
        title: title,
        content: text,
      })
      .select()
      .single()

    if (saveError) throw saveError

    return NextResponse.json({
      success: true,
      insight,
    })
  } catch (error) {
    console.error('Error generating insight:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate insight',
      },
      { status: 500 }
    )
  }
}
