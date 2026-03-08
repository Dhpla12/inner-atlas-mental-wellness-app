'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Brain, Sparkles } from 'lucide-react'

export default function InsightsPage() {
  const [insights, setInsights] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    loadInsights()
  }, [])

  const loadInsights = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setInsights(data || [])
    } catch (error) {
      console.error('Error loading insights:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateInsights = async () => {
    setIsGenerating(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const response = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      if (!response.ok) throw new Error('Failed to generate insights')
      
      loadInsights()
    } catch (error) {
      console.error('Error generating insights:', error)
    } finally {
      setIsGenerating(false)
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
          <h1 className="text-4xl font-bold text-foreground">AI Insights</h1>
          <p className="text-muted-foreground">
            Personalized reflections powered by AI
          </p>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateInsights}
          disabled={isGenerating}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto"
        >
          <Sparkles className="h-4 w-4" />
          {isGenerating ? 'Generating Insights...' : 'Generate New Insights'}
        </Button>

        {/* Insights List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading insights...</p>
          </div>
        ) : insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="border border-border hover:border-primary/50 hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">{insight.title}</h3>
                        <p className="text-muted-foreground mt-2">{insight.content}</p>
                        <p className="text-xs text-muted-foreground mt-4">
                          {new Date(insight.created_at).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-dashed border-border">
            <CardContent className="p-12 text-center space-y-4">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
              <p className="text-muted-foreground text-lg">No insights yet</p>
              <p className="text-sm text-muted-foreground">Generate AI-powered insights from your journal entries</p>
              <Button
                onClick={generateInsights}
                disabled={isGenerating}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Generate Your First Insight
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
