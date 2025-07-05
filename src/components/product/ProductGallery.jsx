"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export default function ProductGallery({
  product,
  selectedIndex,
  setSelectedIndex,
  mode = "main",
}) {
  const galleryImages = product.gallery?.length > 0 ? product.gallery : [product.img];
  const mainImage = galleryImages[selectedIndex] || product.img;

  const zoomRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [bgPosition, setBgPosition] = useState("center");

  // للتعامل مع تحريك الماوس داخل صورة الزوم
  const handleMouseMove = (e) => {
    if (!zoomRef.current) return;
    const { left, top, width, height } = zoomRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBgPosition(`${x}% ${y}%`);
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setBgPosition("center");
  };

  // دعم التنقل بالكيبورد في thumbnails
  const handleThumbnailKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedIndex(index);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % galleryImages.length;
      setSelectedIndex(nextIndex);
      document.getElementById(`thumb-${nextIndex}`)?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + galleryImages.length) % galleryImages.length;
      setSelectedIndex(prevIndex);
      document.getElementById(`thumb-${prevIndex}`)?.focus();
    }
  };

  if (mode === "thumbnails") {
    return (
      <div
        className="overflow-y-auto overflow-x-hidden max-h-[270px] w-[60px] pr-1 pl-[2px] pt-[10px]"
        style={{ direction: "rtl" }}
      >
        <div className="flex flex-col gap-2" style={{ direction: "ltr" }}>
          {galleryImages.map((src, index) => {
            const isVideo = src.endsWith(".mp4") || src.endsWith(".webm");
            const isSelected = selectedIndex === index;

            return (
              <button
                id={`thumb-${index}`}
                key={index}
                type="button"
                tabIndex={0}
                className={`w-[40px] h-[40px] p-[2.5px] rounded overflow-hidden border bg-white
                  ${isSelected ? "ring-2 ring-yellow-500" : "hover:opacity-80"}
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-1`}
                onClick={() => setSelectedIndex(index)}
                onMouseEnter={() => setSelectedIndex(index)}
                aria-label={`Select media ${index + 1}`}
                onKeyDown={(e) => handleThumbnailKeyDown(e, index)}
              >
                {isVideo ? (
                  <video
                    src={src}
                    muted
                    loop
                    className="w-[35px] h-[35px] object-contain rounded"
                  />
                ) : (
                  <Image
                    src={src}
                    alt={`Thumbnail ${index + 1}`}
                    width={35}
                    height={35}
                    loading="lazy"
                    className="w-[35px] h-[35px] object-contain rounded"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // الوضع الرئيسي مع الزوم التفاعلي
  return (
    <div
      ref={zoomRef}
      className="w-[400px] h-[344px] overflow-hidden rounded relative cursor-zoom-in"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label={`Product image ${selectedIndex + 1}`}
      tabIndex={0}
      style={{ perspective: 1000 }}
    >
      <div
        className="w-full h-full bg-no-repeat bg-contain transition-all duration-150 ease-out"
        style={{
          backgroundImage: `url(${mainImage})`,
          backgroundSize: isHovering ? "200%" : "contain",
          backgroundPosition: bgPosition,
          transitionProperty: "background-position, background-size",
        }}
      />
    </div>
  );
}
