
CREATE TABLE IF NOT EXISTS public.scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL CHECK (score >= 0),
  game_type text NOT NULL CHECK (game_type IN ('pokemon', 'fortnite', 'starwars')),
  time_seconds integer CHECK (time_seconds >= 0),
  streak_best integer DEFAULT 0 CHECK (streak_best >= 0),
  created_at timestamptz DEFAULT now()
);


CREATE INDEX IF NOT EXISTS idx_scores_game_type_score ON public.scores (game_type, score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_created_at ON public.scores (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scores_game_type_time ON public.scores (game_type, time_seconds ASC) WHERE time_seconds IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.matches (
  id text PRIMARY KEY,
  state jsonb NOT NULL,
  game_type text NOT NULL CHECK (game_type IN ('pokemon', 'fortnite', 'starwars')),
  is_active boolean DEFAULT true,
  player_count integer DEFAULT 1 CHECK (player_count > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_matches_active ON public.matches (is_active, created_at DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_matches_game_type ON public.matches (game_type, created_at DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS set_updated_at ON public.matches;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.matches
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- Optional: Row Level Security (RLS) policies
-- Uncomment if you want to enable RLS for security

ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read scores (leaderboard is public)
CREATE POLICY "Scores are publicly readable" ON public.scores
  FOR SELECT USING (true);

-- Allow anyone to insert their own score
CREATE POLICY "Anyone can insert scores" ON public.scores
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read active matches
CREATE POLICY "Matches are publicly readable" ON public.matches
  FOR SELECT USING (true);

-- Allow anyone to create and update matches
CREATE POLICY "Anyone can create matches" ON public.matches
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update matches" ON public.matches
  FOR UPDATE USING (true);

