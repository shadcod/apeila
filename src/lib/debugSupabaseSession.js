import { supabase } from '@/lib/supabase'

export async function debugSupabaseSession() {
  try {
    // ✅ جلب بيانات session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log("🟢 Session from client debug:", session)

    console.log("🚀 Session Error:", sessionError)
    console.log("✅ Session Data:", session)

    if (!session?.user) {
      console.log("⚠️ لا يوجد مستخدم مسجل حاليا.")
      return
    }

    // ✅ طباعة user id
    const userId = session.user.id
    console.log("✅ Session User ID:", userId)

    // ✅ جلب صف الـ profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    console.log("✅ Profile Data:", profile)
    console.log("🚨 Profile Error:", profileError)

    // ✅ التأكد من الدور
    if (profile) {
      console.log("🎖️ User Role:", profile.role)
      if (profile.role === 'admin') {
        console.log("✅ الدور صحيح: Admin")
      } else {
        console.log("⚠️ الدور الحالي ليس Admin، بل:", profile.role)
      }
    } else {
      console.log("⚠️ لا يوجد صف profile لهذا المستخدم.")
    }
  } catch (err) {
    console.error("🔥 خطأ أثناء التحقق:", err)
  }
}
