-- "NUKE" Script: Delete all avatar buckets so you can use the Dashboard
-- This resolves the "Duplicate Key" error you got earlier.

delete from storage.objects where bucket_id in ('avatars', 'user_avatars');
delete from storage.buckets where id in ('avatars', 'user_avatars');

-- Confirm they are gone:
select * from storage.buckets;
