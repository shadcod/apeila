import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server'
import { createErrorResponse } from '@/lib/apiResponse';

export async function middleware(req) {
  const res = NextResponse.next();

  const supabase = supabaseServerClient(req, res);
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  const url = req.nextUrl;
  const pathname = url.pathname;

  const protectedPaths = ['/checkout', '/orders', '/account', '/dashboard'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (sessionError) {
    console.error("Error retrieving session:", sessionError);
    return createErrorResponse(sessionError, "Authentication error", 401);
  }

  if (isProtected && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith('/dashboard') && session) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) {
      console.error("Error retrieving profile:", profileError);
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/checkout/:path*', '/orders/:path*', '/account/:path*', '/dashboard/:path*'],
};
