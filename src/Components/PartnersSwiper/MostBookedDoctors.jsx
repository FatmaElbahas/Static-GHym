import React, { useMemo, memo, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const API_URL = 'https://enqlygo.com/api/salons/most_booking_staff';
const ADDRESSES_URL = 'https://enqlygo.com/api/salons/addresses';
const CATEGORIES_URL = 'https://enqlygo.com/api/salons/categories';


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
          <small className="text-muted d-block">{d.clinic}</small>
          {d.specialty ? (
            <small className="text-muted d-block">{d.specialty}</small>
          ) : null}
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
    // Helper: build absolute image URL safely
    const toAbsoluteImageUrl = (path) => {
      if (!path) return 'https://www.w3schools.com/howto/img_avatar.png';
      if (typeof path !== 'string') return 'https://www.w3schools.com/howto/img_avatar.png';
      if (path.startsWith('http')) return path;
      // common API patterns
      if (path.startsWith('storage/')) return `https://enqlygo.com/${path}`;
      return `https://enqlygo.com/${path.replace(/^\/+/, '')}`;
    };

    // Helper: normalize various API response shapes into a salons array
    const normalizeSalons = (json) => {
      if (!json) return [];
      if (Array.isArray(json)) return json;
      if (Array.isArray(json?.data)) return json.data;
      if (Array.isArray(json?.data?.data)) return json.data.data;
      if (Array.isArray(json?.payload)) return json.payload; // fallback
      return [];
    };

    const controller = new AbortController();
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const [staffRes, addressesRes, categoriesRes] = await Promise.all([
          fetch(API_URL, { signal: controller.signal }),
          fetch(ADDRESSES_URL, { signal: controller.signal }),
          fetch(CATEGORIES_URL, { signal: controller.signal })
        ]);
        if (!staffRes.ok) throw new Error(`HTTP ${staffRes.status}`);
        const json = await staffRes.json();
        const salons = normalizeSalons(json);
        let addresses = [];
        let categoriesMap = {};
        try {
          if (addressesRes.ok) {
            const addrJson = await addressesRes.json();
            const list = Array.isArray(addrJson?.data) ? addrJson.data : [];
            addresses = list.filter((x) => typeof x === 'string');
          }
        } catch (_) { /* ignore address fallback errors */ }
        try {
          if (categoriesRes.ok) {
            const catJson = await categoriesRes.json();
            const cats = Array.isArray(catJson?.data) ? catJson.data : [];
            categoriesMap = cats.reduce((map, c) => {
              const title = c.title_ar || c.title || '';
              map[String(c.id)] = title;
              return map;
            }, {});
          }
        } catch (_) { /* ignore categories errors */ }

        const list = salons.reduce((acc, s) => {
          // Case A: endpoint returns staff items with nested salon
          if (s && s.salon && s.name) {
            const clinicName = s.salon.salon_name || s.salon.owner_name || '';
            const address = s.salon.salon_address || addresses[0] || '';
            const rating = s.rating || s.salon.rating || 0;
            const specialty = (() => {
              const cats = s.salon.salon_categories || '';
              if (!cats) return '';
              const first = String(cats).split(',')[0]?.trim();
              return categoriesMap[first] || '';
            })();

            acc.push({
              id: String(s.id ?? `${clinicName}-${s.name}`),
              name: s.name || 'طبيب', // doctor's name
              clinic: clinicName,     // clinic name
              address,                // clinic address
              rating,
              specialty,
              photo: toAbsoluteImageUrl(s.photo) || toAbsoluteImageUrl(s.salon.owner_photo),
            });
            return acc;
          }

          // Case B: fallback – array of salons, derive doctors from staff/owner
          const clinicName = s.salon_name || s.name || '';
          const address = s.salon_address || s.address || s.city_name || addresses[0] || '';
          const rating = s.reviews_avg_rating || s.rating || 0;
          const specialty = (() => {
            const cats = s.salon_categories || s.category_id || '';
            if (!cats) return '';
            const first = String(cats).split(',')[0]?.trim();
            return categoriesMap[first] || '';
          })();

          if (Array.isArray(s.staff) && s.staff.length > 0) {
            s.staff.forEach((st, idx) => {
              acc.push({
                id: `${s.id}-${idx}`,
                name: st.name || 'طبيب',
                clinic: clinicName,
                address,
                rating,
                specialty,
                photo: toAbsoluteImageUrl(st.photo) || toAbsoluteImageUrl(s.owner_photo),
              });
            });
          } else {
            acc.push({
              id: `${s.id}`,
              name: s.owner_name || clinicName,
              clinic: clinicName,
              address,
              rating,
              specialty,
              photo: toAbsoluteImageUrl(s.owner_photo),
            });
          }
          return acc;
        }, []);

        setDoctors(list);
      } catch (e) {
        if (e.name === 'AbortError') return;
        setError(e.message || 'خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
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


