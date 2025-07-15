'use client'

import { useState } from 'react'
import { signIn, signInWithGoogle } from '@/services/authService'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    try {
      await signIn({ email, password })

      const searchParams = new URLSearchParams(window.location.search)
      const redirectedFrom = searchParams.get('redirectedFrom') || '/dashboard'

      router.push(redirectedFrom)
    } catch (error) {
      setErrorMessage(error.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
      // لا حاجة للتوجيه يدوي، Supabase يوجّه المستخدم تلقائياً بعد تسجيل الدخول الناجح
    } catch (error) {
      setErrorMessage(error.message || 'Failed to login with Google')
    }
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      {errorMessage && <div className="mb-2 text-red-600">{errorMessage}</div>}

      <form onSubmit={handleLogin} className="mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 w-full rounded hover:bg-gray-800 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-t" />
        <span className="mx-2 text-gray-500 text-sm">OR</span>
        <hr className="flex-grow border-t" />
      </div>

      <button
        onClick={handleGoogleLogin}
        className="bg-white border text-black p-2 w-full rounded hover:bg-gray-100 transition"
      >
        Continue with Google
      </button>
    </div>
  )
}
