'use client';

import { useAppContext } from '@context/AppContext';
import Image from 'next/image';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

// دالة لقص العنوان
const truncate = (str, words = 3) =>
  str?.split(' ').slice(0, words).join(' ') + '...';

export default function Cart() {
  const {
    cartItems,
    isCartOpen,
    toggleCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
  } = useAppContext();

  const stopPropagation = (e) => e.stopPropagation();

  const handleRemove = (product) => {
    removeFromCart(product);
    toast.error('❌ Product removed from cart');
  };

  const handleIncrease = (product) => {
    increaseQuantity(product.id);
    toast.success('🔼 Increased quantity');
  };

  const handleDecrease = (product) => {
    if (product.quantity <= 1) {
      toast('⚠️ Minimum quantity is 1', { icon: '⚠️' });
    } else {
      decreaseQuantity(product.id);
      toast.success('🔽 Decreased quantity');
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      {isCartOpen && <div className="cart_overlay" onClick={toggleCart}></div>}

      <div className={`cart ${isCartOpen ? 'active' : ''}`} onClick={stopPropagation}>
        <div className="cart_content">
          {/* Header */}
          <div className="cart_header">
            <h2>
              Shopping Cart
              <span className="cart_header-count">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </h2>
            <button
              className="cart_close-btn"
              onClick={toggleCart}
              aria-label="Close cart"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Items */}
          <div className="cart_items">
            {cartItems.length === 0 ? (
              <p className="cart_empty">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedColor?.name || 'noColor'}-${item.selectedSize || 'noSize'}`}
                  className="cart_item"
                >
                  {(item.image || item.img) && (
                    <Image
                      src={item.image || item.img}
                      alt={item.title || item.name || 'Product image'}
                      width={80}
                      height={80}
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                  )}
                  <div className="cart_item-info">
                    <h4>{truncate(item.title || item.name)}</h4>
                    <p>${Number(item.price).toFixed(2)}</p>
                    <div className="cart_quantity-control">
                      <button
                        onClick={() => handleDecrease(item)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleIncrease(item)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        className="cart_remove-btn"
                        onClick={() => handleRemove(item)}
                        aria-label="Remove item"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="cart_footer">
            <h3>Total: ${Number(totalPrice).toFixed(2)}</h3>
            <hr className="cart_divider" />

            <div className="cart_buttons">
              <Link
                href="/checkout"
                className={`btn_checkout ${cartItems.length === 0 ? 'disabled' : ''}`}
                onClick={() => {
                  toggleCart();
                  if (cartItems.length > 0) toast.success('🧾 Proceeding to checkout');
                }}
              >
                Checkout
              </Link>

              <Link href="/" className="btn_checkout" onClick={toggleCart}>
                Shop More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
