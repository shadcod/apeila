'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function CouponForm({ applyCoupon }) {
  const [code, setCode] = useState('');

  const handleApply = () => {
    if (!code) {
      toast.error('Please enter a coupon code');
      return;
    }
    applyCoupon(code);
    toast.success('🎉 Coupon applied');
  };

  return (
    <div className="bg-white border rounded-lg shadow p-4 mt-6">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">Have a Coupon?</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-green-500"
        />
        <button
          onClick={handleApply}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
