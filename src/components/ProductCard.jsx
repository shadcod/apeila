'use client';

import { useAppContext } from '@context/AppContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';

export default function ProductCard({ product }) {
  const {
    addToCart,
    removeFromCart,
    toggleFavorite,
    favorites,
    cartItems,
  } = useAppContext();

  const [hasMounted, setHasMounted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || !product) return null;

  // معالجة رابط الصورة
  let imageUrl = product.img || '';
  if (imageUrl.startsWith('//')) {
    imageUrl = 'https:' + imageUrl;
  } else if (!imageUrl.startsWith('http')) {
    imageUrl = '/' + imageUrl.replace(/^\/+/, '');
  }

  const isInCart = cartItems.some(
    (item) =>
      item.id === product.id &&
      item.selectedColor?.name === selectedColor?.name &&
      item.selectedSize === selectedSize
  );

  const isFavorite = favorites.some((f) => f.id === product.id);

  const handleAddToCart = () => {
    if (isInCart) {
      removeFromCart({
        id: product.id,
        selectedColor,
        selectedSize,
      });
      toast("❌ Removed from cart");
    } else {
      addToCart({
        ...product,
        selectedColor,
        selectedSize,
      });
      toast.success("🛒 Added to cart");
    }
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(product);
    toast(isFavorite ? "💔 Removed from favorites" : "💖 Added to favorites");
  };

  const percentDisc =
    product.oldPrice && product.oldPrice > product.price
      ? Math.floor(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  return (
    <div className="product">
      <Toaster position="top-center" />

      {percentDisc > 0 && (
        <span className="sale_present absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full z-10">
          -{percentDisc}%
        </span>
      )}

      <div className="img_product relative aspect-square">
        <Link href={`/product/${product.id}`}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            priority
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 200px"
          />
        </Link>
      </div>

      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <i key={`star-${product.id}-${i}`} className="fa-solid fa-star"></i>
        ))}
      </div>

      <p className="name_product">
        <Link href={`/product/${product.id}`}>{product.name}</Link>
      </p>

      <div className="price">
        <p><span>${product.price}</span></p>
        {product.oldPrice && <p className="oldPrice">${product.oldPrice}</p>}
      </div>

      {product.colors && product.colors.length > 0 && (
        <div className="color_selector flex gap-2 mb-2">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              style={{
                backgroundColor: color.code,
                border: color.name === selectedColor?.name ? '2px solid black' : '1px solid #ccc',
                width: 30,
                height: 30,
                borderRadius: '50%',
                cursor: 'pointer',
              }}
              aria-label={`Select color ${color.name}`}
              title={color.name}
            />
          ))}
        </div>
      )}

      {product.sizes && product.sizes.length > 0 && (
        <select
          value={selectedSize || ''}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="size_selector mb-2 p-1 border rounded"
          aria-label="Select size"
        >
          {product.sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      )}

      <div className="product_actions">
        <div className="icons">
          <span
            className={`btn_add_cart ${isInCart ? 'in_cart' : ''}`}
            onClick={handleAddToCart}
            style={{ cursor: 'pointer' }}
          >
            {isInCart ? (
              <>
                <i className="fa-solid fa-check"></i>
                <span style={{ color: 'white' }}>In Cart</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-cart-shopping"></i>
                <span style={{ color: 'white' }}>Add to Cart</span>
              </>
            )}
          </span>

          <span
            className="btn_add_fav"
            onClick={handleFavoriteToggle}
            style={{ cursor: 'pointer' }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-heart`}></i>
          </span>
        </div>
      </div>
    </div>
  );
}
