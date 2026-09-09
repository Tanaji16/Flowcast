'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: (session.user.user_metadata?.role as 'attendee' | 'organizer') || 'attendee',
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching user auth:', err);
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [supabase, setUser, setLoading]);

  return { user, isLoading };
}
