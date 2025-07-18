import { supabaseServerClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { isAdminGuard } from '@/lib/auth/isAdminGuard';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function PATCH(req, { params }) {
  // تحقق الحماية أولاً
  const guard = await isAdminGuard(req);
  if (!guard.success) {
    // الرد في حالة عدم التحقق
    return guard.response;
  }

  const productId = params?.id;

  if (!productId) {
    return new Response(
      JSON.stringify(errorResponse('❌ Missing product ID.')),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const updatedData = await req.json();

    if (!updatedData || typeof updatedData !== 'object') {
      return new Response(
        JSON.stringify(errorResponse('❌ Invalid JSON data.')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = await supabaseServerClient();

    const { error } = await supabase
      .from('products')
      .update(updatedData)
      .eq('id', productId);

    if (error) {
      console.error('❌ Supabase update error:', error);
      return new Response(
        JSON.stringify(errorResponse('Failed to update product.')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(successResponse(null, '✅ Product updated successfully.')),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return new Response(
      JSON.stringify(errorResponse('Server error while updating product.')),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
