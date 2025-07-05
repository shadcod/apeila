'use client';

import {
  PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer,
} from 'recharts';
import ChartCard from './ChartCard';

export default function StockStatusChart({ data }) {
  return (
    <ChartCard title="Stock Status Overview">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
            {data.map((entry, index) => (
              <Cell key={`stock-${index}`} fill={index === 0 ? '#22c55e' : '#ef4444'} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
