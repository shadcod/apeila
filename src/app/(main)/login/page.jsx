'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { handleSignIn, handleSignInWithGoogle, loading } = useAuth()

  const saveRedirectPath = () => {
    // حفظ الرابط الحالي في كوكيز لعملية إعادة التوجيه بعد تسجيل الدخول
    Cookies.set('redirectAfterLogin', window.location.pathname, { path: '/' })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      saveRedirectPath()
      await handleSignIn(email, password)
    } catch {}
  }

  const handleGoogleLogin = async () => {
    try {
      saveRedirectPath()
      await handleSignInWithGoogle()
    } catch {}
  }

  return (
    <form onSubmit={handleLogin} className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-full"
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 w-full"
        disabled={loading}
      />
      <button type="submit" className="bg-black text-white p-2 w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="bg-red-600 text-white p-2 w-full mt-2"
        disabled={loading}
      >
        {loading ? 'Logging in with Google...' : 'Login with Google'}
      </button>
    </form>
  )
}