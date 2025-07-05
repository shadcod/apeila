'use client';

export default function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 h-96">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  );
}
