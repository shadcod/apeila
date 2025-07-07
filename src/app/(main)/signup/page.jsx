'use client'

import { useState } from 'react'
import { signUp } from '@/services/authService'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      await signUp({ email, password })
      alert('Account created!')
      router.push('/login')
    } catch (error) {
      alert(error.message)
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
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button type="submit" className="bg-black text-white p-2 w-full">
        Sign Up
      </button>
    </form>
  )
}
