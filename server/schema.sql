-- Create the scores table
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  game_mode TEXT NOT NULL,
  category TEXT DEFAULT 'all',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast leaderboard queries
CREATE INDEX IF NOT EXISTS idx_scores_game_mode_score ON scores (game_mode, score DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Allow public read access to the leaderboard
CREATE POLICY "Allow public read access to scores" ON scores
  FOR SELECT USING (true);

-- Allow authenticated users to insert their own scores
CREATE POLICY "Allow authenticated users to insert their own scores" ON scores
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);
