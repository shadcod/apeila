'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditCollectionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/data/collections.json');
        const data = await res.json();
        const found = data.find(col => col.id.toString() === id);
        if (found) {
          setCollection(found);
          setImage(found.image || null);
        } else {
          alert('Collection not found.');
          router.push('/dashboard/products/collections');
        }
      } catch (error) {
        console.error('Error loading collection:', error);
        alert('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSave = () => {
    // إرسال البيانات للـ API لاحقًا
    console.log('Updated collection:', { ...collection, image });
    alert('✅ Changes saved (Mock)');
  };

  if (loading) return <div className="p-6 text-paragraph">Loading...</div>;
  if (!collection) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
      <h1 className="text-2xl font-bold text-heading">Edit Collection</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* القسم الأيسر */}
        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-sm mb-1">Title</label>
            <input
              value={collection.title}
              onChange={e => setCollection({ ...collection, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-soft text-sm"
              placeholder="Collection title"
            />
          </div>

          <div>
            <label className="block font-semibold text-sm mb-1">Description</label>
            <textarea
              value={collection.description}
              onChange={e => setCollection({ ...collection, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-soft text-sm"
              rows={4}
              placeholder="Write a description..."
            />
          </div>

          <div>
            <label className="block font-semibold text-sm mb-1">Collection Type</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={collection.collectionType === 'manual'}
                  onChange={() => setCollection({ ...collection, collectionType: 'manual' })}
                />
                Manual
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={collection.collectionType === 'automated'}
                  onChange={() => setCollection({ ...collection, collectionType: 'automated' })}
                />
                Automated
              </label>
            </div>
          </div>
        </div>

        {/* القسم الأيمن */}
        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-sm mb-1">Publishing</label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={collection.status === 'Active'}
                onChange={() =>
                  setCollection({
                    ...collection,
                    status: collection.status === 'Active' ? 'Draft' : 'Active',
                  })
                }
              />
              Online Store
            </label>
          </div>

          <div>
            <label className="block font-semibold text-sm mb-1">Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && (
              <img
                src={image}
                alt="Preview"
                className="mt-2 h-32 w-32 border rounded-soft object-cover bg-white"
              />
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 text-right">
        <button
          onClick={handleSave}
          className="bg-main hover:bg-opacity-90 text-white px-5 py-2 rounded-soft text-sm font-medium shadow-sm transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}
