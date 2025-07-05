'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@context/AppContext';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function OrderSummary() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useAppContext();
  const router = useRouter();

  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const shipping = 10;

  useEffect(() => {
    const sub = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(sub);

    const itemsValue = cartItems
      .map((item) => `${item.name} (x${item.quantity})`)
      .join(', ');
    const total = sub * (1 - discount) + shipping;

    if (typeof window !== 'undefined') {
      const itemsInput = document.getElementById('items');
      const priceInput = document.getElementById('total_Price');
      const countInput = document.getElementById('count_Items');

      if (itemsInput) itemsInput.value = itemsValue;
      if (priceInput) priceInput.value = total.toFixed(2);
      if (countInput) countInput.value = cartItems.length;
    }
  }, [cartItems, discount]);

  const handleSubmit = () => {
    toast.success('✅ Order sent successfully!');
    setTimeout(() => router.push('/thank-you'), 1500);
  };

  const totalAfterDiscount = subtotal * (1 - discount) + shipping;

  return (
    <div className="ordersummary border rounded-md shadow-[0_0_10px_#c0bfbf44] p-5 w-full max-w-[500px] bg-white">
      <Toaster position="top-center" />
      <h1 className="text-xl font-bold text-[var(--main_color)] border-b pb-4 mb-4">
        Order Summary
      </h1>

      <div className="items h-[350px] overflow-y-auto">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={`${item.id}-${item.selectedColor?.name || 'noColor'}-${item.selectedSize || 'noSize'}`}
              className="item_cart flex justify-between gap-5 items-center border-b py-4 pr-4 last:border-b-0"
            >
              <div className="image_name flex items-center gap-4">
                <Image
                  src={item.img || item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-[80px] h-auto object-contain border rounded"
                />
                <div>
                  <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
                    {item.name}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">${item.price.toFixed(2)}</p>

                  <div className="quantity_control flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-[27px] h-[27px] border text-lg rounded-sm"
                    >
                      -
                    </button>
                    <span className="text-base bg-[var(--bg_color)] min-w-[40px] flex justify-center items-center py-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="w-[27px] h-[27px] border text-lg rounded-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="delete_item">
                <button
                  onClick={() => {
                    removeFromCart(item);
                    toast.error('❌ Removed from cart');
                  }}
                  className="text-red-600 text-[22px] hover:scale-110 transition"
                  title="Remove"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary bottom */}
      <div className="bottom_summary pt-6 border-t mt-4 space-y-4">
        <div className="shop_table flex justify-between items-center">
          <p className="text-[18px] text-gray-700 capitalize">Subtotal:</p>
          <span className="font-bold text-[18px]">${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="shop_table flex justify-between items-center text-green-700">
            <p className="text-[18px]">Discount:</p>
            <span>- ${(subtotal * discount).toFixed(2)}</span>
          </div>
        )}

        <div className="shop_table flex justify-between items-center">
          <p className="text-[18px] text-gray-700">Shipping:</p>
          <span className="font-bold text-[18px]">${shipping.toFixed(2)}</span>
        </div>

        <div className="shop_table flex justify-between items-center font-bold text-[20px] text-black">
          <p>Total:</p>
          <span>${totalAfterDiscount.toFixed(2)}</span>
        </div>

        <div className="button_div border-t pt-6">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-[rgb(var(--yellow))] hover:bg-[rgb(var(--yellow-hover))] text-black border-2 border-[var(--main_color)] py-3 text-lg font-bold rounded transition duration-300"
           >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
