'use client';

import { useAppContext } from "@context/AppContext";
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import Link from 'next/link'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'

export default function ProductSlider({ title, category }) {
  const [products, setProducts] = useState([])
  const [swiperInstance, setSwiperInstance] = useState(null)
  const { toggleFavorite, isFavorite, addToCart, cartItems } = useAppContext()

  useEffect(() => {
    fetch('/data/products.json')
      .then(res => res.json())
      .then(data => {
        if (category === 'sale') {
          setProducts(data.filter(item => item.oldPrice))
        } else {
          setProducts(data.filter(item => item.category === category))
        }
      })
      .catch(error => {
        console.error('Error loading products:', error)
      })
  }, [category])

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId)
  }

  return (
    <section className="slide">
      <div className="top_slide">
        <h2><i className="fa-solid fa-star"></i> {title}</h2>
        <div className="btns_slide">
          <button className="btn_swip" onClick={() => swiperInstance?.slidePrev()}>
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <button className="btn_swip" onClick={() => swiperInstance?.slideNext()}>
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </div>
      </div>

      <div className="container">
        <Swiper
          modules={[Navigation, Autoplay]}
          onSwiper={setSwiperInstance}
          autoplay={{ delay: 2500 }}
          spaceBetween={20}
          navigation={false}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            576: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            992: { slidesPerView: 5, spaceBetween: 20 },
            1200: { slidesPerView: 5, spaceBetween: 20 }
          }}
          className="mySwiper"
        >
          {products.map((product, index) => (
            <SwiperSlide key={product.id}>
              <div className="product">
                {product.oldPrice && (
                  <span className="sale_present">
                    {Math.floor(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </span>
                )}
                <div className="img_product" style={{ position: 'relative', width: '100%', height: '160px' }}>
                  <Link href={`/product/${product.id}`}>
                    <Image
                      src={product.img.startsWith('/') ? product.img : `/${product.img}`}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 4}
                    />
                  </Link>
                </div>

                <p className="name_product">
                  <Link href={`/product/${product.id}`}>{product.name}</Link>
                </p>
                <div className="price">
                  <p><span>${product.price}</span></p>
                  {product.oldPrice && (
                    <p className="oldPrice">${product.oldPrice}</p>
                  )}
                </div>

                <div className="icons">
                  <button
                    className={`btn_add_cart ${isInCart(product.id) ? 'active' : ''}`}
                    onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      img: product.img.startsWith('/') ? product.img : `/${product.img}`
                    })}
                    disabled={isInCart(product.id)}
                  >
                    <i className="fa-solid fa-cart-plus"></i>
                    {isInCart(product.id) ? ' Item in cart' : ' Add to cart'}
                  </button>

                  <span
                    className={`icon_product ${isFavorite(product.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(product)}
                  >
                    <i className={isFavorite(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
