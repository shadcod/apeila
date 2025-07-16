'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Charts from '@components/dashboard/Charts';
import { useAuth } from '@/hooks/useAuth'
 // استدعاء الـ hook حسب المسار

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

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
  });

  // توجيه المستخدم لصفحة تسجيل الدخول إذا لم يكن مسجلاً
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/data/dashboard.json');
        const data = await res.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    }

    // فقط نحمل البيانات إذا المستخدم مسجل دخول
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

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
  );
}
