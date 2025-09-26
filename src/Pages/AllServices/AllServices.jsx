import React, { useEffect, useState } from 'react';
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

const SERVICES_URL = 'https://enqlygo.com/api/offers';

const buildImageUrl = (path) => {
  if (!path || typeof path !== 'string') return null;
  if (path.startsWith('http')) return path;
  return `https://enqlygo.com/${path.replace(/^\/+/, '')}`;
};

export default function AllServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError(null);
        const res = await fetch(SERVICES_URL);
        const json = await res.json();
        if (!res.ok || json?.status === 'error') {
          throw new Error(json?.message || `HTTP ${res.status}`);
        }
        const list = Array.isArray(json?.data) ? json.data : [];
        // Flatten salons -> services. Each item becomes a service card with image, name, description, price
        const formatted = list.flatMap((salon) => {
          const servicesArr = Array.isArray(salon?.services) ? salon.services : [];
          return servicesArr
            .filter((srv) => srv?.status === 1)
            .map((srv) => ({
              id: `${salon.id}-${srv.id}`,
              title: srv.title_ar || srv.title || srv.title_en,
              desc: srv.about_ar || srv.about || srv.about_en || '',
              img: buildImageUrl(salon?.owner_photo) || toothPlaceholder,
              price: srv.price,
              duration: srv.service_time,
              discount: srv.discount,
            }));
        });
        if (!isMounted) return;
        setServices(formatted);
      } catch (e) {
        if (!isMounted) return;
        setError(e.message || 'حدث خطأ أثناء جلب الخدمات');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const featured = services.slice(0, 6);
  const rest = services.slice(6);
  
  return (
    <section className="services-section py-5 mb-3" style={{ marginTop: '150px', marginBottom: '-80px' }}>
      <div className="container">
        <div className="section-title-divider my-3 mb-5" style={{ marginTop: '40px' }}>
          <hr />
          <span className="title-pill" style={{ color: '#000000' }}>خدمات غيم</span>
        </div>
        <div className="services-container mx-auto">
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
          {/* خدمات مميزة في شبكة 3x2 */}
          <div className="row g-4 justify-content-center mb-5">
            {featured.map((service, idx) => (
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
                  
                  <p className="mb-3" style={{ 
                    color: '#666666', 
                    fontSize: '1rem', 
                    lineHeight: '1.5',
                    flexGrow: 1
                  }}>
                    {service.desc || 'خدمة طبية متخصصة تقدم بأعلى معايير الجودة والرعاية'}
                  </p>

                  {/* السعر */}
                  <div className="mt-auto" style={{ color:'#0d78c0', fontWeight:700, fontSize:'1.1rem' }}>
                    {typeof service.price === 'number' ? (
                      service.discount ? (
                        <>
                          <span className="text-muted text-decoration-line-through me-2">{service.price} ر.س</span>
                          <span>{Math.round(service.price * (1 - service.discount/100))} ر.س</span>
                        </>
                      ) : (
                        <span>{service.price} ر.س</span>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* باقي الخدمات في شبكة مرنة */}
          {rest.length > 0 && (
            <>
              <div className="section-title-divider my-4">
                <hr />
                <span className="title-pill" style={{ color: '#000000' }}>خدمات إضافية</span>
              </div>
              <div className="row g-4 justify-content-center">
                {rest.map((service, idx) => (
                  <div key={`r-${idx}`} className="col-md-6 col-lg-4 col-xl-3">
                    <div className="service-card" style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      padding: '25px',
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transition: 'all 0.3s ease'
                    }}>
                      <div className="service-icon mb-3" style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: '#0d78c0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '15px'
                      }}>
                        <img 
                          src={service.img || toothPlaceholder} 
                          alt={service.title} 
                          loading="lazy"
                          style={{ 
                            width: '35px', 
                            height: '35px', 
                            objectFit: 'contain',
                            filter: 'brightness(0) invert(1)'
                          }}
                          onError={(e) => {
                            e.target.src = toothPlaceholder;
                            e.target.style.filter = 'brightness(0) invert(1)';
                          }}
                        />
                      </div>
                      
                      <h6 className="mb-2" style={{ 
                        color: '#333333', 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold'
                      }}>
                        {service.title}
                      </h6>
                      
                      <p className="mb-3" style={{ 
                        color: '#666666', 
                        fontSize: '0.9rem', 
                        lineHeight: '1.4',
                        flexGrow: 1
                      }}>
                        {service.desc ? (service.desc.length > 80 ? service.desc.slice(0, 80) + '…' : service.desc) : 'خدمة طبية متخصصة'}
                      </p>

                      {/* السعر */}
                      <div className="mt-auto" style={{ color:'#0d78c0', fontWeight:700, fontSize:'1rem' }}>
                        {typeof service.price === 'number' ? (
                          service.discount ? (
                            <>
                              <span className="text-muted text-decoration-line-through me-2">{service.price} ر.س</span>
                              <span>{Math.round(service.price * (1 - service.discount/100))} ر.س</span>
                            </>
                          ) : (
                            <span>{service.price} ر.س</span>
                          )
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          </>
          )}
        </div>
      </div>
      
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


