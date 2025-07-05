'use client';

import {
  PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer,
} from 'recharts';
import ChartCard from './ChartCard';

export default function CustomerDistributionChart({ data }) {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  return (
    <ChartCard title="Customer Distribution">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
            {data.map((entry, index) => (
              <Cell key={`cust-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
