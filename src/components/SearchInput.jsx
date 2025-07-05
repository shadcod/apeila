'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchInput({ categories, filteredProducts = [] }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [showResults, setShowResults] = useState(false);

  const resultsRef = useRef(null);

  // الاستماع للنقر خارج قائمة النتائج
  useEffect(() => {
    function handleClickOutside(event) {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (trimmed === '') return;

    router.push(
      `/search?query=${encodeURIComponent(trimmed)}&category=${encodeURIComponent(selectedCategory)}`
    );
    setKeyword('');
    setSelectedCategory('All Category');
    setShowResults(false);
  };

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
    setShowResults(true);
  };

  // عند اختيار عنصر من نتائج البحث
  const handleResultClick = (productId) => {
    setShowResults(false);
    router.push(`/product/${productId}`);
  };

  return (
    <form className="search_box" onSubmit={handleSearch} autoComplete="off">
      <div className="select_box">
        <select
          id="category"
          name="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Select product category"
        >
          <option value="All Category">All categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        id="search"
        name="search"
        placeholder="Search for products"
        value={keyword}
        onChange={handleInputChange}
        aria-label="Search products"
      />

      <button type="submit" aria-label="Search">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>

      {showResults && keyword.trim() !== '' && filteredProducts.length > 0 && (
        <div className="search-results" ref={resultsRef}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="search-result-item"
              onClick={() => handleResultClick(product.id)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={product.img}
                alt={product.name}
                width={50}
                height={50}
                style={{ objectFit: 'contain' }}
              />
              <div className="search-result-info">
                <h4>{product.name}</h4>
                <p>${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
