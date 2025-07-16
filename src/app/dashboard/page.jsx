'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Charts from '@components/dashboard/Charts'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()

  const [dashboardData, setDashboardData] = useState({
    salesData: [],
    ordersByChannel: [],
    customerDistribution: [],
    topProducts: [],
    totalSales: 0,
    totalOrders: 0,
    totalSessions: 0,
    returningCustomersRate: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    customerSatisfaction: 0,
    newCustomers: 0,
  })

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user?.role !== 'admin') {
        router.replace('/')
      }
    }
  }, [user, isAuthenticated, loading, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/data/dashboard.json')
        const data = await res.json()
        setDashboardData(data)
      } catch (error) {
        console.error('Failed to fetch dashboard data', error)
      }
    }

    if (!loading && isAuthenticated && user?.role === 'admin') {
      fetchData()
    }
  }, [loading, isAuthenticated, user])

  if (loading || !isAuthenticated || user?.role !== 'admin') {
    return <p className="text-center mt-10">Loading...</p>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>
      <Charts
        salesData={dashboardData}
        ordersByChannel={dashboardData.ordersByChannel}
        customerDistribution={dashboardData.customerDistribution}
        topProducts={dashboardData.topProducts}
      />
    </div>
  )
}