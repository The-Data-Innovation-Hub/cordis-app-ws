-- Remove username column from profiles table if it exists
ALTER TABLE public.profiles DROP COLUMN IF EXISTS username;

-- Update the handle_new_user function to remove username references
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  role_value TEXT;
  full_name_value TEXT;
BEGIN
  -- Extract role and full_name from metadata with detailed logging
  role_value := new.raw_user_meta_data->>'role';
  full_name_value := new.raw_user_meta_data->>'full_name';
  
  -- Log the values for debugging
  RAISE LOG 'Creating new user profile with ID: %, Email: %, Role: %, Full Name: %', 
    new.id, new.email, role_value, full_name_value;
  
  -- Insert with proper role and full name from metadata
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    new.id, 
    new.email, 
    full_name_value,
    new.raw_user_meta_data->>'avatar_url', 
    COALESCE(role_value, 'user')
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
