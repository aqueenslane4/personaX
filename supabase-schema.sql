-- Run this in your Supabase SQL editor

-- Users profile table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro')),
  stripe_customer_id text unique,
  image_credits integer not null default 0,
  video_credits integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Personas table
create table public.personas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  name text not null,
  vibe text,
  style text,
  niche text,
  audience text,
  bio text,
  seed integer,
  face_embedding text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Generations table (image + video history)
create table public.generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  persona_id uuid references public.personas on delete set null,
  type text not null check (type in ('image', 'video', 'text')),
  prompt text,
  output_url text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'done', 'failed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.personas enable row level security;
alter table public.generations enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can manage own personas" on public.personas for all using (auth.uid() = user_id);
create policy "Users can manage own generations" on public.generations for all using (auth.uid() = user_id);

