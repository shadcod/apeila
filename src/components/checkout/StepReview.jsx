'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function StepReview({ onBack }) {
  const { cartItems } = useAppContext();
  const router = useRouter();
  const [address, setAddress] = useState(null);
  const [payment, setPayment] = useState('');

  useEffect(() => {
    const savedAddress = localStorage.getItem('checkout-address');
    const savedPayment = localStorage.getItem('checkout-payment');
    if (savedAddress) setAddress(JSON.parse(savedAddress));
    if (savedPayment) setPayment(savedPayment);
  }, []);

  const handleConfirm = () => {
    toast.success('✅ Order placed successfully!');
    localStorage.removeItem('checkout-address');
    localStorage.removeItem('checkout-payment');
    setTimeout(() => {
      router.push('/thank-you');
    }, 1500);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-xl mx-auto">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold text-black">🧾 Review & Confirm</h2>

      <div className="border-t pt-4">
        <h4 className="font-semibold">📦 Products:</h4>
        <ul className="text-sm text-gray-700 list-disc pl-5">
          {cartItems.map((item) => (
            <li key={`${item.id}-${item.selectedColor?.name || ''}-${item.selectedSize || ''}`}>
              {item.name} (x{item.quantity})
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold">🏠 Delivery Address:</h4>
        <p className="text-sm text-gray-700">
          {address?.fullName}, {address?.phone}, {address?.address}
        </p>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold">💳 Payment:</h4>
        <p className="text-sm text-gray-700">{payment}</p>
      </div>

      <div className="flex justify-between gap-4 mt-6">
        <button
          onClick={onBack}
          className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded font-semibold"
        >
          ← Back
        </button>

        <button
          onClick={handleConfirm}
          className="w-1/2 bg-[rgb(var(--yellow))] hover:bg-[rgb(var(--yellow-hover))] text-black py-3 rounded text-lg font-semibold transition-colors duration-200"
        >
          Confirm & Place Order
        </button>
      </div>
    </div>
  );
}
