
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default function CollectionDetailsPage() {
  const { id } = useParams()
  const [collectionData, setCollectionData] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب بيانات المجموعة المحددة
        const { data: collectionInfo, error: collectionError } = await supabase
          .from('collections')
          .select('*')
          .eq('id', id)
          .single()

        if (collectionError || !collectionInfo) {
          console.error('Error fetching collection:', collectionError)
          setCollectionData(null)
          return
        }

        // جلب كل المنتجات
        const { data: productsList, error: productsError } = await supabase
          .from('products')
          .select('*')

        if (productsError) {
          console.error('Error fetching products:', productsError)
          setAllProducts([])
          return
        }

        // ربط المنتجات اللي موجودة في هذه المجموعة
        const linked = productsList.filter((p) => collectionInfo.products?.includes(p.id))

        setCollectionData({ ...collectionInfo, linkedProducts: linked })
        setAllProducts(productsList)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const sortedProducts = () => {
    if (!collectionData?.linkedProducts) return []
    const products = [...collectionData.linkedProducts]

    if (sortBy === 'price') {
      return products.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'rating') {
      return products.sort((a, b) => b.rating - a.rating)
    }
    return products
  }

  if (!collectionData) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">{collectionData.title}</h1>
          <p className="text-sm text-paragraph mt-1">{collectionData.description}</p>
          <div className="mt-2 text-xs space-x-2">
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold 
              ${collectionData.status === 'Active' 
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-200 text-gray-600'}`}>
              {collectionData.status}
            </span>
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              {collectionData.collectionType}
            </span>
          </div>
        </div>

        {collectionData.image ? (
          <Image
            src={collectionData.image}
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
            {collectionData.linkedProducts?.length === 0 && (
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
  )
}


