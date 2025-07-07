'use client'

import { useState } from 'react'
import { signIn } from '@/services/authService'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signIn({ email, password })
      alert('Login successful!')
      router.push('/dashboard')
    } catch (error) {
      alert(error.message)
    }
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
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button type="submit" className="bg-black text-white p-2 w-full">
        Login
      </button>
    </form>
  )
}
