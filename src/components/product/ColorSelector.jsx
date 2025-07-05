"use client";

import React from "react";
import Image from "next/image";

export default function ColorSelector({ colors = [], selectedColor, onSelect, onHover }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="text-base font-semibold mb-1 text-gray-700 pl-[10px]">Color:</div>

      {selectedColor?.name && (
        <div className="text-sm font-medium mb-3 pl-[10px] text-gray-900">{selectedColor.name}</div>
      )}

      <div
        role="radiogroup"
        aria-label="Select product color"
        className="flex gap-3 flex-wrap pl-[10px]"
      >
        {colors.map((color, index) => {
          const isSelected = selectedColor?.name === color.name;

          return (
            <button
              key={index}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              aria-label={`Select color ${color.name}`}
              title={color.name}
              className={`border p-0.5 w-[50px] h-[50px] flex items-center justify-center transition-opacity duration-200 rounded
                ${isSelected ? "ring-2 ring-blue-500" : "hover:opacity-80"}
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
              onClick={() => onSelect(color)}
              onMouseEnter={() => onHover?.(color)}
              onMouseLeave={() => onHover?.(null)}
            >
              {color.image || color.img ? (
                <Image
                  src={color.image || color.img}
                  alt={color.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              ) : (
                <div
                  className="w-[40px] h-[40px] border rounded-sm"
                  style={{ backgroundColor: color.code || "#ccc" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
