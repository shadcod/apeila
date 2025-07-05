// app/dashboard/products/gift-cards/page.jsx
'use client';

import { useEffect, useState } from 'react';

export default function GiftCardsPage() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const res = await fetch('/data/gift-cards.json');
      const data = await res.json();
      setCards(data);
    };
    fetchCards();
  }, []);

  return (
    <div className="p-6 space-y-6 font-sans text-paragraph">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-heading">Gift Cards</h1>
        <button className="px-4 py-2 bg-yellow text-white rounded-soft text-sm hover:bg-yellow-hover">
          Issue Gift Card
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded-soft">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-paragraph">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Balance</th>
              <th className="p-3">Created</th>
              <th className="p-3">Expires</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{card.code}</td>
                <td className="p-3">{card.customer}</td>
                <td className="p-3">${card.balance.toFixed(2)}</td>
                <td className="p-3">{card.createdAt}</td>
                <td className="p-3">{card.expiresAt}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    card.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : card.status === 'Disabled'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {card.status}
                  </span>
                </td>
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
