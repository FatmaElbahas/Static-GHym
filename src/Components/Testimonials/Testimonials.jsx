import React, { useMemo, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const API_URL = 'https://enqlygo.com/api/salons/reviews';

const Stars = ({ count = 5 }) => {
  return (
    <div className="d-flex gap-1 justify-content-center align-items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <span 
          key={i} 
          style={{ 
            color: i < count ? '#F5C518' : '#E0E0E0',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const Testimonials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = (json && json.data && json.data.data) || [];
        const mapped = list.map((r) => ({
          id: r.id,
          name: (r.user && (r.user.fullname || r.user.identity)) || 'مستخدم',
          clinic: (r.salon && r.salon.salon_name) || 'غير محدد',
          doctor: (r.salon && r.salon.owner_name) || 'غير محدد',
          text: r.comment || '',
          avatar: (r.user && r.user.profile_image) || 'https://www.w3schools.com/howto/img_avatar.png',
          rating: r.rating || 0,
        }));
        setItems(mapped);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const slides = useMemo(() => items.map((t) => (
    <SwiperSlide key={t.id}>
      <div className="testimonial-card rounded-4 shadow-sm p-4 bg-white ">
        <div className="d-flex align-items-start mb-3">
          <img 
            src={t.avatar} 
            alt={t.name} 
            className="rounded-circle" 
            style={{ width: 56, height: 56, objectFit: 'cover', marginLeft: '20px' }}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.src = 'https://www.w3schools.com/howto/img_avatar.png';
            }}
          />
          <div className="text-end flex-grow-1">
            <h6 className="mb-1 fw-bold main-color">{t.name}</h6>
            <small className="d-block text-muted">{t.clinic}</small>
            <small className="d-block text-muted">{t.doctor}</small>
            <div className="d-flex gap-1  align-items-center mt-1">
              {Array.from({ length: t.rating }).map((_, i) => (
                <span 
                  key={i} 
                  style={{ 
                    color: '#F5C518',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ★
                </span>
              ))}
            </div>
           
          </div>
        </div>
        <p className="mb-0 text-center " style={{ color: '#00a8b0', fontWeight: 700, fontSize: '20px' }}>"{t.text}"</p>
      </div>
    </SwiperSlide>
  )), [items]);

  if (loading) {
    return (
      <section className="partners-swiper-section py-5">
        <div className="container-fluid text-center">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">تحميل...</span></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="partners-swiper-section py-5">
        <div className="container-fluid text-center">
          <p className="text-danger">تعذر تحميل آراء العملاء</p>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="partners-swiper-section py-5">
      <div className="container-fluid">
        <div className="section-title-divider my-3">
          <hr />
          <span className="title-pill">آراء العملاء</span>
        </div>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 24 },
            1200: { slidesPerView: 3, spaceBetween: 24 },
          }}
          className="partners-swiper"
        >
          {slides}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;


