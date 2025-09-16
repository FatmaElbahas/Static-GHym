import React, { useMemo, memo, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const API_URL = 'https://enqlygo.com/api/salons/most_booking_salons';
const CATEGORY_MAP = {
  '1': 'الأسنان',
  '2': 'الجلدية',
  '3': 'الجراحة',
  '4': 'النساء والولادة',
  '5': 'الليزر',
};

const MostBookedDoctorsSlides = memo(({ doctors }) => {
  const slides = useMemo(() => doctors.map((d) => (
    <SwiperSlide key={d.id}>
      <div className="partner-slide-card doctor-slide-card position-relative">
        <div className="doctor-image-wrap">
          <img
            src={d.photo}
            alt={d.name}
            className="img-fluid"
            loading="lazy"
            onError={(e) => {
              const placeholder = 'https://www.w3schools.com/howto/img_avatar.png';
              if (e && e.target && e.target.src !== placeholder) e.target.src = placeholder;
            }}
          />
        </div>
        {/* rating badge */}
        {typeof d.rating !== 'undefined' ? (
          <div className="position-absolute top-0 start-0 p-2" style={{fontSize:'0.85rem'}}>
            <span className="text-warning">★</span>
            <span className="ms-1 text-muted">{Number(d.rating).toFixed(1)}</span>
          </div>
        ) : null}
        <div className="partner-name doctor-info mt-1 text-center">
          <p className="mb-1 main-color fw-500">{d.name}</p>
          <small className="text-muted d-block">{d.specialty || d.clinic}</small>
          <small className="text-muted d-block">{d.address}</small>
        </div>
      </div>
    </SwiperSlide>
  )), [doctors]);

  return (
    <>
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={30}
        slidesPerView={2}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false, reverseDirection: true }}
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

const MostBookedDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const salons = (json && json.data && json.data.data) || [];
        const list = [];
        salons.forEach((s) => {
          const clinicName = s.salon_name || '';
          const address = s.salon_address || '';
          const rating = s.rating || 0;
          const specialty = (() => {
            if (!s.salon_categories) return '';
            const first = String(s.salon_categories).split(',')[0]?.trim();
            return CATEGORY_MAP[first] || '';
          })();
          if (Array.isArray(s.staff) && s.staff.length > 0) {
            s.staff.forEach((st, idx) => {
              const photoPath = st.photo ? `https://enqlygo.com/storage/${st.photo}` : (s.owner_photo || 'https://www.w3schools.com/howto/img_avatar.png');
              list.push({
                id: `${s.id}-${idx}`,
                name: st.name || 'طبيب',
                clinic: clinicName,
                address,
                rating,
                specialty,
                photo: photoPath || 'https://www.w3schools.com/howto/img_avatar.png',
              });
            });
          } else {
            list.push({
              id: `${s.id}`,
              name: s.owner_name || clinicName,
              clinic: clinicName,
              address,
              rating,
              specialty,
              photo: s.owner_photo || 'https://www.w3schools.com/howto/img_avatar.png',
            });
          }
        });
        setDoctors(list);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
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

  if (doctors.length === 0) {
    return (
      <div className="text-center py-5 w-100">
        <p className="text-muted">لا يوجد بيانات أطباء حالياً</p>
      </div>
    );
  }

  return (
    <section className="partners-swiper-section py-5">
      <div className="container-fluid">
        <div className="section-title-divider my-3">
          <hr />
          <span className="title-pill">الأطباء الأكثر حجزاً</span>
        </div>
        <div className="swiper-container-wrapper">
          <MostBookedDoctorsSlides doctors={doctors} />
        </div>
      </div>
    </section>
  );
};

export default MostBookedDoctors;


