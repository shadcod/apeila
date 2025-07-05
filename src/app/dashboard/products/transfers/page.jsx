// app/dashboard/products/transfers/page.jsx
'use client';

import { useEffect, useState } from 'react';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    const fetchTransfers = async () => {
      const res = await fetch('/data/transfers.json');
      const data = await res.json();
      setTransfers(data);
    };
    fetchTransfers();
  }, []);

  return (
    <div className="p-6 space-y-6 font-sans text-paragraph">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-heading">Transfers</h1>
        <button className="px-4 py-2 bg-yellow text-white rounded-soft text-sm hover:bg-yellow-hover">
          New Transfer
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded-soft">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-paragraph">
            <tr>
              <th className="p-3">Transfer ID</th>
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Items</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{t.id}</td>
                <td className="p-3">{t.from}</td>
                <td className="p-3">{t.to}</td>
                <td className="p-3">{t.date}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    t.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : t.status === 'In Transit'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="p-3">{t.itemsCount}</td>
                <td className="p-3 text-right space-x-2">
                  <button className="text-blue-600 hover:underline text-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
