-- Fix Storage RLS Policies for Avatars (Simplified)

-- Note: We skip 'ALTER TABLE' because RLS is already enabled and we might not have permission to change table properties.

-- 1. Drop potential conflicting policies (cleaning up previous attempts)
drop policy if exists "Avatar images are publicly accessible." on storage.objects;
drop policy if exists "Anyone can upload an avatar." on storage.objects;
drop policy if exists "Anyone can update their own avatar." on storage.objects;
drop policy if exists "Authenticated users can upload avatars" on storage.objects;
drop policy if exists "Public access to avatars" on storage.objects;
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Insert" on storage.objects;
drop policy if exists "Authenticated Update" on storage.objects;

-- 2. Create policies
-- Allow anyone (public) to VIEW images in the 'avatars' bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Allow authenticated users to UPLOAD images to 'avatars'
create policy "Authenticated Insert"
on storage.objects for insert
with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- Allow authenticated users to UPDATE images in 'avatars'
create policy "Authenticated Update"
on storage.objects for update
using ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- 3. Ensure the bucket is public (in case it wasn't set correctly)
update storage.buckets
set public = true
where id = 'avatars';
