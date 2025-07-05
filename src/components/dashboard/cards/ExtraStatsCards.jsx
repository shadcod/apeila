'use client';

// ✅ المكون 3: ExtraStatsCards.jsx
// عرض بطاقات لطلبات اليوم والعملاء الجدد

import { FaUserPlus, FaShoppingBag } from 'react-icons/fa';

export default function ExtraStatsCards({ ordersToday = 0, newCustomers = 0 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-lg transition border-l-4 border-blue-500">
        <div className="text-blue-500 text-3xl">
          <FaShoppingBag />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Orders Today</p>
          <h3 className="text-xl font-semibold text-gray-800">{ordersToday}</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-lg transition border-l-4 border-green-500">
        <div className="text-green-500 text-3xl">
          <FaUserPlus />
        </div>
        <div>
          <p className="text-gray-500 text-sm">New Customers</p>
          <h3 className="text-xl font-semibold text-gray-800">{newCustomers}</h3>
        </div>
      </div>
    </div>
  );
}
