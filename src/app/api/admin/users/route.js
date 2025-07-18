// 📁 app/api/admin/users/route.js
import { isAdminGuard } from '@/lib/auth/isAdminGuard';
import { successResponse } from '@/lib/apiResponse';

export async function GET(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  // TODO: جلب المستخدمين من قاعدة البيانات
  return Response.json(successResponse({ users: [] }));
}