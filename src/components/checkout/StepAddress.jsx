'use client';

import { useEffect, useState } from 'react';

export default function StepAddress({ onNext }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  // استرجاع البيانات من localStorage عند التحميل
  useEffect(() => {
    const saved = localStorage.getItem('checkout-address');
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  // حفظ البيانات عند أي تغيير
  useEffect(() => {
    localStorage.setItem('checkout-address', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    const { fullName, email, phone, address } = formData;
    if (!fullName || !email || !phone || !address) {
      alert('Please fill in all fields.');
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-black">🏠 Delivery Address</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Full Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            rows={3}
          />
        </div>

        <button
          onClick={handleContinue}
          className="w-full text-black bg-[rgb(var(--yellow))] hover:bg-[rgb(var(--yellow-hover))] py-3 rounded text-lg font-semibold transition-colors duration-200"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
