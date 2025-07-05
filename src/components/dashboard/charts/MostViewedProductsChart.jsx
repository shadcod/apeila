'use client';

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

const COLORS = ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'];

export default function MostViewedProductsChart({ data }) {
  const router = useRouter();

  // عند الضغط على عمود المنتج ينتقل لصفحة المنتج عبر slug
  const handleClick = (entry) => {
    const slug = entry?.payload?.slug;
    if (slug) router.push(`/products/${slug}`);
  };

  return (
    <ChartCard title="Top 5 Most Viewed Products">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Bar
            dataKey="views"
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
