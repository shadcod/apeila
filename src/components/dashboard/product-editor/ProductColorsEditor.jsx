'use client';

import { useEffect } from 'react';

export default function ProductColorsEditor({ colors, setColors, productSlug = 'default' }) {
  const addColor = () => {
    setColors([...colors, { name: '', code: '#000000', image: '' }]);
  };

  const updateColorField = (index, field, value) => {
    const updated = [...colors];
    updated[index][field] = value;
    setColors(updated);
  };

  const handleFileChange = async (index, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('productSlug', productSlug);

    try {
      const res = await fetch('/api/upload/color-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        updateColorField(index, 'image', data.url);
      } else {
        alert('❌ Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Upload error');
    }
  };

  const removeColor = (index) => {
    const updated = colors.filter((_, i) => i !== index);
    setColors(updated);
  };

  useEffect(() => {
    return () => {
      colors.forEach((color) => {
        if (color.image?.startsWith('blob:')) {
          URL.revokeObjectURL(color.image);
        }
      });
    };
  }, [colors]);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Colors</label>
      <div className="flex flex-wrap gap-4">
        {colors.map((color, idx) => (
          <div key={idx} className="flex flex-col items-center border rounded p-2 w-36">
            {color.image ? (
              <img
                src={color.image}
                alt={color.name || `Color ${idx}`}
                className="w-12 h-12 object-cover rounded mb-1"
              />
            ) : (
              <div
                className="w-12 h-12 rounded mb-1 border"
                style={{ backgroundColor: color.code }}
              />
            )}
            <input
              type="text"
              placeholder="Name"
              value={color.name}
              onChange={(e) => updateColorField(idx, 'name', e.target.value)}
              className="text-xs w-full mb-1 border rounded p-1"
            />
            <input
              type="color"
              value={color.code}
              onChange={(e) => updateColorField(idx, 'code', e.target.value)}
              className="w-full mb-1"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={(color.image || '').startsWith('blob:') ? '' : (color.image || '')}
              onChange={(e) => updateColorField(idx, 'image', e.target.value)}
              className="text-xs w-full mb-1 border rounded p-1"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(idx, e.target.files[0])}
              className="text-xs w-full mb-1"
            />
            <button
              onClick={() => removeColor(idx)}
              className="text-red-500 text-xs"
            >
              ✖
            </button>
          </div>
        ))}
        <button
          onClick={addColor}
          className="px-2 py-1 bg-gray-200 rounded text-sm h-fit"
        >
          + Add Color
        </button>
      </div>
    </div>
  );
}
