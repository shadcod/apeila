'use client'

import { useEffect } from 'react'
import { debugSupabaseSession } from '@/lib/debugSupabaseSession'

export default function DebugPage() {
  useEffect(() => {
    debugSupabaseSession()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>🔍 Debug Page</h1>
      <p>افتح الكونسول (Console) في المتصفح وسترى التفاصيل هناك.</p>
    </div>
  )
}
