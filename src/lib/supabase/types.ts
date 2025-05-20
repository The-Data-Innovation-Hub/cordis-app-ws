export type Profile = {
  id: string;
  email: string;
  role: 'user' | 'admin';
  username: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
};
