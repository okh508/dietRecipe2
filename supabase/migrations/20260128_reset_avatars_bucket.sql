-- DATA LOSS WARNING: This deletes current 'avatars' settings to fix permission errors
-- 1. Clean up existing bucket (if any)
delete from storage.objects where bucket_id = 'avatars';
delete from storage.buckets where id = 'avatars';

-- 2. Re-create the bucket correctly
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- 3. Cleanup old policies
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Insert" on storage.objects;
drop policy if exists "Authenticated Update" on storage.objects;
drop policy if exists "Avatar images are publicly accessible." on storage.objects;
drop policy if exists "Anyone can upload an avatar." on storage.objects;
drop policy if exists "Anyone can update their own avatar." on storage.objects;

-- 4. Create correct policies
-- Allow anyone (public) to VIEW images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Allow authenticated users to UPLOAD images
create policy "Authenticated Insert"
on storage.objects for insert
with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- Allow authenticated users to UPDATE images
create policy "Authenticated Update"
on storage.objects for update
using ( bucket_id = 'avatars' and auth.role() = 'authenticated' );
