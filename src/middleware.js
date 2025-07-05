import { NextResponse } from 'next/server';

export function middleware(request) {
  // قائمة الصفحات المحمية (حالياً غير مفعلة)
  // const authPages = ['/checkout', '/orders', '/account'];
  // const isAuthPage = authPages.some(page => request.nextUrl.pathname.startsWith(page));

  // حاليا تم تعطيل الحماية مؤقتًا أثناء التطوير
  /*
  if (isAuthPage) {
    const token = request.cookies.get('auth_token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  */

  // السماح لكل الطلبات بالمرور بدون إعادة توجيه
  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout/:path*', '/orders/:path*', '/account/:path*'],
};

/*
  ملاحظة هامة:
  تم تعطيل الحماية مؤقتاً للسماح بالوصول إلى صفحات الدفع، الطلبات، والحساب أثناء التطوير.
  لا تنسى إعادة تفعيلها قبل الانتقال لمرحلة الاختبار أو الإطلاق.
*/
