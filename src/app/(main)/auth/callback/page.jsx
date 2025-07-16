'use client';

import { useEffect, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { AppContext } from '@/context/AppContext';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsAuthenticated } = useContext(AppContext);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setIsAuthenticated(true);

        // اقرأ الصفحة التي كان يريدها المستخدم قبل تسجيل الدخول
        const redirectedFrom = searchParams.get('redirectedFrom');
        router.push(redirectedFrom || '/dashboard');
      } else {
        router.push('/login');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
        const redirectedFrom = searchParams.get('redirectedFrom');
        router.push(redirectedFrom || '/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <p>جاري التحقق من حسابك، انتظر قليلاً...</p>;
}
