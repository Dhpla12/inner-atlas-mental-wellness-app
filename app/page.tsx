import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Target, Lightbulb, Wind, CheckCircle2, BarChart3 } from 'lucide-react'

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Reflective Journaling',
    description: 'Write your thoughts and feelings with mood tracking to understand your emotional patterns.',
  },
  {
    icon: Target,
    title: 'Habit Building',
    description: 'Create and track positive habits with streak motivation to build lasting routines.',
  },
  {
    icon: Lightbulb,
    title: 'AI-Powered Insights',
    description: 'Get personalized reflections and guidance based on your journal entries and mood data.',
  },
  {
    icon: Wind,
    title: 'Mindfulness Tools',
    description: 'Access guided meditations, breathing exercises, and daily affirmations for inner peace.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Visualize your mood trends, habit progress, and wellness patterns over time.',
  },
  {
    icon: CheckCircle2,
    title: 'Daily Reflections',
    description: 'Build self-awareness through consistent journaling and emotional tracking.',
  },
]

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/protected')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center justify-between px-6 md:px-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">IA</span>
            </div>
            <span className="font-semibold text-foreground">InnerAtlas</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 md:px-8 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
                Your Personal Wellness Companion
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                Journal your thoughts, track your mood, build habits, and discover AI-powered insights for your personal growth journey.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up" className="flex-1 sm:flex-none">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold gap-2">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/auth/login" className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full h-12 text-lg font-semibold">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="text-sm text-muted-foreground">
              No credit card required • Start free today
            </div>
          </div>
        </div>

        {/* Decorative background */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-8 py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Everything You Need for Wellness
            </h2>
            <p className="text-lg text-muted-foreground">
              InnerAtlas combines journaling, habit tracking, mood analytics, and AI insights in one beautiful app.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="space-y-4 p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-foreground">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 md:px-8 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="text-4xl md:text-5xl font-bold text-primary">∞</div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-foreground">Unlimited Entries</h3>
                <p className="text-muted-foreground">Journal as much as you want</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl md:text-5xl font-bold text-accent">AI</div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-foreground">AI Powered</h3>
                <p className="text-muted-foreground">Get personalized insights</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl md:text-5xl font-bold text-secondary">100%</div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-foreground">Private</h3>
                <p className="text-muted-foreground">Your data is always yours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-8 py-20 md:py-32 bg-gradient-to-r from-primary/10 to-accent/10 border-y border-border">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join hundreds of people improving their mental health and building better habits.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up" className="flex-1 sm:flex-none">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold">
                Create Free Account
              </Button>
            </Link>
            <Link href="/auth/login" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full h-12 text-lg font-semibold">
                Already Have an Account?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-lg">IA</span>
              </div>
              <span className="font-semibold text-foreground">InnerAtlas</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              © 2026 InnerAtlas. Designed for your wellness journey.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
