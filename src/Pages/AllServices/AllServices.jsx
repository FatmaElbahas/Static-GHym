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

  const featured = services.slice(0, 8);
  const rest = services.slice(8);
  return (
    <section className="services-section py-5 mt-5">
      <div className="container">
        <div className="section-title-divider my-3">
          <hr />
          <span className="title-pill">خدمات غيم</span>
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
          {/* الصف الأول: 4 عناصر باستخدام صف Bootstrap */}
          <div className="row g-4 justify-content-center mb-2">
            {featured.map((f, idx) => (
              <div key={`f-${idx}`} className="col-6 col-md-6 col-lg-3 col-xl-3">
                <div className="d-flex flex-column align-items-center text-center px-2">
                  <div className="mb-5" style={{ padding: 0 }}>
                    <img 
                      src={f.img || toothPlaceholder} 
                      alt={f.title} 
                      style={{ width: '79px', height: '79px', objectFit: f.img ? 'cover' : 'contain', borderRadius: f.img ? '10px' : '0' }}
                      onError={(e) => {
                        console.log('Image failed to load:', f.img, 'falling back to placeholder');
                        e.target.src = toothPlaceholder;
                        e.target.style.objectFit = 'contain';
                        e.target.style.borderRadius = '0';
                      }}
                    />
                  </div>
                  <h5 className="mt-1 mb-2" style={{ fontSize: '20px', fontWeight: 700 }}>{f.title}</h5>
                  {f.desc && (
                    <p className="text-muted mt-1 mb-0" style={{ fontSize: '15px' }}>
                      {f.desc.length > 120 ? f.desc.slice(0, 120) + '…' : f.desc}
                    </p>
                  )}
                  <div className="mt-2" style={{ color:'var(--color-main)', fontWeight:700, fontSize:'0.95rem' }}>
                    {typeof f.price === 'number' ? (
                      f.discount ? (
                        <>
                          <span className="text-muted text-decoration-line-through me-2">{f.price} ر.س</span>
                          <span>{Math.round(f.price * (1 - f.discount/100))} ر.س</span>
                        </>
                      ) : (
                        <span>{f.price} ر.س</span>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* باقي العناصر كلها في شبكة واحدة مرنة */}
          <div className="services-grid-7 g-4">
            {rest.map((f, idx) => (
              <div key={`r-${idx}`} className="services-grid-item text-center">
                <div className="d-flex flex-column align-items-center text-center px-2">
                  <div className="mb-4" style={{ padding: 0 }}>
                    <img 
                      src={f.img || toothPlaceholder} 
                      alt={f.title} 
                      style={{ width: '60px', height: '60px', objectFit: f.img ? 'cover' : 'contain', borderRadius: f.img ? '8px' : '0' }}
                      onError={(e) => {
                        console.log('Image failed to load:', f.img, 'falling back to placeholder');
                        e.target.src = toothPlaceholder;
                        e.target.style.objectFit = 'contain';
                        e.target.style.borderRadius = '0';
                      }}
                    />
                  </div>
                  <p className="mt-1 mb-1 fw-semibold" style={{ fontSize: '15px' }}>{f.title}</p>
                  <div className="small text-muted" style={{ minHeight: '18px' }}>
                    {f.desc ? (f.desc.length > 80 ? f.desc.slice(0, 80) + '…' : f.desc) : ''}
                  </div>
                  <div className="mt-1" style={{ color:'var(--color-main)', fontWeight:700, fontSize:'0.9rem' }}>
                    {typeof f.price === 'number' ? (
                      f.discount ? (
                        <>
                          <span className="text-muted text-decoration-line-through me-2">{f.price} ر.س</span>
                          <span>{Math.round(f.price * (1 - f.discount/100))} ر.س</span>
                        </>
                      ) : (
                        <span>{f.price} ر.س</span>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
          )}
        </div>
      </div>
      
    </section>
  );
}


