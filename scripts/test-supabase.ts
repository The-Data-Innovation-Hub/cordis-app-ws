import { createClient } from '@supabase/supabase-js';

// These should match your .env.local file
const supabaseUrl = 'https://cslxynhkqqqczhaltlim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbHh5bmhrcXFxY3poYWx0bGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTU3OTMsImV4cCI6MjA2MzA3MTc5M30.k_BDJ-bHZqrwE7L5N2NcrsSuBRVnQAcxqSmWhYi85IA';

async function testSupabase() {
  console.log('Testing Supabase connection...');
  
  // Create a new client
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  try {
    // Test auth state change
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, session?.user?.email || 'No user');
      }
    );

    // Test sign up
    console.log('Testing sign up...');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
          username: 'testuser',
        },
      },
    });

    if (signUpError) {
      console.error('Sign up error:', signUpError);
      return;
    }

    console.log('Sign up successful:', signUpData);

    // Test sign in
    console.log('Testing sign in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      console.error('Sign in error:', signInError);
      return;
    }

    console.log('Sign in successful:', signInData);

    // Test getting user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Get user error:', userError);
      return;
    }
    console.log('Current user:', userData.user);

    // Test inserting a profile
    if (userData.user) {
      console.log('Testing profile insertion...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userData.user.id,
          email: testEmail,
          username: 'testuser',
          full_name: 'Test User',
          role: 'user',
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile insert error:', profileError);
      } else {
        console.log('Profile inserted:', profileData);
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    // Clean up
    if (typeof authListener?.unsubscribe === 'function') {
      authListener.unsubscribe();
    }
    
    // Sign out
    await supabase.auth.signOut();
  }
}

testSupabase().catch(console.error);
