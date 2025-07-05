'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Link from 'next/link';
import Image from 'next/image';

export default function MainSlider() {
  return (
    <div className="slider">
      <div className="container">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination]}
          className="slide-swp mySwiper"
        >
          <SwiperSlide>
            <Link href="#">
              <Image
                src="/img/banner_home1.png"
                alt="Banner 1"
                width={1200}
                height={400}
                style={{ width: 'auto', height: 'auto' }}

              />
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link href="#">
              <Image
                src="/img/banner_home2.png"
                alt="Banner 2"
                width={1200}
                height={400}
                style={{ width: 'auto', height: 'auto' }}

              />
            </Link>
          </SwiperSlide>
        </Swiper>

        <div className="banner_2 mt-4">
          <Link href="#">
            <Image
              src="/img/banner_home3.png"
              alt="Banner 1"
              width={900}
              height={400}
              priority
              style={{ width: 'auto', height: 'auto' }}

            />
          </Link>
        </div>
      </div>
    </div>
  );
}
