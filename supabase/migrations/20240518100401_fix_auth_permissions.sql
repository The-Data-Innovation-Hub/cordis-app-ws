-- Enable auth schema if not already enabled
CREATE SCHEMA IF NOT EXISTS auth;

-- Grant necessary permissions to the anon and authenticated roles
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA auth TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO anon, authenticated, service_role;

-- Make sure the auth.users table has the correct permissions
ALTER TABLE auth.users OWNER TO postgres;
GRANT ALL ON TABLE auth.users TO postgres;
GRANT ALL ON TABLE auth.users TO anon;
GRANT ALL ON TABLE auth.users TO authenticated;
GRANT ALL ON TABLE auth.users TO service_role;

-- Create or update the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT profiles_email_key UNIQUE (email)
);

-- Grant necessary permissions to the profiles table
ALTER TABLE public.profiles OWNER TO postgres;
GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;

-- Enable RLS but create policies that allow all operations
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (for development only)
DROP POLICY IF EXISTS "Enable all operations for all users" ON public.profiles;
CREATE POLICY "Enable all operations for all users" 
  ON public.profiles 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'username' OR split_part(NEW.email, '@', 1),
    NEW.raw_user_meta_data->>'full_name' OR '',
    COALESCE((SELECT COUNT(*) = 0 FROM auth.users), false)::text::boolean ? 'admin' : 'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
