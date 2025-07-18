import { supabaseServerClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) return errorResponse('Missing slug', 400);

    const supabase = await supabaseServerClient();

    const { data, error } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug);

    if (error) {
      console.error('❌ Error checking slug:', error.message);
      return errorResponse('Failed to check slug', 500);
    }

    const exists = !!data?.length;
    return successResponse({ exists }, 200);
  } catch (err) {
    console.error('❌ Unexpected server error:', err.message);
    return errorResponse('Internal server error', 500);
  }
}
