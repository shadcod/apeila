// app/api/admin/collections/route.js
import { isAdminGuard } from '@/lib/auth/isAdminGuard';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { supabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// ✅ GET: جلب كل الـ collections
export async function GET(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const supabase = supabaseServerClient();
  const { data, error } = await supabase.from('collections').select('*');

  if (error) {
    return Response.json(errorResponse('فشل في جلب المجموعات'), { status: 500 });
  }

  return Response.json(successResponse(data));
}

// ✅ POST: إضافة مجموعة جديدة
export async function POST(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const newCollection = await req.json();
  if (!newCollection.name || !newCollection.slug) {
    return Response.json(errorResponse('الاسم والسّلغ مطلوبان'), { status: 400 });
  }

  const supabase = supabaseServerClient();
  const { data, error } = await supabase
    .from('collections')
    .insert(newCollection)
    .select('id')
    .single();

  if (error) {
    return Response.json(errorResponse('فشل في إضافة المجموعة'), { status: 500 });
  }

  return Response.json(successResponse({ id: data.id }, 'تم إنشاء المجموعة بنجاح'), { status: 201 });
}

// ✅ PATCH: تعديل مجموعة موجودة
export async function PATCH(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const body = await req.json();
  const { id, ...updatedFields } = body;

  if (!id) {
    return Response.json(errorResponse('معرّف المجموعة مفقود'), { status: 400 });
  }

  const supabase = supabaseServerClient();
  const { data, error } = await supabase
    .from('collections')
    .update(updatedFields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return Response.json(errorResponse('فشل في تعديل المجموعة'), { status: 500 });
  }

  return Response.json(successResponse(data, 'تم تحديث المجموعة بنجاح'));
}

// ✅ DELETE: حذف مجموعة
export async function DELETE(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return Response.json(errorResponse('معرّف المجموعة مفقود'), { status: 400 });
  }

  const supabase = supabaseServerClient();
  const { error } = await supabase.from('collections').delete().eq('id', id);

  if (error) {
    return Response.json(errorResponse('فشل في حذف المجموعة'), { status: 500 });
  }

  return Response.json(successResponse(null, 'تم حذف المجموعة بنجاح'));
}
