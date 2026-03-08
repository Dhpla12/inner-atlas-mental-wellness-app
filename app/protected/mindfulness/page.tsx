'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Wind, PlayCircle, RotateCcw } from 'lucide-react'

const MEDITATIONS = [
  {
    id: 1,
    title: 'Morning Meditation',
    description: 'Start your day with clarity and purpose',
    duration: 5,
    color: '#f4d35e',
  },
  {
    id: 2,
    title: 'Stress Relief',
    description: 'Release tension and anxiety with deep breathing',
    duration: 10,
    color: '#7fb3a3',
  },
  {
    id: 3,
    title: 'Evening Calm',
    description: 'Wind down and prepare for restful sleep',
    duration: 8,
    color: '#a8dadc',
  },
  {
    id: 4,
    title: 'Focus Booster',
    description: 'Enhance concentration and mental clarity',
    duration: 7,
    color: '#4a90a4',
  },
]

const BREATHING_EXERCISES = [
  {
    id: 1,
    name: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8',
    cycles: 4,
  },
  {
    id: 2,
    name: 'Box Breathing',
    description: 'Equal counts of 4 for each phase',
    cycles: 5,
  },
  {
    id: 3,
    name: 'Deep Breathing',
    description: 'Slow, deep breathing exercise',
    cycles: 6,
  },
]

const AFFIRMATIONS = [
  'I am capable of handling any challenge.',
  'My mental health is a priority.',
  'I choose to focus on what I can control.',
  'Every day is a fresh start.',
  'I am growing and improving every day.',
  'My challenges are opportunities to grow.',
  'I deserve rest and relaxation.',
  'I am grateful for my journey.',
]

export default function MindfulnessPage() {
  const [selectedMeditation, setSelectedMeditation] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [selectedBreathing, setSelectedBreathing] = useState<any>(null)
  const [breathingCycle, setBreathingCycle] = useState(0)
  const [isBreathingActive, setIsBreathingActive] = useState(false)
  const [affirmationIndex, setAffirmationIndex] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isPlaying && timeLeft === 0 && selectedMeditation) {
      setIsPlaying(false)
    }
    return () => clearInterval(timer)
  }, [isPlaying, timeLeft, selectedMeditation])

  const startMeditation = (meditation: any) => {
    setSelectedMeditation(meditation)
    setTimeLeft(meditation.duration * 60)
    setIsPlaying(true)
  }

  const startBreathing = (exercise: any) => {
    setSelectedBreathing(exercise)
    setBreathingCycle(0)
    setIsBreathingActive(true)
  }

  const nextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % AFFIRMATIONS.length)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
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
          <h1 className="text-4xl font-bold text-foreground">Mindfulness Tools</h1>
          <p className="text-muted-foreground">
            Take a moment to center yourself
          </p>
        </div>

        {/* Affirmation of the Day */}
        <Card className="border border-secondary/30 bg-gradient-to-r from-secondary/10 to-accent/10">
          <CardContent className="p-8 text-center space-y-4">
            <Wind className="h-8 w-8 text-primary mx-auto" />
            <div className="space-y-3">
              <p className="text-lg text-muted-foreground">Today's Affirmation</p>
              <p className="text-2xl font-semibold text-foreground italic">
                {AFFIRMATIONS[affirmationIndex]}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={nextAffirmation}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Next Affirmation
            </Button>
          </CardContent>
        </Card>

        {/* Guided Meditations */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Guided Meditations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MEDITATIONS.map((meditation) => (
              <Card
                key={meditation.id}
                className={`border cursor-pointer transition-all ${
                  selectedMeditation?.id === meditation.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <CardContent className="p-5">
                  <div className="space-y-4">
                    <div
                      className="h-16 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: meditation.color + '30' }}
                    >
                      <Wind className="h-8 w-8" style={{ color: meditation.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{meditation.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {meditation.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {meditation.duration} minutes
                      </p>
                    </div>

                    {selectedMeditation?.id === meditation.id && isPlaying ? (
                      <div className="space-y-3">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-primary">
                            {formatTime(timeLeft)}
                          </p>
                        </div>
                        <Button
                          onClick={() => setIsPlaying(false)}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          Pause
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => startMeditation(meditation)}
                        className="w-full bg-primary hover:bg-primary/90 gap-2"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Start
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Breathing Exercises */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Breathing Exercises</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BREATHING_EXERCISES.map((exercise) => (
              <Card
                key={exercise.id}
                className={`border cursor-pointer transition-all ${
                  selectedBreathing?.id === exercise.id && isBreathingActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <CardContent className="p-5">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {exercise.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {exercise.cycles} cycles
                      </p>
                    </div>

                    {selectedBreathing?.id === exercise.id && isBreathingActive ? (
                      <div className="space-y-3">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Cycle</p>
                          <p className="text-3xl font-bold text-primary">
                            {breathingCycle + 1}/{exercise.cycles}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            if (breathingCycle < exercise.cycles - 1) {
                              setBreathingCycle((prev) => prev + 1)
                            } else {
                              setIsBreathingActive(false)
                              setSelectedBreathing(null)
                            }
                          }}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          {breathingCycle < exercise.cycles - 1 ? 'Next Cycle' : 'Complete'}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => startBreathing(exercise)}
                        className="w-full bg-primary hover:bg-primary/90 gap-2"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Start
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
