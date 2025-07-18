import { supabaseServerClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';

// ✅ دعم CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req) {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return Response.json(
        errorResponse('❌ Invalid or missing IDs. Must be a non-empty array.'),
        { status: 400 }
      );
    }

    const supabase = await supabaseServerClient(); // ✅ استخدم نسخة السيرفر

    const { error } = await supabase
      .from('products')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('❌ Supabase delete error:', error);
      return Response.json(
        errorResponse('❌ Failed to delete products.'),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse(null, '✅ Products deleted successfully.'),
      { status: 200 }
    );
  } catch (err) {
    console.error('❌ Unexpected server error:', err);
    return Response.json(
      errorResponse('❌ Server error while deleting products.'),
      { status: 500 }
    );
  }
}

