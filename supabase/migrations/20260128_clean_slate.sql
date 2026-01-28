-- CLEAN SLATE: Delete the "Zombie" bucket from the database
-- This removes the row that is confusing the system.

delete from storage.objects where bucket_id = 'avatars';
delete from storage.buckets where id = 'avatars';

-- Verify it is gone (Should return 0 rows)
select * from storage.buckets;
