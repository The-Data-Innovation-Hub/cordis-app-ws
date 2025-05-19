-- Drop existing table if it exists
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT profiles_email_key UNIQUE (email)
);

-- Disable RLS for development
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX profiles_email_idx ON public.profiles (email);
CREATE INDEX profiles_id_idx ON public.profiles (id);

-- Grant necessary permissions
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Add comments
COMMENT ON TABLE public.profiles IS 'User profile information';
COMMENT ON COLUMN public.profiles.role IS 'User role (admin, user, etc.)';
