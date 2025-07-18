// src/app/dashboard/page.jsx
import { redirect } from 'next/navigation'
import { checkRole } from '@/utils/auth'
import Charts from '@components/dashboard/Charts'

export default async function DashboardPage() {
  const { authorized } = await checkRole(['admin'])

  if (!authorized) {
    redirect('/')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>
      <Charts />
    </div>
  )
}
