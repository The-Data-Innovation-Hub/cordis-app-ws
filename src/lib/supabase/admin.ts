import { supabase } from './client';
import type { Profile } from './types';

export async function isAdmin(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  return profile?.role === 'admin';
}

export async function makeUserAdmin(userId: string): Promise<boolean> {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser?.user) return false;

  // Check if the current user is an admin
  const isCurrentUserAdmin = await isAdmin();
  if (!isCurrentUserAdmin) return false;

  // Update the user's role to admin
  const { error } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userId);

  return !error;
}

export async function getProfile(): Promise<Profile | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return profile;
}
