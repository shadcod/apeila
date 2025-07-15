import { supabase } from '@/lib/supabase'

// تسجيل مستخدم جديد بالبريد وكلمة المرور
export async function signUp({ email, password }) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data.user
}

// تسجيل الدخول بالبريد وكلمة المرور + التأكد من وجود بروفايل
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

// تسجيل الدخول عبر Google OAuth
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // يمكن تحديد redirect URL بعد تسجيل الدخول
      // redirectTo: `${window.location.origin}/dashboard`,
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

// الحصول على المستخدم الحالي
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
