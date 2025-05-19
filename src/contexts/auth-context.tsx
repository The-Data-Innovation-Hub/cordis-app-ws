'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROLE_LANDING_PAGES, USER_ROLES, type UserRole } from '@/lib/constants/roles';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';

// Auth context provides authentication related functionality

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, fullName: string, role?: UserRole) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Initialize session and set up listener
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: UserRole = USER_ROLES.USER) => {
    setIsLoading(true);
    console.log('=== Auth Context: Starting Signup ===');
    console.log('User details:', { email, fullName, role });
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    try {
      console.log('1. Attempting to sign up with Supabase Auth...');
      // First create the user with email confirmation disabled
      const signUpOptions = {
        email,
        password,
        options: {
          data: { 
            full_name: fullName, 
            role,
            email_confirm: true // This is a custom claim we can check
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      };
      
      console.log('Signup options:', JSON.stringify(signUpOptions, null, 2));
      
      const { data: authData, error: signUpError } = await supabase.auth.signUp(signUpOptions);

      console.log('Auth response received');
      console.log('Auth data:', authData);
      console.log('Auth error:', signUpError);

      if (signUpError) {
        console.error('Auth error details:', signUpError);
        throw signUpError;
      }

      if (!authData?.user) {
        const error = new Error('No user returned from sign up');
        console.error('No user in authData:', authData);
        throw error;
      }

      // In development, we'll verify the email immediately
      if (process.env.NODE_ENV === 'development') {
        console.log('\n=== Development Mode: Auto-verifying Email ===');
        console.log('User ID to verify:', authData.user.id);
        
        try {
          console.log('Attempting to update user with admin API...');
          const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
            authData.user.id,
            { email_confirm: true }
          );
          
          if (updateError) {
            console.error('❌ Failed to auto-verify email:', updateError);
            console.error('Error details:', JSON.stringify(updateError, null, 2));
          } else {
            console.log('✅ Email verified automatically in development mode');
            console.log('Update response:', updateData);
          }
        } catch (adminError) {
          console.error('❌ Error in admin API call:', adminError);
          console.error('Admin error details:', JSON.stringify(adminError, null, 2));
        }
      }

      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id,
          email: email,
          full_name: fullName,
          role: role,
        },
      ]);

      if (profileError) throw profileError;

      toast.success('Please check your email to verify your account');
      return { error: null };
    } catch (error) {
      console.error('Error during sign up:', error);
      toast.error((error as Error).message);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    console.log('Attempting to sign in:', { email });
    
    // In development, we'll bypass email confirmation
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Bypassing email confirmation');
      try {
        // First try to sign in normally
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        // If sign in fails with unconfirmed email, try to update the user
        if (signInError?.message?.includes('Email not confirmed')) {
          console.log('Email not confirmed, attempting to verify in development mode');
          // Get the user by email
          const { data: { users } } = await supabase.auth.admin.listUsers();
          const targetUser = users?.find(u => u.email === email);
          
          if (targetUser) {
            console.log('Found user, updating email confirmation status');
            // Update the user to confirm their email
            const { error: updateError } = await supabase.auth.admin.updateUserById(
              targetUser.id,
              { email_confirm: true }
            );
            
            if (!updateError) {
              // Try to sign in again after updating
              const { error: retryError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              
              if (retryError) throw retryError;
              return { error: null };
            }
          }
          throw signInError; // Re-throw if we couldn't handle it
        }
        
        if (signInError) throw signInError;
        return { error: null };
      } catch (error) {
        console.error('Error during development sign in:', error);
        return { error: error as Error };
      }
    }
    
    // Production flow
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (user) {
        // Get user's role from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role) {
          // Redirect to role-specific landing page
          const landingPage = ROLE_LANDING_PAGES[profile.role as UserRole] || '/dashboard';
          router.push(landingPage);
        } else {
          router.push('/dashboard');
        }
      }

      toast.success('Successfully signed in!');
      return { error: null };
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during sign in');
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
      toast.error(errorMessage);
      return { error: new Error(errorMessage) };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password (send reset email)
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;
      toast.success('Password reset email sent');
      return { error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      toast.error(errorMessage);
      return { error: new Error(errorMessage) };
    } finally {
      setIsLoading(false);
    }
  };

  // Update password
  const updatePassword = async (password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      toast.success('Password updated successfully');
      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
      toast.error(errorMessage);
      return { error: new Error(errorMessage) };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
