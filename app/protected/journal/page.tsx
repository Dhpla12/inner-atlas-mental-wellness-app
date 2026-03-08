'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, ArrowLeft, Trash2 } from 'lucide-react'

const MOODS = [
  { value: 'happy', label: '😊 Happy', color: '#f4d35e' },
  { value: 'calm', label: '😌 Calm', color: '#7fb3a3' },
  { value: 'neutral', label: '😐 Neutral', color: '#9a938c' },
  { value: 'sad', label: '😢 Sad', color: '#a8dadc' },
  { value: 'anxious', label: '😰 Anxious', color: '#ff6b6b' },
]

export default function JournalPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('neutral')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error('Error loading entries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from('journal_entries').insert({
        user_id: user.id,
        title,
        content,
        mood,
      })

      if (error) throw error

      setTitle('')
      setContent('')
      setMood('neutral')
      setShowNew(false)
      loadEntries()
    } catch (error) {
      console.error('Error creating entry:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id)

      if (error) throw error
      loadEntries()
    } catch (error) {
      console.error('Error deleting entry:', error)
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
          <h1 className="text-4xl font-bold text-foreground">My Journal</h1>
          <p className="text-muted-foreground">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>

        {/* New Entry Form */}
        {showNew && (
          <Card className="border border-primary/20 bg-card">
            <CardHeader>
              <CardTitle>New Entry</CardTitle>
              <CardDescription>Write your thoughts and feelings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                  <Input
                    id="title"
                    placeholder="Give your entry a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 bg-background border-border"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">How are you feeling?</Label>
                  <div className="grid grid-cols-5 gap-3">
                    {MOODS.map(({ value, label, color }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setMood(value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          mood === value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50 bg-background'
                        }`}
                      >
                        <div className="text-center text-sm">{label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="content" className="text-sm font-medium">Your Thoughts</Label>
                  <textarea
                    id="content"
                    placeholder="Write your thoughts, feelings, and reflections..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-2 w-full p-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background resize-none"
                    rows={8}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Entry'}
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
            New Entry
          </Button>
        )}

        {/* Entries List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading entries...</p>
          </div>
        ) : entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Link key={entry.id} href={`/protected/journal/${entry.id}`}>
                <Card className="border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-foreground">{entry.title}</h3>
                          <span
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium"
                            style={{ backgroundColor: entry.mood === 'happy' ? '#f4d35e' : entry.mood === 'calm' ? '#7fb3a3' : entry.mood === 'sad' ? '#a8dadc' : entry.mood === 'anxious' ? '#ff6b6b' : '#9a938c' }}
                          >
                            {entry.mood.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-muted-foreground line-clamp-2">{entry.content}</p>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          handleDelete(entry.id)
                        }}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border border-dashed border-border">
            <CardContent className="p-12 text-center space-y-4">
              <p className="text-muted-foreground text-lg">No entries yet</p>
              <p className="text-sm text-muted-foreground">Start your journaling journey by creating your first entry</p>
              <Button
                onClick={() => setShowNew(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Plus className="h-4 w-4" />
                Write Your First Entry
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
