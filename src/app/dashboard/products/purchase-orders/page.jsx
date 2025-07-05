// app/dashboard/products/purchase-orders/page.jsx
'use client';

import { useEffect, useState } from 'react';

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/data/purchase-orders.json');
      const data = await res.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6 space-y-6 font-sans text-paragraph">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-heading">Purchase Orders</h1>
        <button className="px-4 py-2 bg-yellow text-white rounded-soft text-sm hover:bg-yellow-hover">
          Create Order
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded-soft">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-paragraph">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Items</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.vendor}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'Received'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3">{order.itemsCount}</td>
                <td className="p-3 text-right space-x-2">
                  <button className="text-blue-600 hover:underline text-sm">View</button>
                  <button className="text-gray-600 hover:underline text-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
