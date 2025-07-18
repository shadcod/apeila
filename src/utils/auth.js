// utils/auth.js
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/auth-helpers-nextjs'

export async function checkRole(allowedRoles = ['admin']) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return { authorized: false }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!profile || !allowedRoles.includes(profile.role)) {
    return { authorized: false }
  }

  return { authorized: true, user: session.user, role: profile.role }
}
