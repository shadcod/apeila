'use client';

import { useState } from 'react';

export default function CreateCollectionPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [collectionType, setCollectionType] = useState('manual');
  const [publishToStore, setPublishToStore] = useState(false);
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCollection = {
      id: Date.now(),
      title,
      description,
      collectionType,
      status: publishToStore ? 'Active' : 'Draft',
      image,
      productsCount: 0,
      products: [],
    };

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCollection),
      });

      if (res.ok) {
        alert('✅ Collection created successfully!');
        window.location.href = '/dashboard/products/collections';
      } else {
        const data = await res.json();
        alert('❌ Failed: ' + data.error);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('❌ Network error.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans text-paragraph">
      <h1 className="text-2xl font-heading font-bold text-heading">Create Collection</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-heading">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md text-sm bg-white"
            placeholder="e.g., Tax-exempt products"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-heading">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 border border-border rounded-md text-sm bg-white"
            placeholder="Optional description for this collection..."
          />
        </div>

        {/* Collection Type */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-heading">Collection Type</label>
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                value="manual"
                checked={collectionType === 'manual'}
                onChange={(e) => setCollectionType(e.target.value)}
              />
              Manual – Add products one by one.
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                value="automated"
                checked={collectionType === 'automated'}
                onChange={(e) => setCollectionType(e.target.value)}
              />
              Automated – Add products based on conditions.
            </label>
          </div>
        </div>

        {/* Publishing */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-heading">Publishing</label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={publishToStore}
              onChange={() => setPublishToStore(!publishToStore)}
            />
            Online Store
          </label>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-heading">Image</label>
          <div className="border border-dashed border-border rounded-md p-4 text-sm text-center bg-gray-50">
            {image ? (
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={image}
                  alt="Collection"
                  className="w-32 h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="block cursor-pointer text-blue-600 hover:underline">
                Add image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 text-sm font-semibold text-white rounded-soft shadow-sm transition duration-200"
            style={{
              backgroundColor: 'rgb(var(--main_color))',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgb(var(--yellow-hover))')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgb(var(--main_color))')}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
