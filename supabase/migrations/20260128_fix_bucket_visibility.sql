-- FIX: Allow listing buckets and open access to 'user_avatars'

-- 1. Ensure 'user_avatars' exists
insert into storage.buckets (id, name, public)
values ('user_avatars', 'user_avatars', true)
on conflict (id) do nothing;

-- 2. CRITICAL: Allow listing buckets (Fixes "Buckets found: None")
-- We try to enable RLS first (might fail if not owner, but that's fine if already enabled)
-- alter table storage.buckets enable row level security; 
drop policy if exists "Allow public list buckets" on storage.buckets;
create policy "Allow public list buckets"
on storage.buckets for select
using ( true );

-- 3. Reset policies for 'user_avatars' objects
drop policy if exists "Public Access user_avatars" on storage.objects;
drop policy if exists "Auth Upload user_avatars" on storage.objects;
drop policy if exists "Anon Upload user_avatars" on storage.objects; 
drop policy if exists "Avatar Auth Update" on storage.objects;
drop policy if exists "Avatar Public View" on storage.objects;

-- 4. Create Open Policies
-- READ: Everyone
create policy "Public Access user_avatars"
on storage.objects for select
using ( bucket_id = 'user_avatars' );

-- WRITE: Everyone (Temporarily allowing Anon to rule out Auth issues)
create policy "Anon Upload user_avatars"
on storage.objects for insert
with check ( bucket_id = 'user_avatars' );

-- UPDATE: Everyone
create policy "Anon Update user_avatars"
on storage.objects for update
using ( bucket_id = 'user_avatars' );
