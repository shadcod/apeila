'use client';

export default function DashboardCard({ icon, title, value, color = "blue" }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition">
      <div className={`text-${color}-500 text-3xl bg-${color}-100 p-2 rounded-full`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}
