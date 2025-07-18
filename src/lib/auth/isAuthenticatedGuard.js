// /lib/auth/isAuthenticatedGuard.js
import { supabaseServerClient } from '@/lib/supabase/server';
import { errorResponse } from '@/lib/apiResponse';

/**
 * يتحقق مما إذا كان المستخدم مسجل دخول.
 * @param {Request} req
 * @returns {Promise<{ success: boolean, response?: Response, userId?: string }>}
 */
export async function isAuthenticatedGuard(req) {
  const supabase = supabaseServerClient(req);

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return {
      success: false,
      response: Response.json(errorResponse('Unauthorized'), { status: 401 }),
    };
  }

  return {
    success: true,
    userId: session.user.id,
  };
}
