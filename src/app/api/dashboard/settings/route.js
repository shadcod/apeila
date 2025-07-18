import { supabaseServerClient } from '@/lib/supabase/server'
import { errorResponse, successResponse } from '@/lib/apiResponse';

export async function GET(req) {
  // استخرج headers من req (في app router)
  const supabase = supabaseServerClient(req);

  // جلب الجلسة
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return new Response(JSON.stringify(errorResponse('Unauthorized')), { status: 401 });
  }

  // جلب بيانات البروفايل للتحقق من الدور
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profileError || !profile) {
    return new Response(JSON.stringify(errorResponse('Forbidden')), { status: 403 });
  }

  if (profile.role !== 'admin') {
    return new Response(JSON.stringify(errorResponse('Forbidden: insufficient permissions')), { status: 403 });
  }

  // لو كل شيء تمام، نكمل عملية الـ API (مثلاً جلب أو تعديل بيانات)
  return new Response(JSON.stringify(successResponse({ message: 'Protected data' })), { status: 200 });
}
