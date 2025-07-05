'use client';

import { useEffect, useState } from 'react';
import { FaBoxOpen, FaCheckCircle, FaWarehouse, FaDollarSign } from 'react-icons/fa';

import DashboardCard from './cards/DashboardCard';
import DateFilter from './DateFilter';

import SalesChart from './charts/SalesChart';
import OrdersChannelChart from './charts/OrdersChannelChart';
import CustomerDistributionChart from './charts/CustomerDistributionChart';
import StockStatusChart from './charts/StockStatusChart';
import TopProductsChart from './charts/TopProductsChart';
import MostViewedProductsChart from './charts/MostViewedProductsChart';
import LowStockAlert from './LowStockAlert';
import ExtraStatsCards from './cards/ExtraStatsCards';

export default function HomePage() {
  const [salesData, setSalesData] = useState([]);
  const [ordersByChannel, setOrdersByChannel] = useState([]);
  const [customerDistribution, setCustomerDistribution] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedRange, setSelectedRange] = useState('Last 7 Days');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/data/dashboard.json');
        const data = await res.json();
        setSalesData(data.salesData || []);
        setOrdersByChannel(data.ordersByChannel || []);
        setCustomerDistribution(data.customerDistribution || []);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    const fetchProductsData = async () => {
      try {
        const res = await fetch('/data/products.json');
        const data = await res.json();
        setProducts(data || []);
      } catch (error) {
        console.error('Failed to load products data:', error);
      }
    };

    const fetchOrdersData = async () => {
      try {
        const res = await fetch('/data/products.json');
        const data = await res.json();
        setOrders(data || []);
      } catch (error) {
        console.error('Failed to load orders data:', error);
      }
    };

    const fetchCustomersData = async () => {
      try {
        const res = await fetch('/data/products.json');
        const data = await res.json();
        setCustomers(data || []);
      } catch (error) {
        console.error('Failed to load customers data:', error);
      }
    };

    fetchDashboardData();
    fetchProductsData();
    fetchOrdersData();
    fetchCustomersData();
  }, []);

  // تصفية المبيعات حسب المدى الزمني
  const filteredSalesData = salesData.filter((entry, index) => {
    if (selectedRange === 'Last 7 Days') return index >= salesData.length - 7;
    if (selectedRange === 'Last 30 Days') return index >= salesData.length - 30;
    return true;
  });

  // حسابات أساسية
  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.stock).length;
  const totalStockUnits = products.reduce((sum, p) => sum + (p.inStockCount || 0), 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.inStockCount || 0)), 0);

  const topSellingProducts = [...products]
    .sort((a, b) => (b.inStockCount || 0) - (a.inStockCount || 0))
    .slice(0, 5);

  const lowStockProducts = products
    .filter(p => (p.inStockCount || 0) <= 5)
    .slice(0, 5);

  const customerStatus = [
    { name: 'In Stock', value: inStockCount },
    { name: 'Out of Stock', value: totalProducts - inStockCount },
  ];

  // حسابات البيانات الجديدة
  const todayISO = new Date().toISOString().split('T')[0];

  const ordersToday = orders.filter(order => order.date?.startsWith(todayISO)).length;
  const newCustomers = customers.filter(cust => cust.createdAt?.startsWith(todayISO)).length;

  const mostViewedProducts = [...products]
    .filter(p => p.views)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          📊 Welcome back, Admin! <span className="text-blue-600">Wetren Store</span>
        </h1>
        <p className="text-gray-500">Here’s what’s happening in your store today.</p>
      </div>

      <DateFilter selectedRange={selectedRange} onChange={setSelectedRange} />

      {/* البطاقات الإحصائية الأساسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard icon={<FaBoxOpen />} title="Total Products" value={totalProducts} />
        <DashboardCard icon={<FaCheckCircle />} title="In Stock Items" value={inStockCount} />
        <DashboardCard icon={<FaWarehouse />} title="Units in Inventory" value={totalStockUnits} />
        <DashboardCard icon={<FaDollarSign />} title="Inventory Value" value={`$${totalInventoryValue.toFixed(2)}`} />
      </div>

      {/* بطاقات الطلبات والعملاء الجدد */}
      <ExtraStatsCards ordersToday={ordersToday} newCustomers={newCustomers} />

      {/* تنبيه المنتجات منخفضة المخزون */}
      <LowStockAlert products={lowStockProducts} />

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SalesChart data={filteredSalesData} />
        <OrdersChannelChart data={ordersByChannel} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CustomerDistributionChart data={customerDistribution} />
        <StockStatusChart data={customerStatus} />
      </div>

      {/* الرسوم الجديدة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsChart data={topSellingProducts} />
        <MostViewedProductsChart data={mostViewedProducts} />
      </div>
    </div>
  );
}
