-- FINAL PERMISSION FIX: Apply policies to the Dashboard-created bucket

-- 1. Allow everyone to SEE the list of buckets (Fixes "Buckets found: None")
drop policy if exists "Public List Buckets" on storage.buckets;
create policy "Public List Buckets"
on storage.buckets for select
to public
using ( true );

-- 2. Allow everyone to UPLOAD to 'avatars' (Fixes "Bucket not found" on upload)
-- Note: 'to public' includes both Anon and Logged In users.
drop policy if exists "Public Upload avatars" on storage.objects;
create policy "Public Upload avatars"
on storage.objects for insert
to public
with check ( bucket_id = 'avatars' );

-- 3. Allow everyone to VIEW images in 'avatars'
drop policy if exists "Public View avatars" on storage.objects;
create policy "Public View avatars"
on storage.objects for select
to public
using ( bucket_id = 'avatars' );

-- 4. Allow everyone to UPDATE images in 'avatars'
drop policy if exists "Public Update avatars" on storage.objects;
create policy "Public Update avatars"
on storage.objects for update
to public
using ( bucket_id = 'avatars' );

-- 5. Final Grant Check (Boilerplate to ensure no role is blocked)
grant usage on schema storage to anon, authenticated;
grant all privileges on all tables in schema storage to anon, authenticated;
