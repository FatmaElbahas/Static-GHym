import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

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

const SERVICES_URL = 'https://enqlygo.com/api/salons/most_booking_services';

const buildImageUrl = (path) => {
  if (!path || typeof path !== 'string') return null;
  if (path.startsWith('http')) return path;
  return `https://enqlygo.com/${path.replace(/^\/+/, '')}`;
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(SERVICES_URL, { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        
        const json = await res.json();
        if (json?.status === 'error') {
          throw new Error(json?.message || 'خطأ في الخادم');
        }
        
        const list = Array.isArray(json?.data) ? json.data : [];
        const formatted = list
          .filter(s => s.status === 1)
          .map(s => ({
            id: s.id,
            title: s.title_ar || s.title || s.title_en,
            desc: s.about_ar || s.about || s.about_en || '',
            img: buildImageUrl(s.images?.[0]?.image),
            price: s.price,
            duration: s.service_time,
            discount: s.discount,
          }));
        
        if (isMounted) {
          setServices(formatted);
        }
      } catch (e) {
        if (e.name !== 'AbortError' && isMounted) {
          setError(e.message || 'حدث خطأ أثناء جلب الخدمات');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadServices();
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Memoized services for better performance
  const displayedServices = useMemo(() => services.slice(0, 6), [services]);
  return (
    <section className="services-section py-3" style={{ marginTop: '150px', marginBottom: '-80px' }}>
      <div className="container">
        <div className="section-title-divider my-3 mb-5" style={{ marginTop: '40px' }}>
          <hr />
          <span className="title-pill" style={{ color: '#000000' }}>خدماتنا</span>
        </div>
        <div id="services-cards" className="services-container mx-auto">
          {loading && (
            <div className="d-flex align-items-center justify-content-center py-5">
              <div className="text-center p-4 rounded-3 shadow-sm" style={{ background:'#fff', minWidth:'280px' }}>
                <FontAwesomeIcon icon={faSpinner} spin size="3x" style={{ color:'var(--color-main)' }} />
                <div className="mt-3 fw-semibold" style={{ color:'var(--color-main)' }}>جاري تحميل الخدمات...</div>
              </div>
            </div>
          )}
          {error && (
            <div className="alert alert-danger text-center" role="alert">{error}</div>
          )}
          {!loading && !error && (
          <>
          {/* خدمات في شبكة 3x2 */}
          <div className="row g-4 justify-content-center">
            {displayedServices.map((service, idx) => (
              <div key={idx} className="col-md-6 col-lg-4">
                <div className="service-card" style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  padding: '30px',
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  <div className="service-icon mb-4" style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#0d78c0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    <img 
                      src={service.img || toothPlaceholder} 
                      alt={service.title} 
                      loading="lazy"
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        objectFit: 'contain',
                        filter: 'brightness(0) invert(1)'
                      }}
                      onError={(e) => {
                        e.target.src = toothPlaceholder;
                        e.target.style.filter = 'brightness(0) invert(1)';
                      }}
                    />
                  </div>
                  
                  <h5 className="mb-3" style={{ 
                    color: '#333333', 
                    fontSize: '1.4rem', 
                    fontWeight: 'bold',
                    marginBottom: '15px'
                  }}>
                    {service.title}
                  </h5>
                  
                  <p className="mb-0" style={{ 
                    color: '#666666', 
                    fontSize: '1rem', 
                    lineHeight: '1.5',
                    flexGrow: 1
                  }}>
                    {service.desc || 'خدمة طبية متخصصة تقدم بأعلى معايير الجودة والرعاية'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          </>
          )}
        </div>
      </div>
      {/* Section CTA at bottom */}
      <div className="text-center mt-5">
        <a
          href="/all-services"
          className="btn fw-semibold rounded-pill services-more-btn"
          style={{
            backgroundColor: '#0d78c0',
            color: '#ffffff',
            padding: '12px 30px',
            border: '2px solid #0d78c0',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '25px',
            transition: 'all 0.3s ease'
          }}
        >
          عرض المزيد
        </a>
      </div>
      <style>{`
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
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .service-card:hover .service-icon {
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
}


