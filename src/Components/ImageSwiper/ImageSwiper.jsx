import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import Offer1 from '../../assets/images/Offer_1.png';
import Offer2 from '../../assets/images/Offer_2.png';
import Offer3 from '../../assets/images/Offer_3.png';
import Offer4 from '../../assets/images/Offer_4.png';
import Offer5 from '../../assets/images/Offer_5.png';
import Offer6 from '../../assets/images/Offer_6.png';
import Offer7 from '../../assets/images/Offer_7.png';

const images = [
  Offer1, Offer2, Offer3, Offer4, Offer5, Offer6, Offer7
];

export default function ImageSwiper() {
  return (
    <section className="image-swiper-section py-5">
      <div className="container">
        <div className="swiper-wrapper-box relative">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={15}
            slidesPerView={3}
            slidesPerGroup={1}
            loop={true}
            initialSlide={0}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            }}
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              992: { slidesPerView: 6 },
              1200: { slidesPerView: 6 }
            }}
          >
            {images.map((image, idx) => (
              <SwiperSlide key={idx}>
                <div className="swiper-image-card">
                  <img src={image} alt={`عرض ${idx + 1}`} className="img-fluid rounded-4" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
      </div>
    </section>
  );
}