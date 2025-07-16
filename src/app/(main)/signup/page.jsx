'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { handleSignUp, handleSignInWithGoogle, loading, user } = useAuth()
  const router = useRouter()

  // لو المستخدم مسجل دخول بالفعل، نوجهه تلقائيًا (مثلاً للصفحة الرئيسية أو /dashboard)
  if (user) {
    router.push('/dashboard')
    return null
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter both email and password.')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    try {
      await handleSignUp(email, password)
      // التوجيه يتم داخل useAuth.handleSignUp
    } catch (error) {
      // خطأ يعالج داخل useAuth
    }
  }

  const handleGoogleSignup = async () => {
    try {
      await handleSignInWithGoogle()
      // إعادة التوجيه تتم عبر Supabase OAuth
    } catch (error) {
      // خطأ يعالج داخل useAuth
    }
  }

  return (
    <form onSubmit={handleSignup} className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-full"
        disabled={loading}
        autoComplete="email"
        required
      />
      <input
        type="password"
        placeholder="Password (min 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 w-full"
        disabled={loading}
        autoComplete="new-password"
        required
        minLength={6}
      />
      <button type="submit" className="bg-black text-white p-2 w-full" disabled={loading}>
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
      <button
        type="button"
        onClick={handleGoogleSignup}
        className="bg-red-600 text-white p-2 w-full mt-2"
        disabled={loading}
      >
        {loading ? 'Signing Up with Google...' : 'Sign Up with Google'}
      </button>
    </form>
  )
}