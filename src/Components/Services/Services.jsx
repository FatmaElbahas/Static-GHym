import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import useServicesData from '../../hooks/useServicesData';

export default function Services() {
  const { data: apiServices, loading, error } = useServicesData();

  // Use API data only (no fallback to static) - show only 6 services
  const displayedServices = apiServices && apiServices.length > 0 
    ? apiServices.slice(0, 6)
    : [];

  // Loading state
  if (loading) {
    return (
      <section className="services-section py-1" style={{ marginTop: '40px', marginBottom: '40px', backgroundColor: '#F9F9F9' }}>
        <div className="py-3">
          <div className="mb-4 text-end" style={{ marginTop: '0px', paddingRight: '100px' }}>
            <h2 className="m-0" style={{ color: '#484848', fontWeight: 800, fontSize: '34px' }}>أبرز خدمات غيم</h2>
          </div>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If no services from API, don't show the section
  if (!loading && displayedServices.length === 0) {
    return null;
  }

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
            slidesPerView={1}
            loop={false}
            autoplay={{ 
              delay: 3000, 
              disableOnInteraction: false, 
              pauseOnMouseEnter: true 
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: false
            }}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 10 },
              576: { slidesPerView: 2, spaceBetween: 12 },
              768: { slidesPerView: 3, spaceBetween: 14 },
              992: { slidesPerView: 4, spaceBetween: 16 }
            }}
            style={{ paddingBottom: '40px' }}
          >
            {displayedServices.map((service) => {
              // Get service image from API only
              const serviceImage = service.images && service.images.length > 0 
                ? service.images[0].image 
                : null;

              // Skip services without images
              if (!serviceImage) return null;

              return (
                <SwiperSlide key={service.id}>
                  <Link to={`/service/${service.id}`} className="text-decoration-none h-100" style={{ display: 'block' }}>
                    <div className="h-100">
                      <div className="card w-100 border-0 offer-card" style={{ 
                        maxWidth: '100%',
                        borderRadius: '10px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        background: 'white',
                        height: '480px',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease'
                      }}>
                        <img
                          src={serviceImage}
                          alt={service.title_ar || 'خدمة'}
                          className="img-fluid w-100 shadow d-block"
                          style={{ 
                            width: '100%', 
                            height: '350px', 
                            objectFit: 'cover', 
                            marginTop: 0,
                            backgroundColor: '#f8f9fa',
                            flexShrink: 0
                          }}
                          loading="lazy"
                          onError={(e) => { 
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        
                        <div className="card-body" style={{ 
                          paddingTop: '8px', 
                          paddingBottom: '8px',
                          paddingLeft: '12px',
                          paddingRight: '12px',
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          overflow: 'hidden',
                          gap: '10px'
                        }}>
                          <h5 className="card-title fw-semibold text-end mb-0" style={{
                            color:'#484848',
                            fontSize: '18px',
                            lineHeight: '1.3',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            flex: 1
                          }}>
                            {service.title_ar}
                          </h5>
                          
                          <div className="d-flex align-items-center" style={{ gap: '4px', flexShrink: 0 }}>
                            <span className="fw-bold" style={{ color: '#0171BD', fontSize: '20px', lineHeight: 1, whiteSpace: 'nowrap' }}>
                              {service.price > 0 ? service.price : 'اتصل للسعر'}
                            </span>
                            {service.price > 0 && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 1124.14 1256.39"
                                width="11"
                                height="12"
                                style={{ display: 'inline-block', verticalAlign: 'middle' }}
                                aria-label="Saudi Riyal"
                                title="Saudi Riyal"
                              >
                                <path fill="#231f20" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"></path>
                                <path fill="#231f20" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
                              </svg>
                            )}
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          className="quick-view-btn"
                          aria-label="عرض التفاصيل"
                        >
                          عرض التفاصيل
                        </button>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
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
        .offer-card { 
          position: relative;
          transition: all 0.3s ease;
        }
        .offer-card .quick-view-btn {
          position: absolute;
          left: 50%;
          transform: translate(-50%, 50%);
          top: 310px;
          width: 85%;
          height: 44px;
          background: #0171BD;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          transition: all 0.35s ease;
          opacity: 0;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          z-index: 3;
          cursor: pointer;
        }
        .offer-card:hover .quick-view-btn { 
          transform: translate(-50%, -50%);
          opacity: 1;
        }
        .offer-card .quick-view-btn:hover { 
          filter: brightness(1.1);
          transform: translate(-50%, -60%);
          box-shadow: 0 12px 24px rgba(1, 113, 189, 0.3);
        }
        .offer-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
      `}</style>
    </section>
  );
}


