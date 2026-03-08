import { createClient } from '@/lib/supabase/server'
import { getJournalEntries, getMoodHistory } from '@/lib/services/journal'
import { getHabits } from '@/lib/services/habits'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, BookOpen, Target, TrendingUp } from 'lucide-react'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const userId = user.id

  try {
    const [entries, moodHistory, habits] = await Promise.all([
      getJournalEntries(userId, 5),
      getMoodHistory(userId, 7),
      getHabits(userId),
    ])

    const completedToday = habits.filter((h: any) => h.current_streak > 0).length
    const moodTrend = moodHistory.length > 0 ? moodHistory[moodHistory.length - 1]?.mood : 'neutral'

    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground text-lg">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{entries.length}</div>
                <p className="text-xs text-muted-foreground mt-1">journals written</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Habits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{habits.length}</div>
                <p className="text-xs text-muted-foreground mt-1">habits being tracked</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold capitalize text-secondary">{moodTrend}</div>
                <p className="text-xs text-muted-foreground mt-1">your recent mood</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Entries */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Recent Entries</h2>
              <Link href="/protected/journal">
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <PlusCircle className="h-4 w-4" />
                  New Entry
                </Button>
              </Link>
            </div>

            {entries.length > 0 ? (
              <div className="space-y-3">
                {entries.slice(0, 5).map((entry: any) => (
                  <Link key={entry.id} href={`/protected/journal/${entry.id}`}>
                    <Card className="border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{entry.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {entry.content}
                            </p>
                            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                              <span className="capitalize font-medium text-secondary">{entry.mood}</span>
                              <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="border border-dashed border-border">
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                  <p className="text-muted-foreground mb-4">No entries yet</p>
                  <Link href="/protected/journal">
                    <Button className="bg-primary hover:bg-primary/90">
                      Create Your First Entry
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Habits Overview */}
          {habits.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Habit Streaks</h2>
                <Link href="/protected/habits">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {habits.slice(0, 4).map((habit: any) => (
                  <Card key={habit.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground">{habit.name}</h3>
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: habit.color || '#6b9e8f' }}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-primary">{habit.current_streak}</span>
                          <span className="text-sm text-muted-foreground">day streak</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{habit.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="min-h-screen bg-background p-6 md:p-8 flex items-center justify-center">
        <Card className="border border-destructive">
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
            <CardDescription>Please try refreshing the page</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }
}
