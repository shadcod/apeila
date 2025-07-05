'use client';
import { useAppContext } from '@context/CartContext';

export default function CartWidget() {
  const { totalItems, toggleCart } = useAppContext();

  return (
    <div className="cart_widget" onClick={toggleCart}>
      <i className="fa-solid fa-cart-shopping"></i>
      {totalItems > 0 && <span className="cart_count">{totalItems}</span>}
    </div>
  );
}