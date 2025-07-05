'use client';

import { useEffect, useState } from 'react';

export default function StepPayment({ onNext, onBack }) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvc: '',
  });
  const [paypalInfo, setPaypalInfo] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('checkout-payment');
    if (saved) setSelectedMethod(saved);
  }, []);

  useEffect(() => {
    if (selectedMethod) {
      localStorage.setItem('checkout-payment', selectedMethod);
    }
  }, [selectedMethod]);

  const handleContinue = () => {
    if (!selectedMethod) {
      alert('Please select a payment method.');
      return;
    }

    if (selectedMethod === 'stripe') {
      const { number, expiry, cvc } = cardInfo;
      if (!number || !expiry || !cvc) {
        alert('Please enter valid card details.');
        return;
      }
    }

    if (selectedMethod === 'paypal') {
      const { email, password } = paypalInfo;
      if (!email || !password) {
        alert('Please enter your PayPal credentials.');
        return;
      }
    }

    onNext();
  };

  const paymentOptions = [
    { label: '💵 Cash on Delivery', value: 'cash' },
    { label: '💳 Pay with Card (Stripe)', value: 'stripe' },
    { label: '🅿️ PayPal', value: 'paypal' },
  ];

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-black">💳 Payment Method</h2>

      <div className="space-y-4">
        {paymentOptions.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-3 border rounded px-4 py-3 cursor-pointer transition
              ${
                selectedMethod === option.value
                  ? 'border-[rgb(var(--yellow))] bg-[rgba(var(--yellow), 0.1)]'
                  : 'hover:border-gray-300'
              }`}
          >
            <input
              type="radio"
              name="payment"
              value={option.value}
              checked={selectedMethod === option.value}
              onChange={() => setSelectedMethod(option.value)}
              className="mr-2"
            />
            <span className="font-medium text-gray-800">{option.label}</span>
          </label>
        ))}
      </div>

      {/* Stripe card form */}
      {selectedMethod === 'stripe' && (
        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Card Number"
            maxLength={19}
            className="w-full border px-3 py-2 rounded"
            value={cardInfo.number}
            onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              maxLength={5}
              className="w-1/2 border px-3 py-2 rounded"
              value={cardInfo.expiry}
              onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
            />
            <input
              type="text"
              placeholder="CVC"
              maxLength={4}
              className="w-1/2 border px-3 py-2 rounded"
              value={cardInfo.cvc}
              onChange={(e) => setCardInfo({ ...cardInfo, cvc: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* PayPal login form */}
      {selectedMethod === 'paypal' && (
        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="PayPal Email"
            className="w-full border px-3 py-2 rounded"
            value={paypalInfo.email}
            onChange={(e) => setPaypalInfo({ ...paypalInfo, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="PayPal Password"
            className="w-full border px-3 py-2 rounded"
            value={paypalInfo.password}
            onChange={(e) => setPaypalInfo({ ...paypalInfo, password: e.target.value })}
          />
          <p className="text-sm text-gray-500">This is a demo PayPal form. No real login.</p>
        </div>
      )}

      <div className="flex justify-between mt-8 gap-4">
        <button
          onClick={onBack}
          className="w-1/2 border border-gray-300 py-3 rounded text-gray-700 hover:bg-gray-100 font-semibold"
        >
          ← Back
        </button>

        <button
          onClick={handleContinue}
          className="w-1/2 text-black bg-[rgb(var(--yellow))] hover:bg-[rgb(var(--yellow-hover))] py-3 rounded text-lg font-semibold transition-colors duration-200"
        >
          Continue to Review →
        </button>
      </div>
    </div>
  );
}
