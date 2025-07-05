'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const res = await fetch('/data/collections.json');
      const data = await res.json();
      setCollections(data);
    };

    fetchCollections();
  }, []);

  return (
    <div className="p-6 space-y-6 font-sans text-paragraph">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-heading">Collections</h1>

        <Link
          href="/dashboard/products/collections/create"
          className="inline-block px-5 py-2 text-sm font-medium rounded-soft shadow-sm transition duration-200 text-heading"
          style={{
            backgroundColor: 'rgb(var(--yellow))',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgb(var(--yellow-hover))')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgb(var(--yellow))')}
        >
          + Create Collection
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded-soft bg-white shadow-card">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-paragraph">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Products</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3 font-medium text-heading">{c.title}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      c.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-3">{c.productsCount}</td>
                <td className="p-3 text-right space-x-2">
                  <Link
                    href={`/dashboard/products/collections/view/${c.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </Link>
                  <button className="text-gray-600 hover:underline text-sm">Edit</button>
                  <button className="text-red-600 hover:underline text-sm">Archive</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
