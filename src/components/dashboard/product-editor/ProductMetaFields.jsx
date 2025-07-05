'use client';
export default function ProductMetaFields({
  category, setCategory,
  brand, setBrand,
  features, setFeatures,
  sizes, setSizes,
  tags, setTags,
  aiSummary, setAiSummary
}) {
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Brand</label>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Features (one per line)</label>
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          className="w-full border rounded p-2"
          rows={4}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Sizes (comma separated)</label>
        <input
          type="text"
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">AI Generated Summary</label>
        <textarea
          value={aiSummary}
          onChange={(e) => setAiSummary(e.target.value)}
          className="w-full border rounded p-2"
          rows={3}
        />
      </div>
    </>
  );
}
