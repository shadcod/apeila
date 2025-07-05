'use client';

// ✅ KpiCards.jsx
// عرض بطاقات إحصائية رئيسية من ملف dashboard.json

import { FaDollarSign, FaShoppingCart, FaUserPlus, FaRedo, FaChartLine, FaSmile } from 'react-icons/fa';

const cards = [
  {
    title: 'Total Sales',
    key: 'totalSales',
    icon: <FaDollarSign className="text-green-500" />,
    format: (v) => `$${v.toLocaleString()}`
  },
  {
    title: 'Total Orders',
    key: 'totalOrders',
    icon: <FaShoppingCart className="text-blue-500" />,
    format: (v) => v.toLocaleString()
  },
  {
    title: 'New Customers',
    key: 'newCustomers',
    icon: <FaUserPlus className="text-indigo-500" />,
    format: (v) => v
  },
  {
    title: 'Returning Customers',
    key: 'returningCustomersRate',
    icon: <FaRedo className="text-orange-500" />,
    format: (v) => `${v}%`
  },
  {
    title: 'Conversion Rate',
    key: 'conversionRate',
    icon: <FaChartLine className="text-fuchsia-500" />,
    format: (v) => `${v}%`
  },
  {
    title: 'Customer Satisfaction',
    key: 'customerSatisfaction',
    icon: <FaSmile className="text-yellow-500" />,
    format: (v) => `${v}%`
  }
];

export default function KpiCards({ data = {} }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
      {cards.map((card) => (
        <div
          key={card.key}
          className="bg-white shadow rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition"
        >
          <div className="text-3xl">{card.icon}</div>
          <div>
            <p className="text-gray-500 text-sm">{card.title}</p>
            <h3 className="text-xl font-semibold text-gray-800">
              {card.format(data[card.key] || 0)}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
