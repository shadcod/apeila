'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { useAppContext } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const { cartItems, favorites, toggleCart } = useAppContext();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalFavorites = favorites.length;
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const categoryRef = useRef(null);
  const searchRef = useRef(null);

  const categories = [
    "Top 10 Offers",
    "Electronics & Digital",
    "Phones & Tablet",
    "Fashion & Clothings",
    "Telivsion & Monitor",
    "Jewelry & Watches",
    "Toys & Hobbies"
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchKeyword('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) {
          console.error('فشل تحميل المنتجات من Supabase:', error);
          throw error;
        }
        setProducts(data);
      } catch (error) {
        console.error('فشل تحميل المنتجات:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchKeyword.trim() === '') {
      setFilteredProducts([]);
      return;
    }
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredProducts(results.slice(0, 5));
  }, [searchKeyword, products]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchKeyword.trim();
    if (!trimmed) return;
    router.push(`/search?query=${encodeURIComponent(trimmed)}`);
    setSearchKeyword('');
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const toggleCategory = () => setCategoryOpen(prev => !prev);

  const handleProductClick = () => {
    setSearchKeyword('');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <header className="Header">
      <div className="top_header">
        <div className="container flex items-center justify-between">
          <Link href="/" className="logo">
            <Image 
              src="/img/logo.png" 
              alt="Logo"
              width={180}
              height={90}
              priority
              style={{ height: 'auto', width: 'auto' }}
            />
          </Link>

          <form className="search_box flex-1 mx-6 relative" onSubmit={handleSearchSubmit} ref={searchRef}>
            <div className="select_box inline-block mr-2">
              <select
                id="category"
                name="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="All Category">All categories</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search for Apeila"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              autoComplete="off"
              className="border rounded px-3 py-2 w-full"
            />

            {searchKeyword && filteredProducts.length > 0 && (
              <div className="search-results absolute bg-white border rounded shadow-md z-50 mt-1 w-full max-w-md">
                {filteredProducts.map(product => (
                  <Link
                    href={`/product/${product.id}`}
                    key={product.id}
                    className="search-result-item flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleProductClick}
                  >
                    <div className="search-result-img flex-shrink-0 mr-3">
                      <Image
                        src={product.img}
                        alt={product.name}
                        width={50}
                        height={50}
                        style={{ objectFit: 'contain' }}
                        priority
                      />
                    </div>
                    <div className="search-result-info">
                      <h4 className="text-sm font-semibold">{product.name}</h4>
                      <p className="text-sm text-gray-600">${product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>

          <div className="header_icons flex items-center space-x-4">
            <div className="icon relative">
              <Link href="/favorites" aria-label="Favorites" className="relative">
                <i className="fa-regular fa-heart text-xl"></i>
                {totalFavorites > 0 && (
                  <span className="count count_favourite absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-1">
                    {totalFavorites}
                  </span>
                )}
              </Link>
            </div>

            <div
              className="icon relative cursor-pointer"
              onClick={toggleCart}
              role="button"
              tabIndex={0}
              aria-label="Toggle Cart"
            >
              <i className="fa-solid fa-cart-arrow-down text-xl"></i>
              {totalItems > 0 && (
                <span className="count count_item_header absolute top-0 right-0 bg-blue-600 text-white rounded-full text-xs px-1">
                  {totalItems}
                </span>
              )}
            </div>

            {isAuthenticated ? (
              <div className="user-controls flex items-center space-x-4 ml-6">
                <Link href="/dashboard" className="btn text-sm font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn text-sm font-medium bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="login_signup btns flex items-center space-x-4 ml-6">
                <Link href="/login" className="btn text-sm font-medium">
                  Login <i className="fa-solid fa-right-to-bracket ml-1"></i>
                </Link>
                <Link href="/signup" className="btn text-sm font-medium">
                  Sign up <i className="fa-solid fa-user-plus ml-1"></i>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bottom_header bg-gray-100">
        <div className="container flex items-center justify-between">
          <nav className="nav flex items-center space-x-6">
            <span
              className="open_menu cursor-pointer"
              onClick={toggleMenu}
              role="button"
              tabIndex={0}
              aria-label="Toggle Menu"
            >
              <i className="fa-solid fa-bars text-2xl"></i>
            </span>

            <div className="category_nav relative" ref={categoryRef}>
              <div
                onClick={toggleCategory}
                className="category_btn flex items-center cursor-pointer select-none"
                role="button"
                tabIndex={0}
                aria-label="Browse Categories"
              >
                <i className="fa-solid fa-bars mr-2"></i>
                <p className="mr-2">{selectedCategory}</p>
                <i
                  className={`fa-solid fa-angle-down transition-transform ${
                    categoryOpen ? 'rotate-180' : ''
                  }`}
                ></i>
              </div>

              {categoryOpen && (
                <div className="category_nav_list absolute bg-white border rounded shadow-md mt-2 z-40 min-w-[200px]">
                  {categories.map((cat, index) => (
                    <a
                      href="#"
                      key={index}
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCategory(cat);
                        setCategoryOpen(false);
                      }}
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <ul
              className={`nav_links flex space-x-6 ${
                menuOpen ? 'block absolute top-full left-0 w-full bg-white p-4 shadow-lg' : 'hidden md:flex'
              }`}
            >
              <span
                className="close_menu cursor-pointer mb-2"
                onClick={toggleMenu}
                role="button"
                tabIndex={0}
                aria-label="Close Menu"
              >
                <i className="fa-solid fa-circle-xmark text-2xl"></i>
              </span>
              <li className="active">
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/accessories">Accessories</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}