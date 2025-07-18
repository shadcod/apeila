import { supabaseServerClient } from '@/lib/supabase/server';
import { errorResponse, successResponse } from '@/lib/apiResponse';

/**
 * يتحقق مما إذا كان المستخدم الحالي Admin.
 * @param {Request} req - كائن الطلب (Next.js Request)
 * @returns {Promise<{ success: boolean, response?: Response, userId?: string }>}
 */
export async function isAdminGuard(req) {
  const supabase = supabaseServerClient(req);

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return {
      success: false,
      response: Response.json(errorResponse('Unauthorized'), { status: 401 }),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profileError || !profile) {
    return {
      success: false,
      response: Response.json(errorResponse('Forbidden'), { status: 403 }),
    };
  }

  if (profile.role !== 'admin') {
    return {
      success: false,
      response: Response.json(errorResponse('Forbidden: insufficient permissions'), { status: 403 }),
    };
  }

  return {
    success: true,
    userId: session.user.id,
  };
}
