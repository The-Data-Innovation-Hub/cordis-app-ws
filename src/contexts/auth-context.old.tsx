'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

type Profile = {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  role: 'admin' | 'user' | string; // Allow string for flexibility with database enums
  created_at?: string;
  updated_at?: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User; session: Session } | null>;
  signUp: (email: string, password: string) => Promise<{ user: User | null; profile: Profile | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    if (!userId) {
      console.warn('No user ID provided to fetchProfile');
      return null;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        // Don't log 404 errors as they're expected when a profile doesn't exist yet
        if (error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        }
        return null;
      }

      if (profile) {
        const typedProfile = {
          ...profile,
          username: profile.username || null,
          full_name: profile.full_name || null,
          role: profile.role || 'user', // Default role if not set
        } as Profile;
        
        setProfile(typedProfile);
        return typedProfile;
      }

      return null;
    } catch (error) {
      console.error('Unexpected error in fetchProfile:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const handleAuthChange = async (currentSession: Session | null, event?: AuthChangeEvent) => {
      if (!mounted) return;

      try {
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Fetch the user's profile
          const profile = await fetchProfile(currentSession.user.id);
          
          // Only redirect on SIGNED_IN event to prevent unwanted redirects
          if (event === 'SIGNED_IN') {
            // Check if we're already on an auth page to prevent redirect loops
            const isOnAuthPage = window.location.pathname.startsWith('/auth');
            const isOnCallbackPage = window.location.pathname === '/auth/callback';
            
            if (!isOnCallbackPage) {
              if (profile?.role === 'admin') {
                router.push('/admin/dashboard');
              } else {
                // Only redirect to dashboard if not already on an auth page
                if (!isOnAuthPage) {
                  router.push('/dashboard');
                }
              }
            }
          }
        } else {
          // Only reset state and redirect if we're not already on an auth page
          const isOnAuthPage = window.location.pathname.startsWith('/auth');
          const isOnPublicPage = window.location.pathname === '/' || 
                               window.location.pathname.startsWith('/public');
          
          setSession(null);
          setUser(null);
          setProfile(null);
          
          if (event === 'SIGNED_OUT' && !isOnAuthPage && !isOnPublicPage) {
            router.push('/auth/login');
          }
        }
      } catch (error) {
        console.error('Error handling auth change:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }  
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        handleAuthChange(session);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthChange(session, event);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [router, fetchProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      // Fetch the user's profile after successful sign in
      if (data?.user) {
        await fetchProfile(data.user.id);
      }
      
      toast.success('Signed in successfully');
      return data;
    } catch (error: any) {
      console.error('Sign in error:', error);
      const errorMessage = error.message.includes('Invalid login credentials') 
        ? 'Invalid email or password' 
        : error.message || 'Error signing in';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting to sign up with:', { email, password });
      
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: email.split('@')[0], // Default full name from email
          }
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error details:', {
          message: error.message,
          name: error.name,
          status: error.status,
          cause: error.cause
        });
        throw error;
      }

      if (!data?.user) {
        throw new Error('No user data returned from signup. Please try again.');
      }

      console.log('User created, waiting for profile...');
      
      // Wait for the profile to be created by the trigger
      let profile = null;
      let attempts = 0;
      const maxAttempts = 5;
      const delay = 1000; // 1 second

      while (attempts < maxAttempts && !profile) {
        console.log(`Checking for profile (attempt ${attempts + 1}/${maxAttempts})...`);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }

        if (profileData) {
          profile = profileData;
          console.log('Profile found:', profile);
          setProfile(profile);
          break;
        }

        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, delay));
        attempts++;
      }


      if (!profile) {
        console.warn('Profile not found after maximum attempts');
        toast.warning('Your account was created, but there was an issue setting up your profile. Please contact support.');
      } else {
        toast.success('Account created successfully!');
      }

      return { user: data.user, profile };
    } catch (error: any) {
      console.error('Signup process error:', {
        name: error?.name,
        message: error?.message,
        status: error?.status,
        code: error?.code,
        stack: error?.stack
      });

      let errorMessage = 'Error creating account';
      
      // Handle specific error cases
      if (error?.message?.includes('already registered')) {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error?.message?.includes('password')) {
        errorMessage = 'Password does not meet requirements. It should be at least 6 characters.';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      // Refresh the profile
      const updatedProfile = await fetchProfile(user.id);
      if (updatedProfile) {
        setProfile(updatedProfile);
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Error updating profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/auth/signin');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Error signing out');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};