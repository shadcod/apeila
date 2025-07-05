'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const pieColors = ['#3b82f6', '#facc15', '#ef4444', '#10b981', '#8b5cf6'];

export default function Charts({
  salesData,
  ordersByChannel,
  customerDistribution,
  topProducts
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 font-sans text-gray-700">
      {/* Cards */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-sm mb-1">Total Sales</h2>
        <p className="text-2xl font-bold text-blue-700">${salesData.totalSales?.toLocaleString() || '0'}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-sm mb-1">Orders</h2>
        <p className="text-2xl font-bold text-blue-700">{salesData.totalOrders?.toLocaleString() || '0'}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-sm mb-1">Sessions</h2>
        <p className="text-2xl font-bold text-blue-700">{salesData.totalSessions?.toLocaleString() || '0'}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-sm mb-1">Returning Customers</h2>
        <p className="text-2xl font-bold text-blue-700">{salesData.returningCustomersRate}%</p>
      </div>

      {/* Additional Stats */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-sm mb-1">Conversion Rate</h2>
        <p className="text-2xl font-bold text-blue-700">{salesData.conversionRate}%</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-sm mb-1">Average Order Value</h2>
        <p className="text-2xl font-bold text-blue-700">${salesData.averageOrderValue.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-sm mb-1">Customer Satisfaction</h2>
        <p className="text-2xl font-bold text-blue-700">{salesData.customerSatisfaction}%</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-sm mb-1">New Customers</h2>
        <p className="text-2xl font-bold text-blue-700">{salesData.newCustomers}</p>
      </div>

      {/* Sales Line Chart */}
      <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow h-80">
        <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData.salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Orders by Channel Bar Chart */}
      <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow h-80">
        <h3 className="text-lg font-semibold mb-4">Orders by Channel</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ordersByChannel}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="channel" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Customer Distribution Pie Chart */}
      <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow h-80">
        <h3 className="text-lg font-semibold mb-4">Customer Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={customerDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {customerDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products Bar Chart */}
      <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow h-80">
        <h3 className="text-lg font-semibold mb-4">Top 5 Best Selling Products</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topProducts} layout="vertical" margin={{ left: 40, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
              tick={{ fontSize: 14 }}
            />
            <Tooltip />
            <Bar dataKey="sales" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
