import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// Get Supabase URL and Anon Key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Log the Supabase URL (with sensitive parts redacted)
const redactedUrl = supabaseUrl.replace(/\/\/([^:]+):[^@]+@/, '//$1:******@');
console.log('Initializing Supabase client with URL:', redactedUrl);

// Create a typed Supabase client
export const supabase = createSupabaseClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      debug: process.env.NODE_ENV === 'development',
      flowType: 'pkce',
      storageKey: 'sb-auth-token',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    global: {
      headers: {
        'X-Client-Info': 'cordis-app/1.0.0',
      },
    },
    db: {
      schema: 'public',
    },
  }
);

// Log connection status and errors in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Log auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.email || 'No user');
  });

    // Log all Supabase errors
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      console.log('User signed in:', {
        id: session.user.id,
        email: session.user.email,
        created_at: session.user.created_at,
      });
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
    }
  });

    // Log any network errors
  const { data: { subscription: networkListener } } = supabase.auth.onAuthStateChange(
    (_event: string, _session: any) => {
      // This is just for error tracking, we don't need the parameters
      console.log('Auth state change detected');
    }
  );

  // Cleanup subscription on unmount (in case this runs in a component)
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      networkListener?.unsubscribe();
    });
  }
}

// Test the connection on startup
async function testConnection() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Skipping Supabase connection test: Missing environment variables');
    return false;
  }
  
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    if (profiles && profiles.length > 0) {
      console.log('Found profile:', profiles[0].id);
    } else {
      console.log('No profiles found in the database');
    }
    return true;
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return false;
  }
}

// Run the connection test in development
if (process.env.NODE_ENV === 'development' && supabaseUrl && supabaseAnonKey) {
  testConnection();
}
