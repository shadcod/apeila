"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

export default function SimilarProducts({ currentProduct, allProducts }) {
  if (!currentProduct || !allProducts) return null;

  const similar = allProducts
    .filter(
      (p) => p.category === currentProduct.category && p.id !== currentProduct.id
    )
    .slice(0, 20);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(similar.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  if (similar.length === 0) return null;

  const handleSlideChange = (swiper) => {
    const index = Math.floor(swiper.activeIndex / itemsPerPage) + 1;
    setCurrentPage(index);
  };

  return (
    <section className="mt-12 border-t border-gray-200 pt-6 relative">
      {/* ✅ Page Indicator */}
      <div className="absolute top-0 right-0 text-sm text-gray-500 pr-2 pt-1">
        Page {Math.min(currentPage, totalPages)} of {totalPages}
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Similar Products</h2>

      <Swiper
        spaceBetween={12}
        slidesPerView={5}
        navigation
        onSlideChange={handleSlideChange}
        modules={[Navigation]}
        breakpoints={{
          320: { slidesPerView: 1.2 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="relative"
        aria-label="Similar Products Carousel"
      >
        {similar.map((product) => (
          <SwiperSlide key={product.id}>
            <Link
              href={`/product/${product.id}`}
              aria-label={`View details for ${product.name}`}
              className="block p-2 bg-white hover:shadow-md transition duration-200 h-full border border-gray-100 rounded"
            >
              <div className="w-full h-40 flex items-center justify-center">
                <Image
                  src={product.img}
                  alt={product.name}
                  width={160}
                  height={160}
                  loading="lazy"
                  className="object-contain max-h-36"
                />
              </div>

              <h3 className="text-sm mt-2 text-gray-800 font-medium line-clamp-2 leading-tight">
                {product.name}
              </h3>

              <div className="text-yellow-500 text-sm mt-1">
                ⭐ {product.rating}{" "}
                <span className="text-gray-500">({product.reviewsCount})</span>
              </div>

              <div className="mt-1 text-green-700 font-bold text-sm">${product.price}</div>

              {product.shippingFee && (
                <div className="text-gray-500 text-xs mt-1">
                  + ${product.shippingFee} shipping
                </div>
              )}

              <div className="text-xs text-red-500 mt-1">
                {product.inStockCount > 0
                  ? `Only ${product.inStockCount} left in stock – order soon`
                  : "Out of stock"}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-6 border-b border-gray-200" />
    </section>
  );
}
