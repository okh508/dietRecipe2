-- FORCE PERMISSIONS: Granting explicit table access and broad RLS policies

-- 1. Ensure 'avatars' bucket exists and is public
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- 2. Grant Table-Level Permissions (The Foundation)
-- Without these, RLS policies don't matter.
grant usage on schema storage to postgres, anon, authenticated, service_role;
grant all privileges on all tables in schema storage to postgres, anon, authenticated, service_role;

-- 3. Fix 'storage.buckets' RLS (Visibility)
drop policy if exists "Public List Buckets" on storage.buckets;
create policy "Public List Buckets"
on storage.buckets for select
to public
using ( true );

-- 4. Fix 'storage.objects' RLS (Upload/View)
drop policy if exists "Public Object Access" on storage.objects;
create policy "Public Object Access"
on storage.objects for select
to public
using ( bucket_id = 'avatars' );

drop policy if exists "Public Object Upload" on storage.objects;
create policy "Public Object Upload"
on storage.objects for insert
to public
with check ( bucket_id = 'avatars' );

drop policy if exists "Public Object Update" on storage.objects;
create policy "Public Object Update"
on storage.objects for update
to public
using ( bucket_id = 'avatars' );
