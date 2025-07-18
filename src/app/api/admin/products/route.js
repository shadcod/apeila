// app/api/admin/products/route.js
import { isAdminGuard } from '@/lib/auth/isAdminGuard';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { supabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// ✅ GET: جلب كل المنتجات
export async function GET(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const supabase = supabaseServerClient();
  const { data, error } = await supabase.from('products').select('*');

  if (error) {
    return Response.json(errorResponse('فشل في جلب المنتجات'), { status: 500 });
  }

  return Response.json(successResponse(data));
}

// ✅ POST: إنشاء منتج جديد
export async function POST(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const newProduct = await req.json();
  if (!newProduct.name || !newProduct.slug) {
    return Response.json(errorResponse('اسم وسلَغ المنتج مطلوبان'), { status: 400 });
  }

  const supabase = supabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .insert(newProduct)
    .select('id')
    .single();

  if (error) {
    return Response.json(errorResponse('فشل في إضافة المنتج'), { status: 500 });
  }

  return Response.json(successResponse({ id: data.id }, 'تم إنشاء المنتج بنجاح'), { status: 201 });
}

// ✅ PATCH: تعديل منتج موجود
export async function PATCH(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const body = await req.json();
  const { id, ...updatedFields } = body;

  if (!id) {
    return Response.json(errorResponse('معرّف المنتج مفقود'), { status: 400 });
  }

  const supabase = supabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .update(updatedFields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return Response.json(errorResponse('فشل في تعديل المنتج'), { status: 500 });
  }

  return Response.json(successResponse(data, 'تم تحديث المنتج بنجاح'));
}

// ✅ DELETE: حذف منتج حسب الـ ID
export async function DELETE(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return Response.json(errorResponse('معرّف المنتج مفقود'), { status: 400 });
  }

  const supabase = supabaseServerClient();
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    return Response.json(errorResponse('فشل في حذف المنتج'), { status: 500 });
  }

  return Response.json(successResponse(null, 'تم حذف المنتج بنجاح'));
}
