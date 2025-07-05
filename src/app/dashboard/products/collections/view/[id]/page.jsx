'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function CollectionDetailsPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const fetchData = async () => {
      const [productsRes, collectionsRes] = await Promise.all([
        fetch('/data/products.json'),
        fetch('/data/collections.json'),
      ]);
      const products = await productsRes.json();
      const collections = await collectionsRes.json();

      const found = collections.find((col) => col.id == id);
      if (found) {
        const linked = products.filter((p) => found.products?.includes(p.id));
        setCollection({ ...found, linkedProducts: linked });
        setAllProducts(products);
      }
    };

    fetchData();
  }, [id]);

  const sortedProducts = () => {
    if (!collection?.linkedProducts) return [];
    const products = [...collection.linkedProducts];

    if (sortBy === 'price') {
      return products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating') {
      return products.sort((a, b) => b.rating - a.rating);
    }
    return products;
  };

  if (!collection) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">{collection.title}</h1>
          <p className="text-sm text-paragraph mt-1">{collection.description}</p>
          <div className="mt-2 text-xs space-x-2">
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold 
              ${collection.status === 'Active' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-200 text-gray-600'}`}>
              {collection.status}
            </span>
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              {collection.collectionType}
            </span>
          </div>
        </div>

        {collection.image ? (
          <Image
            src={collection.image}
            alt="Collection"
            width={80}
            height={80}
            className="rounded-md object-cover border bg-white"
          />
        ) : (
          <div className="w-20 h-20 border rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Sorting */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-heading">Linked Products</h2>
        <select
          className="text-sm border px-3 py-1 rounded-md"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="price">Sort by Price</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-auto border rounded-soft">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-paragraph border-b">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Rating</th>
              <th className="p-3 text-right">Remove</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts().map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <Image
                    src={p.img}
                    alt={p.name}
                    width={40}
                    height={40}
                    className="rounded-md object-contain"
                  />
                </td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">${p.price}</td>
                <td className="p-3">{p.rating} ⭐</td>
                <td className="p-3 text-right">
                  <button
                    className="text-red-600 hover:underline text-sm"
                    title="Remove this product"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {collection.linkedProducts?.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  This collection doesn’t have any linked products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Remove Button */}
      <div className="text-right">
        <button className="mt-4 px-4 py-2 bg-main hover:bg-opacity-90 text-white rounded-soft text-sm shadow-sm transition">
          Add/Remove Products
        </button>
      </div>
    </div>
  );
}
