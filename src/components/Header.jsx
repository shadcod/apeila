'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@context/AppContext'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, signOut } from '@/services/authService'

export default function Header() {
  const { cartItems, favorites, toggleCart, isAuthenticated } = useAppContext()
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const totalFavorites = favorites.length
  const router = useRouter()

  const [menuOpen, setMenuOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Category')
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [user, setUser] = useState(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const categoryRef = useRef(null)
  const searchRef = useRef(null)
  const profileMenuRef = useRef(null)

  const categories = [
    "Top 10 Offers",
    "Electronics & Digital",
    "Phones & Tablet",
    "Fashion & Clothings",
    "Telivsion & Monitor",
    "Jewelry & Watches",
    "Toys & Hobbies"
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchKeyword('')
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*')
        if (error) throw error
        setProducts(data)
      } catch (error) {
        console.error('Failed to load products:', error)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchKeyword.trim() === '') {
      setFilteredProducts([])
      return
    }
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchKeyword.toLowerCase())
    )
    setFilteredProducts(results.slice(0, 5))
  }, [searchKeyword, products])

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      alert(error.message)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const trimmed = searchKeyword.trim()
    if (!trimmed) return
    router.push(`/search?query=${encodeURIComponent(trimmed)}`)
    setSearchKeyword('')
  }

  const toggleMenu = () => setMenuOpen(prev => !prev)
  const toggleCategory = () => setCategoryOpen(prev => !prev)
  const handleProductClick = () => setSearchKeyword('')
  const toggleProfileMenu = () => setProfileMenuOpen(prev => !prev)

  const userName = user?.user_metadata?.name || user?.email
  const profileImage = user?.user_metadata?.avatar_url || '/img/default-avatar.png'

  return (
    <header className="Header">
      <div className="top_header">
        <div className="container">
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

          <form className="search_box" onSubmit={handleSearchSubmit} ref={searchRef}>
            <div className="select_box">
              <select
                id="category"
                name="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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
              placeholder="search for Apeila"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              autoComplete="off"
            />

            {searchKeyword && filteredProducts.length > 0 && (
              <div className="search-results">
                {filteredProducts.map(product => (
                  <Link
                    href={`/product/${product.id}`}
                    key={product.id}
                    className="search-result-item"
                    onClick={handleProductClick}
                  >
                    <div className="search-result-img">
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
                      <h4>{product.name}</h4>
                      <p>${product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>

          <div className="header_icons">
            <div className="icon">
              <Link href="/favorites" aria-label="Favorites">
                <i className="fa-regular fa-heart"></i>
                {totalFavorites > 0 && (
                  <span className="count count_favourite">{totalFavorites}</span>
                )}
              </Link>
            </div>

            <div className="icon" onClick={toggleCart} role="button" tabIndex={0} aria-label="Toggle Cart">
              <i className="fa-solid fa-cart-arrow-down"></i>
              {totalItems > 0 && (
                <span className="count count_item_header">{totalItems}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bottom_header">
        <div className="container">
          <nav className="nav">
            <span className="open_menu" onClick={toggleMenu} role="button" tabIndex={0} aria-label="Toggle Menu">
              <i className="fa-solid fa-bars"></i>
            </span>

            <div className="category_nav" ref={categoryRef}>
              <div onClick={toggleCategory} className="category_btn" role="button" tabIndex={0} aria-label="Browse Categories">
                <i className="fa-solid fa-bars"></i>
                <p>Browse category</p>
                <i className={`fa-solid fa-angle-down ${categoryOpen ? 'rotate' : ''}`}></i>
              </div>

              {categoryOpen && (
                <div className={`category_nav_list ${categoryOpen ? 'active' : ''}`}>
                  {categories.map((cat, index) => (
                    <a href="#" key={index}>{cat}</a>
                  ))}
                </div>
              )}
            </div>

            <ul className={`nav_links ${menuOpen ? 'active' : ''}`}>
              <span className="close_menu" onClick={toggleMenu} role="button" tabIndex={0} aria-label="Close Menu">
                <i className="fa-solid fa-circle-xmark"></i>
              </span>
              <li className="active"><Link href="/">Home</Link></li>
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Accessories</Link></li>
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Contact</Link></li>
            </ul>
          </nav>

          <div className="login_signup btns" ref={profileMenuRef}>
            {isAuthenticated ? (
              <>
                <button
                  onClick={toggleProfileMenu}
                  className="profile-btn"
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen}
                >
                  <Image
                    src={profileImage}
                    alt="User Profile"
                    width={35}
                    height={35}
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                    priority
                  />
                </button>

                {profileMenuOpen && (
                  <ul className="profile-menu">
                    <li className="profile-username">Hello, {userName}</li>
                    <li><Link href="/account">My Account</Link></li>
                    <li><Link href="/orders">Orders</Link></li>
                    <li><Link href="/settings">Settings</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                  </ul>
                )}
              </>
            ) : (
              <>
                <Link href="/login" className="btn">
                  Login <i className="fa-solid fa-right-to-bracket"></i>
                </Link>
                <Link href="/signup" className="btn">
                  Sign up <i className="fa-solid fa-user-plus"></i>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
