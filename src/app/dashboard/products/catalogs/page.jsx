// app/dashboard/products/catalogs/page.jsx
'use client';

import { useEffect, useState } from 'react';

export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState([]);

  useEffect(() => {
    const fetchCatalogs = async () => {
      const res = await fetch('/data/catalogs.json');
      const data = await res.json();
      setCatalogs(data);
    };
    fetchCatalogs();
  }, []);

  return (
    <div className="p-6 space-y-6 font-sans text-paragraph">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-heading">Catalogs</h1>
        <button className="px-4 py-2 bg-yellow text-white rounded-soft text-sm hover:bg-yellow-hover">
          Upload Catalog
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded-soft">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-paragraph">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Products</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {catalogs.map((cat) => (
              <tr key={cat.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{cat.title}</td>
                <td className="p-3">{cat.productsCount}</td>
                <td className="p-3">{cat.date}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    cat.status === 'Published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {cat.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <a
                    href={cat.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
