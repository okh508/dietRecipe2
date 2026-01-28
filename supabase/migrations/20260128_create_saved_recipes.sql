-- Create saved_recipes table
CREATE TABLE IF NOT EXISTS saved_recipes (
  user_id UUID REFERENCES auth.users NOT NULL,
  recipe_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, recipe_id)
);

-- Turn on Row Level Security
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own saved recipes
CREATE POLICY "Users can select their own saved recipes" ON saved_recipes
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own saved recipes
CREATE POLICY "Users can insert their own saved recipes" ON saved_recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own saved recipes
CREATE POLICY "Users can delete their own saved recipes" ON saved_recipes
  FOR DELETE USING (auth.uid() = user_id);
