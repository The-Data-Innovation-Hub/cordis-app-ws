-- Fix the profiles table to include username column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- Create system_status table for dashboard data
CREATE TABLE IF NOT EXISTS public.system_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status_name TEXT NOT NULL,
  status_value TEXT NOT NULL,
  status_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for system_status
ALTER TABLE public.system_status ENABLE ROW LEVEL SECURITY;

-- Create policies for system_status
CREATE POLICY "All users can view system status"
  ON public.system_status FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can modify system status"
  ON public.system_status
  USING (auth.jwt() ->> 'role' = 'admin');

-- Insert some initial system status data
INSERT INTO public.system_status (status_name, status_value, status_type)
VALUES 
  ('system_health', 'good', 'status'),
  ('active_users', '42', 'metric'),
  ('server_uptime', '99.9%', 'metric'),
  ('last_backup', '2025-05-22 12:00:00', 'timestamp');

-- Update the handle_new_user function to properly handle username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  role_value TEXT;
  full_name_value TEXT;
  username_value TEXT;
BEGIN
  -- Extract values from metadata with more detailed logging
  role_value := new.raw_user_meta_data->>'role';
  full_name_value := new.raw_user_meta_data->>'full_name';
  
  -- Generate username from email if not provided
  username_value := new.raw_user_meta_data->>'username';
  IF username_value IS NULL THEN
    username_value := split_part(new.email, '@', 1);
  END IF;
  
  -- Log the values for debugging
  RAISE LOG 'Creating new user profile with ID: %, Email: %, Role: %, Full Name: %, Username: %', 
    new.id, new.email, role_value, full_name_value, username_value;
  
  -- Insert with proper role, full name, and username from metadata
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, username)
  VALUES (
    new.id, 
    new.email, 
    full_name_value,
    new.raw_user_meta_data->>'avatar_url', 
    COALESCE(role_value, 'user'),
    username_value
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
