'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { user, loading, isAuthenticated } = useAuth();

  // فقط شغّل مرة واحدة لجلب بيانات المستخدم أو إعدادات خاصة إذا لازم
  // إذا تريد تحميل بيانات إضافية للمستخدم يمكن فعلها هنا

  const toggleCart = () => setIsCartOpen(prev => !prev);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const savedCart = safeGet('cart');
    const savedFavorites = safeGet('favorites');
    if (savedCart) setCartItems(savedCart);
    if (savedFavorites) setFavorites(savedFavorites);
  }, []);

  useEffect(() => safeSet('cart', cartItems), [cartItems]);
  useEffect(() => safeSet('favorites', favorites), [favorites]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(
        item =>
          item.id === product.id &&
          item.selectedColor?.name === product.selectedColor?.name &&
          item.selectedSize === product.selectedSize
      );

      if (existingItem) {
        return prev.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (product) => {
    setCartItems(prev =>
      prev.filter(
        item =>
          !(
            item.id === product.id &&
            item.selectedColor?.name === product.selectedColor?.name &&
            item.selectedSize === product.selectedSize
          )
      )
    );
  };

  const updateQuantity = (product, newQty) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === product.id &&
        item.selectedColor?.name === product.selectedColor?.name &&
        item.selectedSize === product.selectedSize
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const increaseQuantity = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const toggleFavorite = (product) => {
    setFavorites(prev => {
      const exists = prev.some(item => item.id === product.id);
      return exists
        ? prev.filter(item => item.id !== product.id)
        : [...prev, product];
    });
  };

  const isFavorite = (productId) =>
    favorites.some(item => item.id === productId);

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
        user,
        loading,
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