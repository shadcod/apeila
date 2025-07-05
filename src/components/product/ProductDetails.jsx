"use client";

import { useState } from "react";

export default function ProductDetails({ product, defaultShowSpecs = false }) {
  const { description, descriptionHTML, features = [], specificationsHTML } = product;
  const [showSpecs, setShowSpecs] = useState(defaultShowSpecs);

  return (
    <div className="bg-white p-6 space-y-8 text-gray-700 max-w-full">
      {/* وصف المنتج */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 pb-2">Product Description</h2>
        {descriptionHTML ? (
          <div
            className="prose max-w-full md:max-w-none"
            dangerouslySetInnerHTML={{ __html: descriptionHTML }}
          />
        ) : (
          <p className="mb-4">{description}</p>
        )}
      </section>

      {/* المميزات */}
      {features.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3 pb-1">Key Features</h2>
          <ul className="list-disc list-inside space-y-1">
            {features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      {/* المواصفات (Accordion) */}
      {specificationsHTML && (
        <section>
          <h2
            className="text-xl font-semibold mb-3 cursor-pointer flex items-center justify-between pb-1 select-none
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            onClick={() => setShowSpecs(!showSpecs)}
            aria-expanded={showSpecs}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowSpecs(!showSpecs);
              }
            }}
          >
            Specifications
            <span className="text-gray-500 select-none text-2xl leading-none">{showSpecs ? "−" : "+"}</span>
          </h2>

          <div
            className={`prose max-w-full md:max-w-none overflow-hidden transition-[max-height] duration-300 ease-in-out
              ${showSpecs ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
            aria-hidden={!showSpecs}
            dangerouslySetInnerHTML={{ __html: specificationsHTML }}
          />
        </section>
      )}
    </div>
  );
}
