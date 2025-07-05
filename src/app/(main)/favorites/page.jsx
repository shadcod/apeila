'use client';

import { useAppContext } from '@context/AppContext'; // استخدام AppContext بدل useFavorites
import Image from 'next/image';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useAppContext();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow bg-white">
              <Link href={`/product/${product.id}`}>
                <Image
                  src={product.img}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="mx-auto mb-2"
                />
              </Link>
              <h4 className="text-lg font-semibold">{product.name}</h4>
              <p className="text-green-700 font-bold">${product.price}</p>
              <button
                onClick={() => toggleFavorite(product)}
                className="mt-2 text-sm text-red-500 hover:underline"
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
