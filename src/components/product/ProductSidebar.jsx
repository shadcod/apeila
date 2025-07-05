"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@context/AppContext";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProductSidebar({ product, addToCart, selectedColor, selectedSize }) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [countdown, setCountdown] = useState(600);
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useAppContext();

  const {
    price,
    oldPrice,
    inStockCount,
    shippingFee,
    deliveryDate,
    soldBy,
    bestSeller,
    limitedStock,
  } = product;

  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const inStock = inStockCount > 0;

  // تفعيل الزر فقط إذا متوفر المنتج وتم اختيار اللون والحجم (إن وجدا)
  const canAddToCart =
    inStock &&
    (!product.colors?.length || selectedColor) &&
    (!product.sizes?.length || selectedSize);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAdd = () => {
    if (product.colors?.length && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    if (product.sizes?.length && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    setLoading(true);
    const selectedVariant = {
      ...product,
      selectedColor,
      selectedSize,
      quantity: qty,
    };

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const alreadyExists = cart.some(
      (item) =>
        item.id === product.id &&
        item.selectedColor?.name === selectedColor?.name &&
        item.selectedSize === selectedSize
    );
    if (alreadyExists) {
      toast("⚠️ Product already in cart!");
      setLoading(false);
      return;
    }

    addToCart(selectedVariant, qty);
    toast.success("🛒 Added to cart!");
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
      setLoading(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    handleAdd();
    router.push("/checkout");
  };

  const handleAddToList = () => {
    toast.success("💖 Added to your wishlist!");
  };

  return (
    <div className="bg-white shadow rounded-xl p-5 space-y-4 sticky top-24 h-fit min-w-[280px] max-w-full border border-gray-200">
      <Toaster position="top-center" />

      {/* شارات المنتج */}
      <div className="flex flex-wrap gap-2 text-xs font-semibold text-white">
        {bestSeller && (
          <span className="bg-red-500 px-2 py-1 rounded">🔥 Best Seller</span>
        )}
        {limitedStock && (
          <span className="bg-orange-500 px-2 py-1 rounded">⏳ Limited Stock</span>
        )}
        {countdown > 0 && (
          <span className="bg-yellow-500 text-black px-2 py-1 rounded">
            ⌛ Deal ends in {formatTime(countdown)}
          </span>
        )}
      </div>

      {/* حالة التوفر */}
      <div className={`text-sm font-semibold ${inStock ? "text-green-600" : "text-red-500"}`}>
        {inStock ? "✅ In Stock" : "❌ Out of Stock"}
      </div>

      {/* السعر */}
      <div className="flex items-center gap-2 text-xl font-bold text-green-700">
        <span>${price}</span>
        {oldPrice && (
          <>
            <span className="line-through text-gray-400 text-base">${oldPrice}</span>
            <span className="text-red-500 text-base">-{discount}%</span>
          </>
        )}
      </div>

      {/* الخصائص المختارة */}
      {selectedColor?.name && (
        <div className="text-sm text-gray-600">Color: <strong>{selectedColor.name}</strong></div>
      )}
      {selectedSize && (
        <div className="text-sm text-gray-600">Size: <strong>{selectedSize}</strong></div>
      )}

      {/* الشحن */}
      {price > 50 && (
        <p className="text-green-600 text-sm">🎉 Eligible for FREE Shipping</p>
      )}

      {/* الكمية */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Quantity:</span>
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value))}
        >
          {[...Array(Math.min(10, inStockCount)).keys()].map((q) => (
            <option key={q + 1} value={q + 1}>{q + 1}</option>
          ))}
        </select>
      </div>

      {/* الأزرار */}
      <div className="flex flex-col gap-2" role="group" aria-label="Purchase Options">
        <button
          onClick={handleAdd}
          disabled={!canAddToCart || loading}
          className={`${
            added
              ? "bg-green-600 text-white"
              : "bg-[#fcd515] hover:bg-[#ffce12] text-black"
          } py-2 px-4 rounded-full w-full font-semibold transition-colors duration-200 disabled:opacity-50`}
          aria-label="Add to cart"
        >
          {loading
            ? "Adding..."
            : added
            ? "✅ Added to Cart"
            : "Add to Cart"}
        </button>

        <button
          onClick={handleBuyNow}
          className="bg-[#fcd515] hover:bg-[#ffce12] text-black py-2 px-4 rounded-full w-full font-semibold"
          aria-label="Buy now"
        >
          Shop Now
        </button>

        <button
          onClick={() => {
            toggleFavorite(product);
            const message = isFavorite(product.id)
              ? "❌ Removed from wishlist"
              : "💖 Added to wishlist!";
            toast(message);
          }}
          className={`${
            isFavorite(product.id)
              ? "bg-pink-100 hover:bg-pink-200 text-pink-800 border border-pink-400"
              : "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-400"
          } font-medium py-2 px-4 rounded-full w-full`}
          aria-label="Toggle favorite"
        >
          {isFavorite(product.id) ? "💔 Remove from List" : "Add to List"}
        </button>
      </div>

      {/* معلومات إضافية */}
      <hr className="my-2 border-gray-200" />
      <div className="text-sm text-gray-700 space-y-1">
        <p>🚚 Shipping: ${shippingFee}</p>
        <p>📦 Delivery: {deliveryDate}</p>
        <p>🏢 Sold by: {soldBy}</p>
        <p>🛡️ Warranty: 1 year included</p>
        <p>🔁 Return: Free return within 30 days</p>
      </div>

      {/* مميزات البائع */}
      <ul className="text-sm text-gray-600 list-disc list-inside mt-2">
        <li>🔒 Secure Payment</li>
        <li>🚚 Fast & Free Shipping</li>
        <li>🎁 Gift options available</li>
      </ul>
    </div>
  );
}
