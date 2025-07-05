import Swiper from 'swiper';

export function initSwipers() {
  new Swiper('.slide-swp', {
    pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true,
      clickable: true,
    },
    autoplay: {
      delay: 2500,
    },
    loop: true,
  });

  new Swiper('.slide_product', {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 2500,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    loop: false,
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      576: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 15,
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });
}
