import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
 

// Import service images
import bookReservations from '../../assets/images/bookReservations.svg';
import ratingsSystem from '../../assets/images/ratingsSystem.jpg';
import تسجيلDخولDاتي from '../../assets/images/تسجيل دخول داتي.png';
import الربطالبرمجي from '../../assets/images/الربط البرمجي.png';
import notifySystem from '../../assets/images/notifySystem.svg';
import eStore from '../../assets/images/e-store.png';
import موقعتعريفي from '../../assets/images/موقع تعريفي.png';
import promoCode from '../../assets/images/promoCode.svg';
import نطاقالحجوزات from '../../assets/images/نطاق الحجوزات.png';
import الوصوللعملاءاكتر from '../../assets/images/الوصول لعملاء اكتر.svg';
import تطبيقجوالالخاص from '../../assets/images/تطبيق جوال خاص.png';
import homeVisits from '../../assets/images/homeVisits.svg';
import استشاراتعنبعد from '../../assets/images/استشارات عن بعد.svg';
import دعمفنيمتقدم from '../../assets/images/دعم فني متقدم.png';
import نقاطالولاء from '../../assets/images/نقاط الولاء.png';
import جهازالخدمةالذاتية from '../../assets/images/جهاز الخدمه الداتيه.png';
import joinBlsmyApp from '../../assets/images/joinBlsmyApp.png';
import jobsSystem from '../../assets/images/jobsSystem.png';
import labResults from '../../assets/images/labResults.svg';
import medInsurance from '../../assets/images/medInsurance.svg';
import toothPlaceholder from '../../assets/images/الاسنان.png';

// Static services data (to match exact visual cards like offers)
const STATIC_SERVICES = [
  { id: 1, title: 'جلسة مورفيس', price: 895, img: 'https://media.zid.store/cdn-cgi/image/w=300,h=300,q=100,f=auto/https://media.zid.store/thumbs/69733e3a-6328-43ea-90ee-cd02df32c66d/8d473eb7-a9f9-4f93-83ef-43fee0dfc3a2-thumbnail-770x770.png' },
  { id: 2, title: '3 جلسات ليزر فل بيدي', price: 895, img: 'https://media.zid.store/cdn-cgi/image/w=300,h=300,q=100,f=auto/https://media.zid.store/thumbs/69733e3a-6328-43ea-90ee-cd02df32c66d/c4f8239e-4610-4bdc-9e65-377f046854f9-thumbnail-770x770.png' },
  { id: 3, title: 'جلسة ليزر تجديد دقن', price: 49, img: 'https://media.zid.store/cdn-cgi/image/w=300,h=300,q=100,f=auto/https://media.zid.store/thumbs/69733e3a-6328-43ea-90ee-cd02df32c66d/b6bba8c8-0b1a-4231-9aa4-1b29d9548f16-thumbnail-770x770.png' },
  { id: 4, title: '4 مل فلر', price: 3295, img: 'https://media.zid.store/cdn-cgi/image/w=300,h=300,q=100,f=auto/https://media.zid.store/thumbs/69733e3a-6328-43ea-90ee-cd02df32c66d/c4f8239e-4610-4bdc-9e65-377f046854f9-thumbnail-770x770.png' },
  { id: 5, title: 'جلسة مورفيس', price: 895, img: 'https://media.zid.store/cdn-cgi/image/w=300,h=300,q=100,f=auto/https://media.zid.store/thumbs/69733e3a-6328-43ea-90ee-cd02df32c66d/8d473eb7-a9f9-4f93-83ef-43fee0dfc3a2-thumbnail-770x770.png' },
  { id: 6, title: '3 جلسات ليزر فل بيدي', price: 895, img: 'https://media.zid.store/cdn-cgi/image/w=300,h=300,q=100,f=auto/https://media.zid.store/thumbs/69733e3a-6328-43ea-90ee-cd02df32c66d/c4f8239e-4610-4bdc-9e65-377f046854f9-thumbnail-770x770.png' },
  { id: 7, title: 'جلسة ليزر تجديد دقن', price: 49, img: 'https://media.zid.store/cdn-cgi/image/w=300,h=300,q=100,f=auto/https://media.zid.store/thumbs/69733e3a-6328-43ea-90ee-cd02df32c66d/b6bba8c8-0b1a-4231-9aa4-1b29d9548f16-thumbnail-770x770.png' },
  { id: 8, title: '4 مل فلر', price: 3295, img: 'https://media.zid.store/cdn-cgi/image/w=300,h=300,q=100,f=auto/https://media.zid.store/thumbs/69733e3a-6328-43ea-90ee-cd02df32c66d/c4f8239e-4610-4bdc-9e65-377f046854f9-thumbnail-770x770.png' }
];

export default function Services() {

  // Memoized services for better performance
  const displayedServices = useMemo(() => STATIC_SERVICES.slice(0, 8), []);

  // إعدادات سلايدر مماثلة للموجود في MostBookedDoctors: 4 بطاقات بكل سلايد على الديسكتوب
  return (
    <section className="services-section py-1" style={{ marginTop: '40px', marginBottom: '40px', backgroundColor: '#F9F9F9' }}>
      <div className="py-3">
        <div className="mb-4 text-end " style={{ marginTop: '0px',paddingRight: '100px' }}>
          <h2 className="m-0" style={{ color: '#484848', fontWeight: 800, fontSize: '34px' }}>أبرز خدمات غيم</h2>
        </div>
        <div id="services-cards" className="services w-90 mx-auto">
          <>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={16}
            slidesPerView={4}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ 
              clickable: true,
              dynamicBullets: false
            }}
            breakpoints={{
              0: { slidesPerView: 1 },
              992: { slidesPerView: 4 }
            }}
            style={{ paddingBottom: '0px' }}
          >
            {displayedServices.map((service, idx) => (
              <SwiperSlide key={`srv-${idx}`}>
                <div className="h-100">
                  <div className="card w-100 h-100 border-0 position-relative offer-card" style={{ 
                    maxWidth: '100%',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    background: 'white'
                  }}>
                        <img
                          src={service.img || toothPlaceholder}
                          alt={service.title}
                          className="img-fluid w-100 shadow d-block"
                          style={{ width: '100%', height: '380px', objectFit: 'cover', marginTop: 0 }}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = toothPlaceholder; e.currentTarget.style.objectFit = 'contain'; }}
                        />
                        <div className="card-body py-2" style={{ paddingTop: '6px', paddingBottom: '6px' }}>
                          <h5 className="card-title fw-semibold text-end" style={{color:'#484848'}}>{service.title}</h5>
                          <div className="d-flex align-items-center justify-content-center mt-2" style={{ gap: '10px' }}>
                            <div className="d-flex align-items-center" style={{ gap: '6px' }}>
                              <span className="fw-bold" style={{ color: '#0171BD', fontSize: '22px', lineHeight: 1 }}>{service.price}</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 1124.14 1256.39"
                                width="12"
                                height="13"
                                style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 2px' }}
                                aria-label="Saudi Riyal"
                                title="Saudi Riyal"
                              >
                                <path fill="#231f20" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"></path>
                                <path fill="#231f20" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="quick-view-btn"
                          aria-label="عرض سريع"
                        >
                          عرض سريع
                        </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          </>
        </div>
      </div>
      <style>{`
        /* Override global margin-top for services section */
        .services-section {
          margin-top: 40px !important;
        }
        
        /* Force override for mobile devices */
        @media (max-width: 767.98px) {
          .services-section {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
        }
        
        @media (max-width: 576px) {
          .services-section {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
        }
        
        .services-more-btn:hover { 
          background-color: #0b5a7a !important;
          border-color: #0b5a7a !important;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(13, 120, 192, 0.3);
        }
        @media (max-width: 576px) {
          .services-more-btn { width: 100%; max-width: 360px; }
        }
      `}</style>
      
      {/* CSS for hover effects */}
      <style>{`
        .offer-card { position: relative; }
        .offer-card .quick-view-btn {
          position: absolute;
          left: 50%;
          transform: translate(-50%, 100%);
          bottom: 18%;
          width: 85%;
          height: 44px;
          background: #0171BD;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          transition: transform 0.35s ease, opacity 0.35s ease;
          opacity: 0;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          z-index: 3;
        }
        .offer-card:hover .quick-view-btn { transform: translate(-50%, 0); opacity: 1; }
        .offer-card .quick-view-btn:hover { filter: brightness(0.95); }
        .offer-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        .service-card:hover .service-icon {
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
}


