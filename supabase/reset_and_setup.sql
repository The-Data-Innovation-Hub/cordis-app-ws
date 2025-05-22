-- Reset and setup script for Supabase
-- This script will recreate all necessary tables for the CORDIS application

-- Create profiles table (simplified)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create simple trigger function for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create properties table (simplified)
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security for properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies for properties
CREATE POLICY "Properties are viewable by everyone"
  ON public.properties FOR SELECT
  USING (true);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS public.admin_settings (
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

-- Enable RLS for admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_settings
CREATE POLICY "Admin users can read admin_settings"
  ON public.admin_settings FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Admin users can update admin_settings"
  ON public.admin_settings FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Create a single default settings row
INSERT INTO public.admin_settings (id) 
VALUES ('00000000-0000-0000-0000-000000000000')
ON CONFLICT (id) DO NOTHING;

-- Create system_status table
CREATE TABLE IF NOT EXISTS public.system_status (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    status text not null check (status in ('operational', 'degraded', 'outage')),
    value numeric not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_activity table
CREATE TABLE IF NOT EXISTS public.user_activity (
    id uuid primary key default uuid_generate_v4(),
    date date not null,
    active_users integer not null default 0,
    api_requests integer not null default 0,
    avg_response_time numeric not null default 0,
    error_rate numeric not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create dashboard_metrics table
CREATE TABLE IF NOT EXISTS public.dashboard_metrics (
    id uuid primary key default uuid_generate_v4(),
    total_users integer not null default 0,
    total_api_requests integer not null default 0,
    avg_response_time numeric not null default 0,
    error_rate numeric not null default 0,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for dashboard tables
ALTER TABLE public.system_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for system_status
CREATE POLICY "Anyone can read system_status"
    ON public.system_status FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can update system_status"
    ON public.system_status FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));

-- Create policies for user_activity
CREATE POLICY "Anyone can read user_activity"
    ON public.user_activity FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can update user_activity"
    ON public.user_activity FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));

-- Create policies for dashboard_metrics
CREATE POLICY "Anyone can read dashboard_metrics"
    ON public.dashboard_metrics FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can update dashboard_metrics"
    ON public.dashboard_metrics FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));

-- Insert sample data for system status
INSERT INTO public.system_status (name, status, value) VALUES
    ('API', 'operational', 99.9),
    ('Database', 'operational', 99.8),
    ('Authentication', 'operational', 100.0),
    ('Storage', 'degraded', 87.5)
ON CONFLICT DO NOTHING;

-- Insert sample data for user activity (last 7 days)
INSERT INTO public.user_activity (date, active_users, api_requests, avg_response_time, error_rate) VALUES
    (CURRENT_DATE - interval '6 days', 45, 15000, 124, 0.12),
    (CURRENT_DATE - interval '5 days', 62, 18000, 118, 0.09),
    (CURRENT_DATE - interval '4 days', 58, 17000, 122, 0.11),
    (CURRENT_DATE - interval '3 days', 71, 21000, 115, 0.08),
    (CURRENT_DATE - interval '2 days', 80, 24000, 110, 0.07),
    (CURRENT_DATE - interval '1 days', 45, 16000, 125, 0.15),
    (CURRENT_DATE, 30, 12000, 130, 0.18)
ON CONFLICT DO NOTHING;

-- Insert initial dashboard metrics
INSERT INTO public.dashboard_metrics (total_users, total_api_requests, avg_response_time, error_rate)
VALUES (1234, 2100000, 124, 0.12)
ON CONFLICT DO NOTHING;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_system_status_updated_at
    BEFORE UPDATE ON public.system_status
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_metrics_updated_at
    BEFORE UPDATE ON public.dashboard_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Disable email confirmation requirement for easier testing
UPDATE auth.config
SET confirm_email_through_signup = false;

-- Create test users with direct SQL (more reliable than auth API)
-- Note: This uses a simple password for testing - in production, use proper hashing
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  raw_app_meta_data,
  raw_user_meta_data,
  encrypted_password,
  created_at,
  updated_at,
  email_confirmed_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'test@example.com',
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "user", "full_name": "Test User"}',
  '$2a$10$GR7yzpIYxvKqU8LNo6jvdOm.hk7.xv5Ei.ABgxQTcIQcXSZwEvw16', -- password is 'password'
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  email_confirmed_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'admin@example.com',
  '$2a$10$GR7yzpIYxvKqU8LNo6jvdOm.hk7.xv5Ei.ABgxQTcIQcXSZwEvw16', -- password is 'password'
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin", "full_name": "Admin User"}',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Sample properties data
INSERT INTO public.properties (address, city, price, user_id) VALUES
  ('123 Main St', 'London', 750000.00, '11111111-1111-1111-1111-111111111111'),
  ('456 Park Ave', 'Manchester', 450000.00, '11111111-1111-1111-1111-111111111111'),
  ('789 Oak Rd', 'Birmingham', 350000.00, '22222222-2222-2222-2222-222222222222'),
  ('101 Pine St', 'Edinburgh', 550000.00, '22222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;
