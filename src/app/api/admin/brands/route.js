// app/api/admin/brands/route.js
import { isAdminGuard } from '@/lib/auth/isAdminGuard';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { supabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET: جلب كل العلامات التجارية
export async function GET(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const supabase = supabaseServerClient();
  const { data, error } = await supabase.from('brands').select('*');

  if (error) {
    return Response.json(errorResponse('فشل في جلب العلامات التجارية'), { status: 500 });
  }

  return Response.json(successResponse(data));
}

// POST: إضافة علامة تجارية جديدة
export async function POST(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const newBrand = await req.json();
  if (!newBrand.name || !newBrand.slug) {
    return Response.json(errorResponse('الاسم والسّلغ مطلوبان'), { status: 400 });
  }

  const supabase = supabaseServerClient();
  const { data, error } = await supabase
    .from('brands')
    .insert(newBrand)
    .select('id')
    .single();

  if (error) {
    return Response.json(errorResponse('فشل في إضافة العلامة التجارية'), { status: 500 });
  }

  return Response.json(successResponse({ id: data.id }, 'تم إنشاء العلامة التجارية بنجاح'), { status: 201 });
}

// PATCH: تعديل علامة تجارية موجودة
export async function PATCH(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const body = await req.json();
  const { id, ...updatedFields } = body;

  if (!id) {
    return Response.json(errorResponse('معرّف العلامة التجارية مفقود'), { status: 400 });
  }

  const supabase = supabaseServerClient();
  const { data, error } = await supabase
    .from('brands')
    .update(updatedFields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return Response.json(errorResponse('فشل في تعديل العلامة التجارية'), { status: 500 });
  }

  return Response.json(successResponse(data, 'تم تحديث العلامة التجارية بنجاح'));
}

// DELETE: حذف علامة تجارية
export async function DELETE(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return Response.json(errorResponse('معرّف العلامة التجارية مفقود'), { status: 400 });
  }

  const supabase = supabaseServerClient();
  const { error } = await supabase.from('brands').delete().eq('id', id);

  if (error) {
    return Response.json(errorResponse('فشل في حذف العلامة التجارية'), { status: 500 });
  }

  return Response.json(successResponse(null, 'تم حذف العلامة التجارية بنجاح'));
}
