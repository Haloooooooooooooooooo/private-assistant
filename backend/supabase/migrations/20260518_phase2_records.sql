create extension if not exists pgcrypto;

create table if not exists public.records (
  id uuid primary key default gen_random_uuid(),
  raw_content text not null,
  content_type text not null check (content_type in ('text', 'link', 'image', 'document')),
  intent text not null check (intent in ('later', 'favorite')),
  user_status text not null check (user_status in ('later', 'pending', 'done')),
  parse_status text not null default 'pending' check (parse_status in ('pending', 'running', 'succeeded', 'failed')),
  internalization_status text not null default 'pending' check (internalization_status in ('pending', 'running', 'succeeded', 'failed')),
  title text,
  summary text,
  tags text[] not null default '{}',
  user_understanding text,
  source_url text,
  source_domain text,
  source_title text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.records(id) on delete cascade,
  kind text not null check (kind in ('link', 'file', 'image')),
  name text not null,
  storage_path text,
  original_url text,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  record_id uuid references public.records(id) on delete cascade,
  job_type text not null check (job_type in ('parse', 'internalize', 'index')),
  status text not null default 'pending' check (status in ('pending', 'running', 'succeeded', 'failed', 'retrying', 'cancelled')),
  attempt_count integer not null default 0,
  last_error text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.processing_logs (
  id uuid primary key default gen_random_uuid(),
  record_id uuid references public.records(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  stage text not null,
  level text not null default 'info' check (level in ('debug', 'info', 'warning', 'error')),
  message text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_records_created_at on public.records (created_at desc);
create index if not exists idx_records_user_status on public.records (user_status);
create index if not exists idx_attachments_record_id on public.attachments (record_id);
create index if not exists idx_jobs_record_id on public.jobs (record_id);
create index if not exists idx_processing_logs_record_id on public.processing_logs (record_id);
