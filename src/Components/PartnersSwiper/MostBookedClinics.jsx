import React, { useState, useEffect, useMemo, memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import toothPlaceholder from '../../assets/images/الاسنان.png';

const API_URL = 'https://enqlygo.com/api/salons/most_booking_salons';

const toAbsoluteImageUrl = (path) => {
  // إذا لم تكن هناك صورة، استخدم الصورة المحلية الافتراضية
  if (!path || typeof path !== 'string' || path.trim() === '' || path === 'null' || path === 'undefined') {
    return toothPlaceholder;
  }
  
  // إذا كانت الصورة URL كامل
  if (path.startsWith('http')) return path;
  
  // إذا كانت الصورة تبدأ بـ storage/
  if (path.startsWith('storage/')) return `https://enqlygo.com/${path}`;
  
  // إذا كانت الصورة تبدأ بـ /
  if (path.startsWith('/')) return `https://enqlygo.com${path}`;
  
  // في جميع الحالات الأخرى
  return `https://enqlygo.com/${path.replace(/^\/+/, '')}`;
};

// Pure Swiper Component
const MostBookedClinicsSlides = memo(({ salons }) => {
  const slides = useMemo(() => {
    return salons.map((salon) => (
      <SwiperSlide key={salon.id}>
        <div className="partner-slide-card">
          <div className="partner-logo" style={{ marginTop: '25px' }}>
            <img
              src={toAbsoluteImageUrl(salon.owner_photo)}
              alt={salon.salon_name}
              className="img-fluid"
              loading="lazy"
              style={{ 
                width: '80px', 
                height: '80px', 
                objectFit: 'cover',
                backgroundColor: '#f8f9fa'
              }}
              onError={(e) => {
                if (e && e.target && e.target.src !== toothPlaceholder) {
                  e.target.src = toothPlaceholder;
                  e.target.alt = 'صورة افتراضية للعيادة';
                }
              }}
              onLoad={(e) => {
                e.target.style.display = 'block';
              }}
            />
          </div>
          <div className="partner-name" style={{ marginBottom: '20px', paddingBottom: '15px' }}>
            <p className="mb-0 main-color">{salon.salon_name}</p>
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
      navigation={{
        prevEl: '.swiper-button-prev-custom',
        nextEl: '.swiper-button-next-custom',
      }}
      breakpoints={{
        320: { slidesPerView: 1, spaceBetween: 15 },
        480: { slidesPerView: 2, spaceBetween: 15 },
        640: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 3, spaceBetween: 25 },
        1024: { slidesPerView: 4, spaceBetween: 30 },
        1200: { slidesPerView: 5, spaceBetween: 30 },
        1400: { slidesPerView: 6, spaceBetween: 30 },
      }}
      className="partners-swiper"
    >
      {slides}
    </Swiper>
    {/* Custom Navigation Buttons */}
    <div className="swiper-button-prev-custom"><span>←</span></div>
    <div className="swiper-button-next-custom"><span>→</span></div>
  </>
  );
});

// Parent Component
const MostBookedClinics = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data = Array.isArray(json?.data?.data) ? json.data.data : (Array.isArray(json?.data) ? json.data : []);
        const normalized = data.map((s) => ({
          id: s.id,
          salon_name: s.salon_name || s.owner_name || '',
          owner_name: s.owner_name || '',
          owner_photo: s.owner_photo || s.salon_photo || '',
          salon_address: s.salon_address || '',
          rating: s.rating || 0,
          bookings_count: s.bookings_count || 0,
        }));
        setSalons(normalized);
      } catch (e) {
        if (e.name === 'AbortError') return;
        setError(e.message || 'خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5 w-100">
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">تحميل...</span></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 w-100">
        <p className="text-danger">تعذر جلب البيانات</p>
      </div>
    );
  }

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
          <span className="title-pill" style={{ color: '#000000' }}>العيادات الأكثر حجزاً</span>
        </div>

        <div className="swiper-container-wrapper">
          <MostBookedClinicsSlides salons={salons} />
        </div>
      </div>
    </section>
  );
};

export default MostBookedClinics;




