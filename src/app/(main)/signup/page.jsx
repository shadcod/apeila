'use client'

import { useState } from 'react'
import { signUp, signInWithGoogle } from '@/services/authService'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth' // تعديل هنا لاستخدام hook المخصص

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()
  const { setIsAuthenticated } = useAuth() // استخدام hook المخصص

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      const data = await signUp({ email, password })
      
      // تحقق من وجود التحقق من البريد في supabase
      if (!data.session) {
        setSuccessMessage('Account created! Please check your email to verify.')
        setIsAuthenticated(false) // لم يتم تفعيل الحساب بعد
        // يمكن توجيه المستخدم لصفحة تعليمات التحقق أو صفحة تسجيل الدخول
        router.push('/login')
      } else {
        setIsAuthenticated(true)
        router.push('/dashboard')
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to sign up. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setErrorMessage('')
    setSuccessMessage('')
    setLoading(true)

    try {
      await signInWithGoogle(`${window.location.origin}/dashboard`)
      // Supabase سيعيد التوجيه تلقائياً بعد نجاح Google OAuth
      setIsAuthenticated(true)
    } catch (error) {
      setErrorMessage(error.message || 'Google sign-in failed. Please try again.')
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
        noValidate
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Your Account</h2>

        {errorMessage && (
          <div className="mb-4 text-center text-red-600 bg-red-100 p-2 rounded">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 text-center text-green-700 bg-green-100 p-2 rounded">
            {successMessage}
          </div>
        )}

        <label htmlFor="email" className="block text-gray-700 mb-1 font-medium">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          autoComplete="email"
          disabled={loading}
        />

        <label htmlFor="password" className="block text-gray-700 mb-1 font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Minimum 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          minLength={6}
          disabled={loading}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded text-white font-semibold mb-4 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } transition`}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <div className="text-center mb-4">or</div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className={`w-full py-3 rounded border border-gray-300 text-gray-700 font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition ${
            loading ? 'cursor-not-allowed opacity-70' : ''
          }`}
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
          {loading ? 'Please wait...' : 'Sign up with Google'}
        </button>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-800 font-medium transition"
          >
            Log In
          </a>
        </p>
      </form>
    </div>
  )
}
