-- Add credits and tier to users table
alter table public.users 
add column if not exists credits int default 10,
add column if not exists tier text default 'free' check (tier in ('free', 'pro', 'enterprise'));

-- RLS should already allow users to read their own profile
-- Add logic to allow automated updates (Service Role) or Self-update via purchased API
