// app/api/admin/dashboard/route.js

import { supabaseServerClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const supabase = supabaseServerClient(req);

    const [
      { count: productsCount },
      { count: usersCount },
      { count: ordersCount },
      { data: ratingData, error: ratingError },
      { count: inStockCount },
      { count: deliveredOrdersCount },
    ] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('rating').order('rating', { ascending: false }).limit(1), // مثال: نجيب أعلى تقييم
      supabase.from('products').select('id', { count: 'exact', head: true }).gt('stock', 0),
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'delivered'),
    ]);

    // حساب متوسط تقييم إذا نزلنا بيانات التقييمات
    // لو عندك جدول تقييمات منفصل استخدم استعلام aggregation مناسب

    return Response.json(
      successResponse({
        productsCount,
        usersCount,
        ordersCount,
        highestRating: ratingData?.[0]?.rating || 0,
        inStockCount,
        deliveredOrdersCount,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return Response.json(errorResponse('Failed to fetch dashboard statistics'), { status: 500 });
  }
}
