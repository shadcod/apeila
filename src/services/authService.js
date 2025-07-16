import { supabase } from '@/lib/supabase'

// تسجيل مستخدم جديد بالبريد وكلمة المرور مع دعم redirectTo
export async function signUp({ email, password, redirectTo }) {
  const { data, error } = await supabase.auth.signUp(
    { email, password },
    { redirectTo }
  )
  if (error) throw error
  return data // يحتوي على user وجلسة (session) أحيانًا
}

// تسجيل الدخول بالبريد وكلمة المرور + التحقق من وجود بروفايل
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error

  const user = data.user

  // التحقق من وجود بروفايل للمستخدم
  const { data: existingProfile, error: profileFetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileFetchError && profileFetchError.code !== 'PGRST116') {
    throw profileFetchError
  }

  if (!existingProfile) {
    const { error: profileInsertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        avatar_url: '',
      })

    if (profileInsertError) throw profileInsertError
  }

  return user
}

// تسجيل الدخول عبر Google OAuth مع دعم redirectTo اختياري
export async function signInWithGoogle(redirectTo) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo || `${window.location.origin}/dashboard`,
    },
  })

  if (error) throw error
  return data
}

// تسجيل الخروج
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// الحصول على المستخدم الحالي (أو null إذا لم يكن مسجل دخول)
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user || null
}
