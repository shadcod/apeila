import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
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

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) {
          setUser(null)
          setLoading(false)
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profileError) {
          setUser({ ...user, role: null })
        } else {
          setUser({ ...user, role: profile.role })
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          setUser({ ...session.user, role: null })
        } else {
          setUser({ ...session.user, role: profile.role })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSignUp = async (email, password) => {
    setLoading(true)
    try {
      const newUser = await signUp({ email, password })
      toast.success('Account created!')
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

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut()
      toast.info('Logged out.')
      router.push('/login')
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleSignInWithGoogle = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleResetPasswordForEmail = async (email) => {
    setLoading(true)
    try {
      await resetPasswordForEmail(email)
      toast.success('Password reset email sent!')
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (newPassword) => {
    setLoading(true)
    try {
      await updatePassword(newPassword)
      toast.success('Password updated!')
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
