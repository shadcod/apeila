"use client";
import React from "react";

export default function SizeSelector({ sizes = [], selectedSize, onSelect }) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="mt-6">
      {/* العنوان */}
      <div className="text-base font-semibold mb-1 text-gray-700 pl-[10px]">Size:</div>

      {/* الحجم المختار */}
      {selectedSize && (
        <div className="text-sm text-gray-600 font-medium mb-3 pl-[10px]">
          Selected size: <strong>{selectedSize}</strong>
        </div>
      )}

      {/* أزرار الأحجام */}
      <div className="flex flex-wrap gap-2 pl-[10px] overflow-x-auto whitespace-nowrap">
        {sizes.map((size, index) => (
          <button
            key={index}
            type="button"
            className={`px-4 py-2 text-sm border rounded-md font-medium transition duration-150
              ${
                selectedSize === size
                  ? "bg-yellow-400 text-black ring-2 ring-yellow-500"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }
              focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2
            `}
            onClick={() => onSelect(size)}
            aria-pressed={selectedSize === size}
            aria-label={`Select size ${size}`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
