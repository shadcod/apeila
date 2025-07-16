import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-toastify'
import {
  signUp,
  signIn,
  signOut,
  signInWithGoogle,
  resetPasswordForEmail,
  updatePassword,
  getRedirectAfterLogin,
} from '@/services/authService'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // تحقق من حالة الجلسة عند التحميل
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) {
          console.error('Error getting user:', error)
          setUser(null)
        } else {
          setUser(user)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // استمع لتغيرات حالة المصادقة (دخول/خروج)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // تسجيل مستخدم جديد
  const handleSignUp = async (email, password) => {
    setLoading(true)
    try {
      const newUser = await signUp({ email, password })
      toast.success('Account created! Please check your email for verification if required.')

      const redirectTo = await getRedirectAfterLogin('/')
      router.push(redirectTo)

      return newUser
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // تسجيل دخول
  const handleSignIn = async (email, password) => {
    setLoading(true)
    try {
      const loggedInUser = await signIn({ email, password })
      toast.success('Login successful!')

      const redirectTo = await getRedirectAfterLogin('/')
      router.push(redirectTo)

      return loggedInUser
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // تسجيل خروج
  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut()
      toast.info('Logged out successfully.')
      router.push('/login')
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // تسجيل دخول باستخدام جوجل
  const handleSignInWithGoogle = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      // Supabase يعيد التوجيه تلقائياً
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // طلب إعادة تعيين كلمة المرور عبر البريد
  const handleResetPasswordForEmail = async (email) => {
    setLoading(true)
    try {
      await resetPasswordForEmail(email)
      toast.success('Password reset email sent! Check your inbox.')
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // تحديث كلمة المرور
  const handleUpdatePassword = async (newPassword) => {
    setLoading(true)
    try {
      await updatePassword(newPassword)
      toast.success('Your password has been updated successfully!')
      router.push('/login')
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    handleSignUp,
    handleSignIn,
    handleSignOut,
    handleSignInWithGoogle,
    handleResetPasswordForEmail,
    handleUpdatePassword,
  }
}
