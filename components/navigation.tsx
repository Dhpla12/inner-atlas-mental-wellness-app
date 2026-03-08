'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, BookOpen, Target, Lightbulb, Wind } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface NavigationProps {
  user: any
}

const navItems = [
  { href: '/protected', label: 'Dashboard', icon: BookOpen },
  { href: '/protected/journal', label: 'Journal', icon: BookOpen },
  { href: '/protected/mood', label: 'Mood', icon: Target },
  { href: '/protected/habits', label: 'Habits', icon: Target },
  { href: '/protected/insights', label: 'Insights', icon: Lightbulb },
  { href: '/protected/mindfulness', label: 'Mindfulness', icon: Wind },
]

export default function Navigation({ user }: NavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
      <div className="flex h-16 items-center justify-between px-6 md:px-8">
        <Link href="/protected" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-lg">IA</span>
          </div>
          <span className="font-semibold text-foreground hidden sm:inline">InnerAtlas</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">{user?.email?.split('@')[0]}</p>
            <p className="text-xs text-muted-foreground">Wellness Journey</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{isLoading ? 'Signing out...' : 'Sign Out'}</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-border bg-background px-3 py-2 flex gap-1 overflow-x-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
