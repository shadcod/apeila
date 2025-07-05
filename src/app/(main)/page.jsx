'use client';

import Banners from '@components/Banners';
import ProductSlider from '@components/ProductSlider';
import MainSlider from '@components/MainSlider';

export default function Home() {
  return (
    <main>
      <MainSlider />
      
      <Banners type="shopNow" />
      
      <ProductSlider 
        title="Hot Deals" 
        id="swiper_items_sale" 
        category="sale"
      />
      
      <Banners type="twoImages" />
      
      <ProductSlider 
        title="Electronics" 
        id="swiper_electronics" 
        category="electronics"
      />
      
      <ProductSlider 
        title="Appliances" 
        id="swiper_appliances" 
        category="appliances"
      />
      
      <Banners type="threeImages" />
      
      <ProductSlider 
        title="Mobiles" 
        id="swiper_mobiles" 
        category="mobiles"
      />
    </main>
  );
}
