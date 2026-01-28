-- Add avatar_url to user_profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create a storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Set up access controls for storage
-- Allow public access to view avatars
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatar
create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Allow users to update their own avatar
create policy "Anyone can update their own avatar."
  on storage.objects for update
  using ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );
