'use client'

import { useState } from 'react'
import { signIn, signInWithGoogle } from '@/services/authService'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'  // استدعاء hook المصادقة

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const { setIsAuthenticated } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      await signIn({ email, password })
      setIsAuthenticated(true)

      const searchParams = new URLSearchParams(window.location.search)
      const redirectedFrom = searchParams.get('redirectedFrom') || '/dashboard'

      router.push(redirectedFrom)
    } catch (error) {
      setErrorMessage(error.message || 'Failed to login')
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setErrorMessage('')
    setLoading(true)

    try {
      await signInWithGoogle()
      // Supabase يعيد التوجيه تلقائياً بعد نجاح تسجيل الدخول
      setIsAuthenticated(true)
    } catch (error) {
      setErrorMessage(error.message || 'Failed to login with Google')
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      {errorMessage && (
        <div className="mb-2 text-red-600 text-center">{errorMessage}</div>
      )}

      <form onSubmit={handleLogin} className="mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
          required
          autoComplete="email"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
          required
          autoComplete="current-password"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 w-full rounded hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
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
        disabled={loading}
        className="bg-white border text-black p-2 w-full rounded hover:bg-gray-100 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <path
            d="M21.805 10.023h-9.662v3.853h5.76c-.248 1.47-1.58 4.31-5.76 4.31-3.475 0-6.313-2.884-6.313-6.434 0-3.55 2.838-6.434 6.313-6.434 1.976 0 3.3.85 4.07 1.58l2.78-2.68C17.588 5.04 15.652 4.12 13.45 4.12 7.633 4.12 3 8.955 3 14.78c0 5.826 4.633 10.66 10.45 10.66 6.032 0 10.05-4.22 10.05-10.18 0-.68-.076-1.173-.695-1.237z"
            fill="#4285F4"
          />
        </svg>
        {loading ? 'Please wait...' : 'Continue with Google'}
      </button>
    </div>
  )
}
