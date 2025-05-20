-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a function that checks if the user exists before creating profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  attempts INTEGER := 0;
  max_attempts INTEGER := 5;
  user_exists BOOLEAN;
BEGIN
  -- Loop until we find the user or hit max attempts
  WHILE attempts < max_attempts LOOP
    -- Check if user exists in auth.users
    SELECT EXISTS (
      SELECT 1 FROM auth.users WHERE id = NEW.id
    ) INTO user_exists;
    
    IF user_exists THEN
      -- User exists, create profile
      INSERT INTO public.profiles (
        id,
        email,
        username,
        full_name,
        role
      ) VALUES (
        NEW.id,
        NEW.email,
        split_part(NEW.email, '@', 1),
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        CASE 
          WHEN NEW.email LIKE '%@cordis.com' THEN 'admin'
          ELSE 'user'
        END
      );
      
      RETURN NEW;
    END IF;
    
    -- Wait for 1 second before next attempt
    PERFORM pg_sleep(1);
    attempts := attempts + 1;
  END LOOP;
  
  -- If we get here, we couldn't create the profile
  RAISE NOTICE 'Could not create profile for user % after % attempts', NEW.id, max_attempts;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger to run AFTER the user is inserted
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS is disabled for development
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
