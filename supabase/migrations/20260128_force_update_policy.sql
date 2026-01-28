-- FORCE ENABLE RLS UPDATE PERMISSION
-- Run this to allow saving your profile settings

-- 1. Ensure RLS is on
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop potential conflicting policies
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- 3. Re-create the critical policies for Saving
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Grant access to authenticated users (just in case)
GRANT ALL ON user_profiles TO authenticated;
