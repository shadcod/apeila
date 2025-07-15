
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // عدل المسار حسب مشروعك

export default function InventoryPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) {
          console.error('Failed to load products from Supabase:', error);
          throw error;
        }

        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-6 space-y-6 font-sans text-paragraph">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-heading">Inventory</h1>
        <button className="px-4 py-2 bg-yellow text-white rounded-soft text-sm hover:bg-yellow-hover">
          Export Inventory
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded-soft">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-paragraph">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">Product</th>
              <th className="p-3">Status</th>
              <th className="p-3">Inventory Tracked</th>
              <th className="p-3">Available</th>
              <th className="p-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3 flex items-center gap-2">
                  <img src={p.img} alt={p.name} className="w-8 h-8 object-cover rounded" />
                  {p.name}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.stock ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {p.stock ? 'Active' : 'Archived'}
                  </span>
                </td>
                <td className="p-3">{p.inStockCount}</td>
                <td className="p-3">
                  <input
                    type="number"
                    defaultValue={p.inStockCount}
                    className="w-20 border rounded-soft px-2 py-1 text-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


