import { supabaseServerClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body || typeof body !== 'object') {
      return Response.json(
        errorResponse('Invalid request body'),
        { status: 400 }
      );
    }

    const newProduct = {
      ...body,
      published: false,
      status: 'draft', // أو 'pending' إذا كنت تريد مراجعته قبل النشر
    };

    const supabase = await supabaseServerClient(); // ✅ التهيئة الصحيحة

    const { error } = await supabase.from('products').insert(newProduct);

    if (error) {
      console.error('❌ Error inserting product:', error.message);
      return Response.json(
        errorResponse(error.message),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse(null, '✅ Product inserted successfully.'),
      { status: 201 }
    );
  } catch (err) {
    console.error('❌ Server error:', err.message);
    return Response.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
