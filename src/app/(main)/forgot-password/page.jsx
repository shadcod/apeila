
'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks/useAuth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const { handleResetPasswordForEmail, loading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await handleResetPasswordForEmail(email)
    } catch (error) {
      // Error handled by useAuth hook, no need to re-toast here
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <p className="mb-4 text-sm text-gray-600">Enter your email to receive a password reset link.</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-full"
        disabled={loading}
      />
      <button type="submit" className="bg-black text-white p-2 w-full" disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  )
}


