import React, { memo, useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';

// Simple, elegant map section centered on Riyadh
const MapSection = () => {
  const [isMapVisible, setIsMapVisible] = useState(false);
  const mapRef = useRef(null);
  
  // Google Maps embed focused on Riyadh
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d184457.3549189419!2d46.53114253451636!3d24.7254553144539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f035b21087a5f%3A0xb4e2e1b6f3b4e2f0!2sRiyadh!5e0!3m2!1sen!2ssa!4v1700000000000!5m2!1sen!2ssa";

  // Lazy load the map when section is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isMapVisible) {
            setIsMapVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' }
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [isMapVisible]);

  const isMobile = window.innerWidth <= 768;
  
  return (
    <section dir="rtl" style={{ backgroundColor: '#F9F9F9', marginTop: isMobile ? '30px' : '48px', paddingTop: isMobile ? '30px' : '48px', paddingBottom: isMobile ? '30px' : '48px' }}>
      <div className="mx-auto" style={{ width: isMobile ? '85%' : '90%' }}>
        <div className="mb-4 text-center text-lg-end" style={{ paddingRight: isMobile ? '0' : '10px' }}>
          <h2 className="m-0" style={{ color: '#484848', fontWeight: 800, fontSize: isMobile ? '24px' : '34px' }}>موقعنا على الخريطة</h2>
        </div>

        <div className="row g-4 align-items-center">
          {/* عمود معلومات المكان */}
          <div className="col-12 col-lg-5">
            <div className="contact-info-section d-flex flex-column" style={{ gap: isMobile ? '1rem' : '1.5rem' }}>
              {/* العنوان */}
              <div className="contact-item d-flex align-items-start" style={{ gap: isMobile ? '0.75rem' : '1rem', marginBottom: isMobile ? '0.5rem' : '1.5rem' }}>
                <div className="contact-icon me-3" style={{ 
                  width: isMobile ? '40px' : '50px', 
                  height: isMobile ? '40px' : '50px', 
                  borderRadius: '50%', 
                  background: 'rgba(13, 120, 192, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#0171BD', fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                </div>
                <div className="contact-details">
                  <h6 className="fw-bold mb-1" style={{ color: '#333', fontSize: isMobile ? '0.95rem' : '1.1rem' }}>العنوان</h6>
                  <p className="mb-0" style={{ color: '#666', fontSize: isMobile ? '0.85rem' : '1rem' }}>الرياض، المملكة العربية السعودية</p>
                  <p className="mb-0" style={{ color: '#666', fontSize: isMobile ? '0.85rem' : '1rem' }}>شارع الملك فهد، حي الملز</p>
                </div>
              </div>

              {/* الهاتف */}
              <div className="contact-item d-flex align-items-start" style={{ gap: isMobile ? '0.75rem' : '1rem', marginBottom: isMobile ? '0.5rem' : '1.5rem' }}>
                <div className="contact-icon me-3" style={{ 
                  width: isMobile ? '40px' : '50px', 
                  height: isMobile ? '40px' : '50px', 
                  borderRadius: '50%', 
                  background: 'rgba(13, 120, 192, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FontAwesomeIcon icon={faPhone} style={{ color: '#0171BD', fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                </div>
                <div className="contact-details">
                  <h6 className="fw-bold mb-1" style={{ color: '#333', fontSize: isMobile ? '0.95rem' : '1.1rem' }}>الهاتف</h6>
                  <a 
                    href="tel:+966111234567" 
                    className="mb-0 text-decoration-none" 
                    style={{ 
                      color: '#0171BD', 
                      fontSize: isMobile ? '0.85rem' : '1rem',
                      cursor: 'pointer',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#0171BD'}
                    onMouseLeave={(e) => e.target.style.color = '#0171BD'}
                  >
                    +966 11 123 4567
                  </a>
                </div>
              </div>

              {/* البريد الإلكتروني */}
              <div className="contact-item d-flex align-items-start" style={{ gap: isMobile ? '0.75rem' : '1rem', marginBottom: isMobile ? '0.5rem' : '1.5rem' }}>
                <div className="contact-icon me-3" style={{ 
                  width: isMobile ? '40px' : '50px', 
                  height: isMobile ? '40px' : '50px', 
                  borderRadius: '50%', 
                  background: 'rgba(13, 120, 192, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FontAwesomeIcon icon={faEnvelope} style={{ color: '#0171BD', fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                </div>
                <div className="contact-details">
                  <h6 className="fw-bold mb-1" style={{ color: '#333', fontSize: isMobile ? '0.95rem' : '1.1rem' }}>البريد الإلكتروني</h6>
                  <a 
                    href="mailto:info@ghaym-medical.com" 
                    className="mb-0 text-decoration-none" 
                    style={{ 
                      color: '#0171BD', 
                      fontSize: isMobile ? '0.85rem' : '1rem',
                      cursor: 'pointer',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#0171BD'}
                    onMouseLeave={(e) => e.target.style.color = '#0171BD'}
                  >
                    info@ghaym-medical.com
                  </a>
                </div>
              </div>

              {/* ساعات العمل */}
              <div className="contact-item d-flex align-items-start" style={{ gap: isMobile ? '0.75rem' : '1rem' }}>
                <div className="contact-icon me-3" style={{ 
                  width: isMobile ? '40px' : '50px', 
                  height: isMobile ? '40px' : '50px', 
                  borderRadius: '50%', 
                  background: 'rgba(13, 120, 192, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FontAwesomeIcon icon={faClock} style={{ color: '#0171BD', fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                </div>
                <div className="contact-details">
                  <h6 className="fw-bold mb-1" style={{ color: '#333', fontSize: isMobile ? '0.95rem' : '1.1rem' }}>ساعات العمل</h6>
                  <p className="mb-1" style={{ color: '#666', fontSize: isMobile ? '0.85rem' : '1rem' }}>الأحد - الخميس: 8:00 ص - 6:00 م</p>
                  <p className="mb-1" style={{ color: '#666', fontSize: isMobile ? '0.85rem' : '1rem' }}>الجمعة: 2:00 م - 6:00 م</p>
                  <p className="mb-0" style={{ color: '#666', fontSize: isMobile ? '0.85rem' : '1rem' }}>السبت: مغلق</p>
                </div>
              </div>
            </div>
          </div>

          {/* عمود الخريطة */}
          <div className="col-12 col-lg-7" ref={mapRef}>
            <div className="position-relative map-container" style={{ 
              borderRadius: isMobile ? 15 : 20, 
              overflow: 'hidden', 
              boxShadow: '0 20px 40px rgba(15,23,42,0.12), 0 6px 14px rgba(15,23,42,0.06)', 
              minHeight: isMobile ? '350px' : '500px',
              marginTop: isMobile ? '20px' : '0',
              touchAction: isMobile ? 'pan-y' : 'auto'
            }}>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(1200px 1200px at 100% 0%, rgba(3,143,173,0.06), transparent 60%)' }} />
              {/* Overlay للسماح بالـ scroll على الموبايل */}
              {isMobile && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    zIndex: 1,
                    pointerEvents: 'auto',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    // عند النقر، نخلي الخريطة interactive
                    e.currentTarget.style.pointerEvents = 'none';
                    setTimeout(() => {
                      if (e.currentTarget) e.currentTarget.style.pointerEvents = 'auto';
                    }, 3000);
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(1, 113, 189, 0.9)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    pointerEvents: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    اضغط لعرض الخريطة
                  </div>
                </div>
              )}
              {isMapVisible ? (
                <iframe
                  title="Riyadh Location Map"
                  src={mapSrc}
                  width="100%"
                  height={isMobile ? '350' : '500'}
                  style={{ border: 0, display: 'block', pointerEvents: isMobile ? 'none' : 'auto' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: isMobile ? '350px' : '500px', 
                  backgroundColor: '#e9ecef', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#6c757d'
                }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">جاري تحميل الخريطة...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(MapSection);


