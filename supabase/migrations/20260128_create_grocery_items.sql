-- Create grocery_items table
create table if not exists public.grocery_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  item text not null,
  is_checked boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.grocery_items enable row level security;

-- Policies
create policy "Users can view own grocery items"
  on public.grocery_items for select
  using (auth.uid() = user_id);

create policy "Users can insert own grocery items"
  on public.grocery_items for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own grocery items"
  on public.grocery_items for delete
  using (auth.uid() = user_id);

create policy "Users can update own grocery items"
  on public.grocery_items for update
  using (auth.uid() = user_id);
