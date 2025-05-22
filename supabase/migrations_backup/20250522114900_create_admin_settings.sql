-- Create admin_settings table
create table if not exists public.admin_settings (
    id uuid primary key default uuid_generate_v4(),
    password_min_length integer not null default 8,
    password_require_numbers_symbols boolean not null default true,
    require_two_factor boolean not null default false,
    ip_whitelist_enabled boolean not null default false,
    ip_whitelist text[] not null default '{}',
    ai_model text not null default 'GPT-4',
    ai_api_key text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.admin_settings enable row level security;

-- Create policies
create policy "Admin users can read admin_settings"
  on public.admin_settings for select
  to authenticated
  using (exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  ));

create policy "Admin users can update admin_settings"
  on public.admin_settings for update
  to authenticated
  using (exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  ));

-- Create a single default settings row
INSERT INTO public.admin_settings (id) 
VALUES ('00000000-0000-0000-0000-000000000000')
ON CONFLICT (id) DO NOTHING;
