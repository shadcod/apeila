'use client';

import { useState } from 'react';

export default function ProductSEOEditor({
  title,
  features,
  brand,
  category,
  slug,
  seoMeta,
  setSeoMeta,
  isSlugDuplicate,
  handleGenerateSEO,
  handleCopyLink,
  handleSlugChange,
  copySuccess,
}) {
  return (
    <div className="mb-4 border rounded p-3 bg-white shadow">
      <h3 className="font-semibold mb-2">SEO Meta</h3>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">SEO Title</label>
        <input
          type="text"
          value={seoMeta.title}
          onChange={(e) => setSeoMeta({ ...seoMeta, title: e.target.value })}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">SEO Description</label>
        <textarea
          value={seoMeta.description}
          onChange={(e) => setSeoMeta({ ...seoMeta, description: e.target.value })}
          className="w-full border rounded p-2"
          rows={2}
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">SEO Keywords (comma separated)</label>
        <input
          type="text"
          value={seoMeta.keywords.join(', ')}
          onChange={(e) =>
            setSeoMeta({ ...seoMeta, keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) })
          }
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Slug (URL)</label>
        <input
          type="text"
          value={slug}
          onChange={handleSlugChange}
          className={`w-full border rounded p-2 ${isSlugDuplicate ? 'border-red-500' : ''}`}
        />
        {isSlugDuplicate && (
          <p className="text-red-500 text-sm mt-1">⚠️ This slug is already taken. Please choose another one.</p>
        )}
        <p className="text-xs text-gray-500 mt-1">This will be used in the product URL.</p>
      </div>

      <button
        onClick={handleGenerateSEO}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Generate SEO & Slug
      </button>

      <div className="mt-4 border-t pt-2">
        <p className="text-gray-500 text-sm">Google Preview:</p>
        <p className="text-blue-700 underline">{seoMeta.title || 'Product Title Example'}</p>
        <p className="text-green-600 flex items-center gap-2">
          https://apeila.com/product/{slug || 'product-slug'}
          <button
            onClick={handleCopyLink}
            className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs hover:bg-gray-300"
          >
            Copy
          </button>
        </p>
        {copySuccess && <p className="text-green-500 text-sm">{copySuccess}</p>}
        <p className="text-gray-700">{seoMeta.description || 'Product description preview goes here.'}</p>
      </div>
    </div>
  );
}
