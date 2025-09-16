import React, { useState, useEffect, useMemo, memo, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Always use local static images (no API)
const USE_MOCK = true;

// Build static list from local images dynamically (no API)
const buildLocalSalons = () => {
  const images = import.meta.glob('/src/assets/images/*.{png,jpg,jpeg}', { eager: true, as: 'url' });
  const preferredFiles = [
    'الاسنان.png',
    'الجراحه التجميليه.png',
    'الجلديه.png',
    'النساء والولاده.png',
    'طب عام.png',
    'جراحه.png',
    'عنايه بالبشره.png',
    'ليزر شعر.png',
  ];

  // Pick preferred images in the specified order if they exist
  const preferred = preferredFiles
    .map((file) => Object.entries(images).find(([path]) => path.endsWith(`/assets/images/${file}`)))
    .filter(Boolean)
    .map(([, url], idx) => ({
      id: idx + 1,
      salon_name: preferredFiles[idx].replace(/\.[^.]+$/, '').trim(),
      owner_name: '',
      owner_photo: url,
    }));

  if (preferred.length > 0) return preferred;

  // Fallback: previous behavior (exclude non-relevant assets)
  const excludedPatterns = [/hero/i, /logo/i, /register/i, /offer/i, /card\d*/i, /sbc/i, /vat/i];
  const entries = Object.entries(images)
    .filter(([path]) => !excludedPatterns.some((re) => re.test(path)));

  return entries.map(([path, url], index) => {
    const fileName = path.split('/').pop() || '';
    const nameRaw = fileName.replace(/\.[^.]+$/, '');
    const salonName = nameRaw
      .replace(/[_-]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
    return {
      id: index + 1,
      salon_name: salonName,
      owner_name: '',
      owner_photo: url,
    };
  });
};

// Pure Swiper Component
const PartnersSwiperSlides = memo(({ salons }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const slides = useMemo(() => {
    return salons.map((salon) => (
      <SwiperSlide key={salon.id}>
        <div className="partner-slide-card">
          <div className="partner-logo">
            <img
              src={salon.owner_photo || 'https://placehold.co/600x400/cccccc/ffffff/png?text=Clinic+Image+Placeholder'}
              alt={salon.salon_name}
              className="img-fluid"
              loading="lazy"
              onError={(e) => {
                const placeholder = 'https://placehold.co/600x400/cccccc/ffffff/png?text=Clinic+Image+Placeholder';
                if (e && e.target && e.target.src !== placeholder) {
                  e.target.src = placeholder;
                }
              }}
            />
          </div>
          <div className="partner-name">
            <p className="mb-0 main-color">{salon.salon_name}</p>
            {salon.owner_name ? (
              <small className="text-muted">د. {salon.owner_name}</small>
            ) : null}
          </div>
        </div>
      </SwiperSlide>
    ));
  }, [salons]);

  return (
    <>
    <Swiper
      modules={[Autoplay, Navigation]}
      spaceBetween={30}
      slidesPerView={2}
      loop={true}
      autoplay={{ delay: 3000, disableOnInteraction: false, reverseDirection: false }}
      navigation={true}
      onBeforeInit={(swiper) => {
        // eslint-disable-next-line no-param-reassign
        swiper.params.navigation.prevEl = prevRef.current;
        // eslint-disable-next-line no-param-reassign
        swiper.params.navigation.nextEl = nextRef.current;
      }}
      onSwiper={(swiper) => {
        swiper.navigation.init();
        swiper.navigation.update();
      }}
      breakpoints={{
        640: { slidesPerView: 3, spaceBetween: 20 },
        768: { slidesPerView: 4, spaceBetween: 30 },
        1024: { slidesPerView: 5, spaceBetween: 30 },
        1200: { slidesPerView: 6, spaceBetween: 30 },
      }}
      className="partners-swiper"
    >
      {slides}
    </Swiper>
    {/* Custom Navigation Buttons inside component so refs work */}
    <div className="swiper-button-prev-custom" ref={prevRef}><span>←</span></div>
    <div className="swiper-button-next-custom" ref={nextRef}><span>→</span></div>
  </>
  );
});

// Parent Component
const PartnersSwiper = () => {
  const [salons, setSalons] = useState([]);

  useEffect(() => {
    const locals = buildLocalSalons();
    setSalons(locals);
  }, []);

  if (salons.length === 0) {
    return (
      <div className="text-center py-5 w-100">
        <p className="text-muted">لا توجد صالونات متاحة حالياً</p>
      </div>
    );
  }

  return (
    <section className="partners-swiper-section py-5">
      <div className="container-fluid">
        <div className="section-title-divider my-3">
          <hr />
          <span className="title-pill">العيادات الأكثر حجزاً</span>
        </div>

        <div className="swiper-container-wrapper">
          <PartnersSwiperSlides salons={salons} />
        </div>
      </div>
    </section>
  );
};

export default PartnersSwiper;