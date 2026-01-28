-- NEW STRATEGY: Use a fresh bucket 'user_avatars' to bypass permission issues.

-- 1. Create the new bucket
insert into storage.buckets (id, name, public)
values ('user_avatars', 'user_avatars', true)
on conflict (id) do nothing;

-- 2. Enable RLS (just to be sure, though we can't always alter it)
-- alter table storage.objects enable row level security; 

-- 3. DROP old policies for this new bucket (clean slate)
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Insert" on storage.objects;
drop policy if exists "Authenticated Update" on storage.objects;
drop policy if exists "Universal Access" on storage.objects;
drop policy if exists "Give me access" on storage.objects;

-- 4. Create correct policies for 'user_avatars'
-- Allow public VIEW
create policy "Avatar Public View"
on storage.objects for select
using ( bucket_id = 'user_avatars' );

-- Allow AUTHENTICATED upload (User must be logged in)
create policy "Avatar Auth Upload"
on storage.objects for insert
with check ( bucket_id = 'user_avatars' AND auth.role() = 'authenticated' );

-- Allow AUTHENTICATED update
create policy "Avatar Auth Update"
on storage.objects for update
using ( bucket_id = 'user_avatars' AND auth.role() = 'authenticated' );

-- 5. CRITICAL: Grant Postgres permissions to the roles (often missed)
grant usage on schema storage to postgres, anon, authenticated, service_role;
grant all privileges on all tables in schema storage to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema storage to postgres, anon, authenticated, service_role;
grant all privileges on all routines in schema storage to postgres, anon, authenticated, service_role;
