'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // حالة فتح/إغلاق السلة
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  // أدوات تخزين محلية
  const safeSet = (key, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  const safeGet = (key) => {
    if (typeof window !== 'undefined') {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    }
    return null;
  };

  // تحميل المنتجات من JSON
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/data/products.json');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    fetchProducts();
  }, []);

  // تحميل السلة والمفضلة من localStorage
  useEffect(() => {
    const savedCart = safeGet('cart');
    const savedFavorites = safeGet('favorites');
    if (savedCart) setCartItems(savedCart);
    if (savedFavorites) setFavorites(savedFavorites);
  }, []);

  // حفظ تلقائي للسلة والمفضلة
  useEffect(() => safeSet('cart', cartItems), [cartItems]);
  useEffect(() => safeSet('favorites', favorites), [favorites]);

  // إضافة للسلة (مع التحقق من اللون والمقاس)
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedColor?.name === product.selectedColor?.name &&
          item.selectedSize === product.selectedSize
      );

      if (existingItem) {
        return prev.map((item) =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { ...product, quantity }];
    });
  };

  // إزالة من السلة
  const removeFromCart = (product) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === product.id &&
            item.selectedColor?.name === product.selectedColor?.name &&
            item.selectedSize === product.selectedSize
          )
      )
    );
  };

  // تحديث الكمية
  const updateQuantity = (product, newQty) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === product.id &&
        item.selectedColor?.name === product.selectedColor?.name &&
        item.selectedSize === product.selectedSize
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  // تفعيل زيادة كمية محددة حسب id
  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // تفعيل نقصان كمية محددة حسب id
  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // إدارة المفضلة
  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      return exists
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product];
    });
  };

  const isFavorite = (productId) =>
    favorites.some((item) => item.id === productId);

  // حساب السعر الكلي
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <AppContext.Provider
      value={{
        products,
        cartItems,
        favorites,
        isAuthenticated,
        setIsAuthenticated,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleFavorite,
        isFavorite,
        increaseQuantity,
        decreaseQuantity,
        totalPrice,
        isCartOpen,
        toggleCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
