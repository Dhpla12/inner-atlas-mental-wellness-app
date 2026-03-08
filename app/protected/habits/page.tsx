'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, ArrowLeft, Trash2, CheckCircle2, Circle } from 'lucide-react'

const COLORS = ['#6b9e8f', '#4a90a4', '#d4a574', '#f4d35e', '#a8dadc', '#ff6b6b']
const CATEGORIES = ['Health', 'Wellness', 'Learning', 'Productivity', 'Mindfulness', 'Exercise']
const FREQUENCIES = ['Daily', 'Weekly', 'Monthly']

export default function HabitsPage() {
  const router = useRouter()
  const [habits, setHabits] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Health')
  const [frequency, setFrequency] = useState('Daily')
  const [color, setColor] = useState(COLORS[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadHabits()
  }, [])

  const loadHabits = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setHabits(data || [])
    } catch (error) {
      console.error('Error loading habits:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from('habits').insert({
        user_id: user.id,
        name,
        description,
        category,
        frequency,
        color,
        current_streak: 0,
      })

      if (error) throw error

      setName('')
      setDescription('')
      setCategory('Health')
      setFrequency('Daily')
      setColor(COLORS[0])
      setShowNew(false)
      loadHabits()
    } catch (error) {
      console.error('Error creating habit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogCompletion = async (habitId: string) => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from('habit_logs').insert({
        user_id: user.id,
        habit_id: habitId,
        completed_date: new Date().toISOString().split('T')[0],
      })

      if (error) {
        // Might already be logged today, ignore
        return
      }

      // Update streak
      const habit = habits.find((h) => h.id === habitId)
      await supabase
        .from('habits')
        .update({ current_streak: (habit?.current_streak || 0) + 1 })
        .eq('id', habitId)

      loadHabits()
    } catch (error) {
      console.error('Error logging habit:', error)
    }
  }

  const handleDelete = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId)
        .eq('user_id', user.id)

      if (error) throw error
      loadHabits()
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

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
          <h1 className="text-4xl font-bold text-foreground">My Habits</h1>
          <p className="text-muted-foreground">
            {habits.length} {habits.length === 1 ? 'habit' : 'habits'} being tracked
          </p>
        </div>

        {/* New Habit Form */}
        {showNew && (
          <Card className="border border-primary/20 bg-card">
            <CardHeader>
              <CardTitle>Create New Habit</CardTitle>
              <CardDescription>Start building a positive routine</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Habit Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Morning Meditation, Exercise, Read"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 bg-background border-border"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Input
                    id="description"
                    placeholder="Why is this habit important to you?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 bg-background border-border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-2 w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="frequency" className="text-sm font-medium">Frequency</Label>
                    <select
                      id="frequency"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="mt-2 w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    >
                      {FREQUENCIES.map((freq) => (
                        <option key={freq} value={freq}>{freq}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Color</Label>
                  <div className="flex gap-3">
                    {COLORS.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setColor(col)}
                        className={`h-10 w-10 rounded-lg border-2 transition-all ${
                          color === col ? 'border-foreground' : 'border-border'
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Habit'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNew(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Create Button */}
        {!showNew && (
          <Button
            onClick={() => setShowNew(true)}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto"
          >
            <Plus className="h-4 w-4" />
            New Habit
          </Button>
        )}

        {/* Habits Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading habits...</p>
          </div>
        ) : habits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit) => (
              <Card
                key={habit.id}
                className="border border-border hover:border-primary/50 hover:shadow-md transition-all"
              >
                <CardContent className="p-5">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-foreground">{habit.name}</h3>
                          <div
                            className="h-4 w-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: habit.color }}
                          />
                        </div>
                        {habit.description && (
                          <p className="text-sm text-muted-foreground">{habit.description}</p>
                        )}
                        <div className="flex gap-2 pt-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {habit.category}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {habit.frequency}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(habit.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-primary">{habit.current_streak}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">day streak</p>
                          <p className="text-xs text-muted-foreground">keep it going!</p>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleLogCompletion(habit.id)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Log Today
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-dashed border-border">
            <CardContent className="p-12 text-center space-y-4">
              <p className="text-muted-foreground text-lg">No habits yet</p>
              <p className="text-sm text-muted-foreground">Create your first habit to start building positive routines</p>
              <Button
                onClick={() => setShowNew(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Your First Habit
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
