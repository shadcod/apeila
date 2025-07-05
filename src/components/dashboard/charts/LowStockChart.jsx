'use client';

import {
  BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer, Cell,
} from 'recharts';
import ChartCard from './ChartCard';

export default function LowStockChart({ data }) {
  return (
    <ChartCard title="🛑 Low Stock Products (<= 5)">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Bar dataKey="inStockCount" fill="#ef4444">
            {data.map((entry, index) => (
              <Cell key={`low-${index}`} fillOpacity={0.9} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
