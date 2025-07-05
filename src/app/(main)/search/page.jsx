'use client';

import { useSearchParams } from 'next/navigation';
import ProductCard from '@components/ProductCard';
import { useEffect, useState } from 'react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Category');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/data/products.json');
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load products:', err);
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const query = searchParams.get('query')?.toLowerCase() || '';
    const category = searchParams.get('category') || 'All Category';

    setSearchQuery(query);
    setCategoryFilter(category);

    if (products.length > 0) {
      let results = products.filter(product =>
        product.name?.toLowerCase().includes(query)
      );

      if (category !== 'All Category') {
        results = results.filter(product => product.category === category);
      }

      setFilteredProducts(results);
    }
  }, [searchParams, products]);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="container">
      <h1 className="search_name">
        Search Results for: "<span className="highlight">{searchQuery}</span>"{' '}
        {categoryFilter !== 'All Category' && (
          <>
            in category: <span className="highlight">{categoryFilter}</span>
          </>
        )}
      </h1>

      {filteredProducts.length > 0 ? (
        <div className="products_grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
