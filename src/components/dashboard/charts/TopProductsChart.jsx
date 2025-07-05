'use client';

// ✅ المكون 2: TopProductsChart.jsx
// رسم بياني لأفضل المنتجات مبيعًا + دعم الضغط

import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useRouter } from 'next/navigation';
import ChartCard from './ChartCard';

const COLORS = ['#10b981', '#22c55e', '#3b82f6', '#f97316', '#e11d48'];

export default function TopProductsChart({ data }) {
  const router = useRouter();

  const handleClick = (entry) => {
    const slug = entry?.payload?.slug;
    if (slug) router.push(`/products/${slug}`);
  };

  return (
    <ChartCard title="Top 5 Best Selling Products">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Bar
            dataKey="inStockCount"
            onClick={handleClick}
            cursor="pointer"
          >
            {data.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
