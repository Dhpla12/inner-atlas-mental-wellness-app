# InnerAtlas - Your Wellness Companion

A beautiful, AI-powered wellness app that combines journaling, mood tracking, habit building, and mindfulness tools in one serene experience.

## Features

- **Reflective Journaling** - Write and organize your thoughts with mood tracking
- **Mood Analytics** - Visualize your emotional patterns and trends over time
- **Habit Tracking** - Build positive routines with streak motivation
- **AI Insights** - Receive personalized reflections powered by AI
- **Mindfulness Tools** - Access guided meditations, breathing exercises, and affirmations
- **Beautiful Design** - A calming, nature-inspired interface for your wellness journey

## Tech Stack

- **Frontend**: Next.js 16, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase PostgreSQL with Row-Level Security
- **AI**: Vercel AI SDK 6 (OpenAI GPT-4o-mini)
- **Authentication**: Supabase Auth with Email/Password

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account and project
- OpenAI API access (via Vercel AI Gateway)

### Installation

1. **Clone and install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
   ```

3. **Database Setup:**
   The SQL schema is in `/scripts/001_init_database.sql`. Execute this in your Supabase SQL editor to create all tables with proper RLS policies.

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  ├── page.tsx                 # Landing page
  ├── auth/                    # Authentication pages (login, signup)
  ├── protected/               # Protected app pages
  │   ├── page.tsx            # Dashboard
  │   ├── journal/            # Journaling
  │   ├── mood/               # Mood tracking
  │   ├── habits/             # Habit management
  │   ├── insights/           # AI insights
  │   └── mindfulness/        # Meditation & breathing
  └── api/                    # API routes
      └── insights/generate/  # AI insight generation

lib/
  ├── supabase/              # Supabase client setup
  └── services/              # Database service functions

components/
  ├── navigation.tsx         # Main navigation
  └── ui/                   # shadcn/ui components
```

## Key Features Explained

### Journaling
Write entries with mood tracking. Each entry is secured with Row-Level Security so users only see their own entries.

### Mood Tracking
Log your current mood with visual analytics showing mood distribution and trends over the past 7-30 days.

### Habit Building
Create habits with colors, categories, and frequencies. Log completions to build streaks and maintain motivation.

### AI Insights
Automatically generate personalized insights from your journal entries, moods, and habits using GPT-4o-mini.

### Mindfulness
Access pre-built meditations, guided breathing exercises (4-7-8, Box Breathing), and daily affirmations.

## Database Schema

The app uses 7 main tables:
- `profiles` - User profiles with metadata
- `journal_entries` - Journal entries with mood
- `mood_snapshots` - Point-in-time mood logs
- `habits` - User habits with streak tracking
- `habit_logs` - Individual habit completion logs
- `insights` - AI-generated insights
- `meditation_sessions` - Meditation history (optional)

All tables have Row-Level Security (RLS) enabled so users can only access their own data.

## Security

- Row-Level Security (RLS) on all tables
- Email verification required for signup
- Secure session management with HTTP-only cookies
- Server-side validation on all mutations
- No sensitive data stored on client

## Deployment

Deploy to Vercel with a single click:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

The app is optimized for Vercel deployment with Next.js 16 and Serverless Functions.

## Future Enhancements

- Push notifications for habit reminders
- Social sharing of insights (anonymized)
- Export journal entries as PDF
- Custom meditation uploads
- Integration with calendar apps
- Dark mode theme
- Mobile app (React Native)

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
