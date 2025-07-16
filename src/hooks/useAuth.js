import { useState, useEffect } from 'react';
import { useAppContext } from '@context/AppContext'; // عدل المسار حسب مشروعك
import { supabase } from '@/lib/supabase';
import { signOut as supabaseSignOut } from '@/services/authService';

export default function useAuth() {
  const { isAuthenticated, setIsAuthenticated } = useAppContext();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ جلب المستخدم الحالي عند التحميل
  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setCurrentUser(user);
        setIsAuthenticated(!!user);
      } catch (err) {
        setError(err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();

    // ✅ الاستماع لتغييرات حالة المصادقة (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      setCurrentUser(user);
      setIsAuthenticated(!!user);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setIsAuthenticated]);

  // ✅ دالة تسجيل الخروج مع تحديث الحالة
  const signOut = async () => {
    try {
      await supabaseSignOut();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err);
      throw err; // إعادة الخطأ للمكون الذي يستدعي signOut
    }
  };

  return {
    isAuthenticated,
    currentUser,
    loading,
    error,
    signOut,
    setIsAuthenticated, // نتركها للمرونة لو احتجت تعديل يدوي
  };
}
