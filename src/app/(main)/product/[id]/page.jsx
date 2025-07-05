"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { useAppContext } from "@context/AppContext";

import ProductGallery from "@components/product/ProductGallery";
import ProductDetails from "@components/product/ProductDetails";
import ProductSidebar from "@components/product/ProductSidebar";
import SimilarProducts from "@components/product/SimilarProducts";
import RelatedProducts from "@components/product/RelatedProducts";
import ZoomModal from "@components/product/ZoomModal";
import ColorSelector from "@components/product/ColorSelector";
import SizeSelector from "@components/product/SizeSelector";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <svg
        className="animate-spin h-10 w-10 text-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { products, addToCart } = useAppContext();

  const [product, setProduct] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [hoverColor, setHoverColor] = useState(null);

  // بحث وتحميل المنتج عند تغير الـ id أو products
  useEffect(() => {
    if (products.length > 0) {
      const current = products.find((p) => p.id === parseInt(id, 10));
      if (current) {
        setProduct(current);
        setSelectedColor(current.colors?.[0] || null);
        setSelectedSize(current.sizes?.[0] || null);
        setSelectedIndex(0);
      } else {
        setProduct(null);
      }
    }
  }, [id, products]);

  // تحديث selectedIndex بناء على اللون المختار أو hover (تأخير لتجنب التغيير السريع)
  useEffect(() => {
    if (!product) return;

    const galleryImages = product.gallery?.length > 0 ? product.gallery : [product.img];
    // اللون الذي نستخدمه: hoverColor له أولوية على selectedColor
    const activeColor = hoverColor || selectedColor;

    if (activeColor?.image) {
      const idx = galleryImages.findIndex((img) => img === activeColor.image);
      if (idx !== -1) {
        setSelectedIndex(idx);
      }
    }
  }, [selectedColor, hoverColor, product]);

  // حساب خصم السعر بذاكرة ميمو لتحسين الأداء
  const discount = useMemo(() => {
    if (product?.oldPrice && product?.price) {
      return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    }
    return 0;
  }, [product]);

  // دالة لإنشاء تقييم النجوم بدقة مع دعم النجوم النصفية
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<span key={i} className="text-yellow-500">★</span>);
      } else if (rating >= i - 0.5) {
        stars.push(<span key={i} className="text-yellow-500">⯨</span>); // نجمة نصفية (يمكن تعديلها بأيقونة أفضل)
      } else {
        stars.push(<span key={i} className="text-gray-300">☆</span>);
      }
    }
    return stars;
  };

  if (!product) return <LoadingSpinner />;

  const galleryImages = product.gallery?.length > 0 ? product.gallery : [product.img];

  return (
    <div className="w-full px-5 py-6 bg-white overflow-x-hidden max-w-[1300px] mx-auto">
      <div
        className="grid grid-cols-[80px_1px_minmax(300px,1fr)_10px_minmax(320px,1fr)_10px_minmax(280px,1fr)] gap-0 items-start"
      >
        {/* الصور المصغرة */}
        <aside className="pt-6 sticky top-24 h-[600px] overflow-y-auto">
          <ProductGallery
            product={product}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            mode="thumbnails"
          />
        </aside>

        {/* فاصل 1px */}
        <div className="bg-gray-300 w-px" />

        {/* الصورة الرئيسية */}
        <section className="relative product-main-image w-full h-[600px] flex justify-center items-center">
          <ProductGallery
            product={product}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            openZoom={() => setIsZoomOpen(true)}
            mode="main"
          />
        </section>

        {/* فاصل 10px */}
        <div style={{ width: "10px" }} />

        {/* تفاصيل المنتج */}
        <article className="product-details space-y-4 pl-4 pr-2">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

          {/* التقييم */}
          <div className="product-rating flex items-center gap-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-gray-600">({product.reviewsCount} reviews)</span>
          </div>

          <hr className="my-2 border-gray-300" />

          {/* السعر والخصم */}
          <div className="product-price flex items-center gap-2 text-xl font-semibold text-green-700">
            <span>${product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <>
                <span className="line-through text-gray-400 text-lg">${product.oldPrice.toFixed(2)}</span>
                <span className="text-red-500 text-lg">-{discount}%</span>
              </>
            )}
          </div>

          {/* اختيار اللون */}
          <ColorSelector
            colors={product.colors}
            selectedColor={selectedColor}
            onSelect={setSelectedColor}
            onHover={(color) => {
              // تأخير بسيط لتجنب تغيير سريع عند المرور السريع
              if (color) setHoverColor(color);
              else setHoverColor(null);
            }}
          />

          {/* اختيار الحجم */}
          {product.sizes?.length > 0 && (
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />
          )}

          {/* AI Summary */}
          {product.aiGeneratedSummary && (
            <details className="product-ai-summary bg-yellow-50 p-3 rounded mt-4 text-sm text-yellow-900 border border-yellow-300">
              <summary className="cursor-pointer flex items-center gap-2 font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m14.43 4.24l-.71-.71M6.34 6.34l-.71-.71m12.02 12.02l-.71-.71M6.34 17.66l-.71-.71"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                AI Summary
              </summary>
              <p className="mt-2">{product.aiGeneratedSummary}</p>
            </details>
          )}

          {/* تفاصيل أخرى */}
          <ProductDetails
            product={{
              ...product,
              colors: product.colors.map((c) => ({ ...c, img: c.image })),
            }}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        </article>

        {/* فاصل 10px */}
        <div style={{ width: "10px" }} />

        {/* صندوق الشراء */}
        <aside className="product-purchase-box sticky top-24">
          <ProductSidebar
            product={product}
            addToCart={addToCart}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
          />
        </aside>
      </div>

      {/* المنتجات المشابهة */}
      <section className="product-similar-products mt-10">
        <SimilarProducts currentProduct={product} allProducts={products} />
      </section>

      {/* المنتجات ذات الصلة */}
      <section className="product-related-products mt-6">
        <RelatedProducts currentProduct={product} allProducts={products} />
      </section>

      {/* Zoom Modal */}
      {isZoomOpen && (
        <ZoomModal onClose={() => setIsZoomOpen(false)}>
          {galleryImages[selectedIndex]?.endsWith(".mp4") ? (
            <video
              src={galleryImages[selectedIndex]}
              controls
              autoPlay
              muted
              loop
              className="max-w-[90vw] max-h-[90vh] object-contain rounded"
            />
          ) : (
            <Image
              src={galleryImages[selectedIndex]}
              alt={`Zoomed view of ${product.name}`}
              width={900}
              height={900}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded"
              priority
            />
          )}
        </ZoomModal>
      )}
    </div>
  );
}
