create table if not exists admin_settings (
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

-- Create a single default settings row
INSERT INTO admin_settings (id) VALUES ('00000000-0000-0000-0000-000000000000')
ON CONFLICT (id) DO NOTHING;
