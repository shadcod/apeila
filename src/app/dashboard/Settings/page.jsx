// src/app/dashboard/settings/page.jsx
import { redirect } from 'next/navigation';
import { supabaseServerClient } from '@/lib/supabase';

export default async function SettingsPage() {
  const supabase = supabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // إذا المستخدم غير مسجل دخول، تحويل لصفحة الدخول
    return redirect('/login');
  }

  // جلب بيانات الملف الشخصي للتحقق من الدور
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (error || !profile) {
    // لو في خطأ أو ما في بروفايل، نرجع للصفحة الرئيسية
    return redirect('/');
  }

  if (profile.role !== 'admin') {
    // فقط الأدمن مسموح له بالدخول
    return redirect('/');
  }

  // لو وصلنا لهنا، المستخدم أدمن مسموح له بالدخول
  return (
    <main style={{ padding: '2rem' }}>
      <h1>صفحة الإعدادات (Settings)</h1>
      <p>مرحباً بك في صفحة الإعدادات الخاصة بالمسؤول.</p>
      {/* هنا تضيف مكونات إعداداتك لاحقاً */}
    </main>
  );
}
