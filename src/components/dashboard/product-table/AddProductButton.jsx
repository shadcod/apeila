'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function AddProductButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/dashboard/products/new')}
      className="px-3 py-2 rounded-md flex items-center gap-1 transition hover:scale-105 active:scale-95"
      style={{
        backgroundColor: 'rgb(var(--yellow))',
        color: '#111',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--yellow-hover))'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--yellow))'}
    >
      <Plus size={16} /> Add Product +
    </button>
  );
}
