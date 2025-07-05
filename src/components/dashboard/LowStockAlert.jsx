'use client';

// ✅ المكون 1: LowStockAlert.jsx
// إشعار المنتجات منخفضة المخزون

export default function LowStockAlert({ products = [] }) {
  if (!products.length) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-md mb-6">
      <strong>⚠️ Low Stock Alert:</strong> {products.length} product{products.length > 1 && 's'} are running low.
    </div>
  );
}
