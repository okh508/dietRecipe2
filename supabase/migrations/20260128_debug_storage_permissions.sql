-- DEBUG: Universal Access to 'avatars' bucket
-- This removes all restrictions to see if it fixes the "Bucket not found" error.

-- 1. Ensure bucket is public
update storage.buckets set public = true where id = 'avatars';

-- 2. Drop existing policies to avoid conflicts
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Insert" on storage.objects;
drop policy if exists "Authenticated Update" on storage.objects;
drop policy if exists "Universal Access" on storage.objects;

-- 3. Create a Universal Access policy (No auth required, just bucket match)
create policy "Universal Access"
on storage.objects for all
using ( bucket_id = 'avatars' )
with check ( bucket_id = 'avatars' );

-- 4. Try to unhide the bucket list (Policies on storage.buckets)
drop policy if exists "List Buckets" on storage.buckets;
create policy "List Buckets"
on storage.buckets for select
using ( true );
