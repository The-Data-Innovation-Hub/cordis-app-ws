'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { supabase } from '@/lib/supabase/client';
import { makeUserAdmin } from '@/lib/supabase/admin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Shield, User } from 'lucide-react';

interface UserWithProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(profiles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleMakeAdmin(userId: string) {
    try {
      const success = await makeUserAdmin(userId);
      if (success) {
        toast({
          title: 'Success',
          description: 'User has been made an admin',
          variant: 'success',
        });
        fetchUsers(); // Refresh the user list
      } else {
        throw new Error('Failed to update user role');
      }
    } catch (error) {
      console.error('Error making user admin:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'error',
      });
    }
  }

  return (
    <AdminGuard>
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0089AD]"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      {user.role === 'admin' ? (
                        <Shield className="h-4 w-4 text-[#0089AD]" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      {user.role}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.role !== 'admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMakeAdmin(user.id)}
                          className="flex items-center gap-2"
                        >
                          <Shield className="h-4 w-4" />
                          Make Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
