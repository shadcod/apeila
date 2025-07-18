// app/api/admin/categories/route.js
import { isAdminGuard } from '@/lib/auth/isAdminGuard';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { supabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// ✅ GET: جلب كل التصنيفات
export async function GET(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const supabase = supabaseServerClient();
  const { data, error } = await supabase.from('categories').select('*');

  if (error) {
    return Response.json(errorResponse('فشل في جلب التصنيفات'), { status: 500 });
  }

  return Response.json(successResponse(data));
}

// ✅ POST: إضافة تصنيف جديد
export async function POST(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const newCategory = await req.json();
  if (!newCategory.name || !newCategory.slug) {
    return Response.json(errorResponse('الاسم والسّلغ مطلوبان'), { status: 400 });
  }

  const supabase = supabaseServerClient();
  const { data, error } = await supabase
    .from('categories')
    .insert(newCategory)
    .select('id')
    .single();

  if (error) {
    return Response.json(errorResponse('فشل في إضافة التصنيف'), { status: 500 });
  }

  return Response.json(successResponse({ id: data.id }, 'تم إنشاء التصنيف بنجاح'), { status: 201 });
}

// ✅ PATCH: تعديل تصنيف موجود
export async function PATCH(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const body = await req.json();
  const { id, ...updatedFields } = body;

  if (!id) {
    return Response.json(errorResponse('معرّف التصنيف مفقود'), { status: 400 });
  }

  const supabase = supabaseServerClient();
  const { data, error } = await supabase
    .from('categories')
    .update(updatedFields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return Response.json(errorResponse('فشل في تعديل التصنيف'), { status: 500 });
  }

  return Response.json(successResponse(data, 'تم تحديث التصنيف بنجاح'));
}

// ✅ DELETE: حذف تصنيف
export async function DELETE(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return Response.json(errorResponse('معرّف التصنيف مفقود'), { status: 400 });
  }

  const supabase = supabaseServerClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    return Response.json(errorResponse('فشل في حذف التصنيف'), { status: 500 });
  }

  return Response.json(successResponse(null, 'تم حذف التصنيف بنجاح'));
}
