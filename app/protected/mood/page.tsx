'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, TrendingUp } from 'lucide-react'

const MOODS = [
  { value: 'happy', label: 'Happy', emoji: '😊', color: '#f4d35e' },
  { value: 'calm', label: 'Calm', emoji: '😌', color: '#7fb3a3' },
  { value: 'neutral', label: 'Neutral', emoji: '😐', color: '#9a938c' },
  { value: 'sad', label: 'Sad', emoji: '😢', color: '#a8dadc' },
  { value: 'anxious', label: 'Anxious', emoji: '😰', color: '#ff6b6b' },
]

export default function MoodPage() {
  const [moodHistory, setMoodHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)

  useEffect(() => {
    loadMoodHistory()
  }, [])

  const loadMoodHistory = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('mood_snapshots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      setMoodHistory(data || [])
    } catch (error) {
      console.error('Error loading mood history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecordMood = async (moodValue: string) => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from('mood_snapshots').insert({
        user_id: user.id,
        mood: moodValue,
        intensity: 5, // Default intensity
      })

      if (error) throw error
      setSelectedMood(moodValue)
      setTimeout(() => loadMoodHistory(), 500)
    } catch (error) {
      console.error('Error recording mood:', error)
    }
  }

  const getMoodStats = () => {
    if (moodHistory.length === 0) return null

    const moodCounts = moodHistory.reduce(
      (acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const totalMoods = moodHistory.length
    const mostFrequent = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]

    return {
      totalMoods,
      moodCounts,
      mostFrequent,
    }
  }

  const stats = getMoodStats()

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Link href="/protected">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Mood Tracking</h1>
          <p className="text-muted-foreground">
            {moodHistory.length} {moodHistory.length === 1 ? 'mood' : 'moods'} recorded
          </p>
        </div>

        {/* How Are You Feeling */}
        <Card className="border border-primary/20 bg-card">
          <CardHeader>
            <CardTitle>How are you feeling right now?</CardTitle>
            <CardDescription>Log your current mood to track your emotional well-being</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {MOODS.map(({ value, emoji, label, color }) => (
                <button
                  key={value}
                  onClick={() => handleRecordMood(value)}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedMood === value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 bg-background'
                  }`}
                >
                  <div className="text-4xl mb-2">{emoji}</div>
                  <div className="text-sm font-medium text-foreground">{label}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Most Common Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.mostFrequent && (
                  <div className="space-y-2">
                    <div className="text-3xl font-bold capitalize">
                      {MOODS.find((m) => m.value === stats.mostFrequent[0])?.emoji}
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      {stats.mostFrequent[0]}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats.mostFrequent[1]} {stats.mostFrequent[1] === 1 ? 'time' : 'times'} recorded
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Mood Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MOODS.map(({ value, label, emoji, color }) => {
                    const count = stats.moodCounts[value] || 0
                    const percentage = Math.round((count / stats.totalMoods) * 100)
                    return (
                      <div key={value} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span>{emoji}</span>
                            <span className="text-foreground font-medium">{label}</span>
                          </span>
                          <span className="text-muted-foreground">{percentage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Moods */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading mood history...</p>
          </div>
        ) : moodHistory.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Recent Mood Log</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {moodHistory.slice(0, 20).map((entry, index) => {
                const mood = MOODS.find((m) => m.value === entry.mood)
                return (
                  <Card key={entry.id} className="border border-border hover:border-primary/50 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{mood?.emoji}</span>
                          <div>
                            <p className="font-semibold text-foreground capitalize">{entry.mood}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(entry.created_at).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: mood?.color }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : (
          <Card className="border border-dashed border-border">
            <CardContent className="p-12 text-center space-y-4">
              <p className="text-muted-foreground text-lg">No mood entries yet</p>
              <p className="text-sm text-muted-foreground">Start tracking your mood to see patterns and insights</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
