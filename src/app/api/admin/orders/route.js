// 📁 app/api/admin/orders/route.js
import { isAdminGuard } from '@/lib/auth/isAdminGuard';
import { successResponse } from '@/lib/apiResponse';

export async function GET(req) {
  const guard = await isAdminGuard(req);
  if (!guard.success) return guard.response;

  // TODO: جلب الطلبات من قاعدة البيانات
  return Response.json(successResponse({ orders: [] }));
}