'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const HomeProducts = () => {
  const [products, setProducts] = useState([]);
  const cart = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart')) || [] : [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
      } catch (err) {
        console.error('خطأ في جلب البيانات من فايرباس:', err);
      }
    };

    fetchProducts();
  }, []);

  const generateProductHTML = (product, isInCart, percentDisc) => (
    <div className="swiper-slide product" key={product.id}>
      {percentDisc !== null && <span className="sale_present">{percentDisc}%</span>}
      <div className="img_product">
        <Link href={`/product/${product.id}`}>
          <Image 
            src={product.img} 
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-auto"
          />
        </Link>
      </div>
      <div className="stars">
        {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
      </div>
      <p className="name_product"><Link href={`/product/${product.id}`}>{product.name}</Link></p>
      <div className="price">
        <p><span>${product.price}</span></p>
        {product.oldPrice && <p className="oldPrice">${product.oldPrice}</p>}
      </div>
      <div className="icons">
        <span className={`btn_add_cart ${isInCart ? 'active' : ''}`} data-id={product.id}>
          <i className="fa-solid fa-cart-plus"></i> {isInCart ? 'Item in cart' : 'add to cart'}
        </span>
        <span className="icon_product">
          <i className="fa-regular fa-heart"></i>
        </span>
      </div>
    </div>
  );

  const filterAndRender = (category = null) => {
    return products
      .filter(product => {
        if (category === 'sale') return product.oldPrice;
        if (category) return product.category === category;
        return true;
      })
      .map(product => {
        const isInCart = cart.some(item => item.id === product.id);
        const percentDisc = product.oldPrice
          ? Math.floor((product.oldPrice - product.price) / product.oldPrice * 100)
          : null;
        return generateProductHTML(product, isInCart, percentDisc);
      });
  };

  return (
    <>
      <div id="swiper_items_sale" className="swiper-wrapper">
        {filterAndRender('sale')}
      </div>
      <div id="swiper_electronics" className="swiper-wrapper">
        {filterAndRender('electronics')}
      </div>
      <div id="swiper_appliances" className="swiper-wrapper">
        {filterAndRender('appliances')}
      </div>
      <div id="swiper_mobiles" className="swiper-wrapper">
        {filterAndRender('mobiles')}
      </div>
    </>
  );
};

export default HomeProducts;
