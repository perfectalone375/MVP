-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- 1. Users Table (Extends Supabase Auth)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('jobseeker', 'recruiter', 'admin')),
  email text unique not null,
  phone text,
  face_verification_status text default 'pending' check (face_verification_status in ('verified', 'pending', 'failed')),
  created_at timestamptz default now()
);

-- 2. Resumes Table
create table public.resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  raw_file_url text not null,
  parsed_json jsonb,
  resume_score float,
  embeddings_vector vector(1536),
  flags text[],
  created_at timestamptz default now()
);

-- 3. AI Talent Passport (ATP)
create table public.atp (
  user_id uuid references public.users(id) on delete cascade primary key,
  identity_score float default 0,
  resume_score float default 0,
  domain_interview_score float default 0,
  project_depth_score float default 0,
  communication_score float default 0,
  gd_score float default 0,
  behavioural_score float default 0,
  skill_test_score float default 0,
  fraud_risk_score float default 0,
  competency_graph jsonb,
  badges text[],
  final_atp_score float default 0,
  updated_at timestamptz default now()
);

-- 4. Interviews Table
create table public.interviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  type text check (type in ('domain', 'resume', 'gd', 'communication', 'hr')),
  recording_url text,
  transcript text,
  ai_score float,
  ai_notes jsonb,
  created_at timestamptz default now()
);

-- 5. Skill Tests Table
create table public.skill_tests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  test_type text not null,
  score float,
  proctor_logs jsonb,
  created_at timestamptz default now()
);

-- 6. Jobs Table
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  recruiter_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  enriched_description text,
  skills_required text[],
  created_at timestamptz default now()
);

-- 7. Applications Table
create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  job_id uuid references public.jobs(id) on delete cascade not null,
  match_score float,
  status text default 'applied' check (status in ('applied', 'shortlisted', 'rejected', 'hired')),
  recruiter_notes text,
  created_at timestamptz default now()
);

-- 8. Recruiter Actions Log (Audit)
create table public.recruiter_logs (
  id uuid default uuid_generate_v4() primary key,
  recruiter_id uuid references public.users(id) not null,
  user_id uuid references public.users(id),
  job_id uuid references public.jobs(id),
  action text not null,
  before_json jsonb,
  after_json jsonb,
  timestamp timestamptz default now()
);

-- 9. Community Tables (Simplified)
create table public.community_groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text
);

create table public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid references public.community_groups(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- 10. Vector Index Table (For candidate search)
create table public.vector_index (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  embedding vector(1536),
  metadata jsonb,
  updated_at timestamptz default now()
);

-- Row Level Security (RLS) Policies

-- Users
alter table public.users enable row level security;
create policy "Public profiles are viewable by everyone" on public.users for select using (true);
create policy "Users can insert their own profile" on public.users for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- Resumes
alter table public.resumes enable row level security;
create policy "Users can view own resume" on public.resumes for select using (auth.uid() = user_id);
create policy "Users can insert own resume" on public.resumes for insert with check (auth.uid() = user_id);
create policy "Recruiters can view resumes of applicants" on public.resumes for select using (
  exists (
    select 1 from public.applications 
    join public.jobs on public.applications.job_id = public.jobs.id
    where public.applications.user_id = public.resumes.user_id 
    and public.jobs.recruiter_id = auth.uid()
  )
);

-- ATP
alter table public.atp enable row level security;
create policy "ATP viewable by everyone" on public.atp for select using (true);

-- Jobs
alter table public.jobs enable row level security;
create policy "Jobs viewable by everyone" on public.jobs for select using (true);
create policy "Recruiters can insert jobs" on public.jobs for insert with check (auth.uid() = recruiter_id);
create policy "Recruiters can update own jobs" on public.jobs for update using (auth.uid() = recruiter_id);

-- Applications
alter table public.applications enable row level security;
create policy "Users can view own applications" on public.applications for select using (auth.uid() = user_id);
create policy "Recruiters can view applications for their jobs" on public.applications for select using (
  exists (select 1 from public.jobs where id = public.applications.job_id and recruiter_id = auth.uid())
);
create policy "Users can apply" on public.applications for insert with check (auth.uid() = user_id);

-- Create simple storage buckets (handled via API usually, but defining policy concepts here)
-- (Supabase Storage policies are configured in the storage schema, separate from public schema)
