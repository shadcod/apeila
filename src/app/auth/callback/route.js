import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getRedirectAfterLogin } from '@/services/authService'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectParam = requestUrl.searchParams.get('redirect') || ''

  const supabase = createRouteHandlerClient({ cookies })

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  let redirectTo = requestUrl.origin + '/'
  try {
    const target = await getRedirectAfterLogin('/')
    redirectTo = requestUrl.origin + target

    if (redirectParam) {
      redirectTo = requestUrl.origin + redirectParam
    }
  } catch (error) {
    console.error('Error determining redirect after callback:', error)
  }

  return NextResponse.redirect(redirectTo)
}
