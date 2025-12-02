-- Supabase / Postgres schema for MemoryVerse

-- Enable pgcrypto or use gen_random_uuid() if available
-- Create scores table
CREATE TABLE IF NOT EXISTS public.scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL,
  game_type text NOT NULL,
  time_seconds integer,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scores_game_type_score ON public.scores (game_type, score DESC);

-- Create matches table for storing realtime game state
CREATE TABLE IF NOT EXISTS public.matches (
  id text PRIMARY KEY,
  state jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Trigger to update updated_at on change
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_updated_at ON public.matches;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.matches
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();
