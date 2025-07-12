"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function ZoomModal({ onClose, children }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // منع تمرير الصفحة عند فتح المودال
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // إغلاق المودال بالمفتاح ESC وحصر التركيز داخل المودال
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();

      if (e.key === "Tab") {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // التركيز على زر الإغلاق عند تحميل المودال
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // إعادة تعيين حالة التحميل عند تغيير المحتوى
  useEffect(() => {
    setIsLoaded(false);
  }, [children]);

  if (typeof document === "undefined") return null; // تأمين SSR

  return createPortal(
    <div
      className="zoom-modal fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      ref={modalRef}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* زر الإغلاق */}
        <button
          ref={closeButtonRef}
          className="absolute top-0 right-0 m-2 text-white text-2xl font-bold z-10 hover:text-red-400"
          onClick={onClose}
          aria-label="Close Zoom"
        >
          ✕
        </button>

        {/* سبينر تحميل */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* محتوى المودال */}
        <div className="media-container rounded overflow-hidden max-w-full max-h-full">
          {React.isValidElement(children)
            ? React.cloneElement(children, {
                onLoad: () => setIsLoaded(true),
                onLoadedData: () => setIsLoaded(true),
              })
            : children}
        </div>
      </div>
    </div>,
    document.body
  );
}
