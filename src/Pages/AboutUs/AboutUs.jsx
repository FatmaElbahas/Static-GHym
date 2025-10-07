import React, { memo, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faCogs, faPhoneAlt, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import TeamAbout from '../../assets/images/team about.png';
// About Us section component (RTL friendly, lightweight, accessible)
const AboutUs = () => {
  // Remote content state (API-driven)
  const [aboutText, setAboutText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch About content from API with abort safety
    const controller = new AbortController();
    const { signal } = controller;
    async function fetchAbout() {
      try {
        setIsLoading(true);
        const res = await fetch('https://enqlygo.com/api/about', { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data = json?.data || {};
        if (typeof data.about_ar === 'string') {
          setAboutText(data.about_ar);
        }
        if (typeof data.image === 'string' && data.image) {
          setImageUrl(data.image);
        }
      } catch (_) {
        // Silently fall back to defaults on error
      } finally {
        setIsLoading(false);
      }
    }
    fetchAbout();
    return () => controller.abort();
  }, []);
  return (
    <section id="about" className='about-section mb-0' dir="rtl" style={{ 
      backgroundColor: '#f8f9fa', 
      marginBottom: '0!important',
      marginTop: window.innerWidth < 768 ? '80px' : '100px',
      paddingTop: window.innerWidth < 768 ? '2rem' : '3rem'
    }}>
      <div className="container" style={{ 
        paddingTop: window.innerWidth < 768 ? '1rem' : '3rem',
        paddingBottom: window.innerWidth < 768 ? '1rem' : '3rem'
      }}>
        <div id="about-title" className="my-3 text-center">
          <h2 className="title-pill" style={{ 
            color: '#000000',
            fontSize: window.innerWidth < 768 ? '1.8rem' : '2.5rem',
            fontWeight: '700',
            marginBottom: '2rem'
          }}>من نحن</h2>
        </div>
        <div className="row g-5  align-items-center">
          {/* Image area */}
          <div className="col-12 col-lg-6 order-2 order-lg-2">
            <div className="position-relative overflow-hidden" style={{ 
              borderRadius: '20px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              height: window.innerWidth < 768 ? '300px' : window.innerWidth < 992 ? '400px' : '500px'
            }}>
              <div
                className="w-100 h-100"
                style={{
                  backgroundImage: `url(${imageUrl || TeamAbout})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '20px',
                }}
                aria-label="صورة تعريفية"
                role="img"
              />
            </div>
          </div>
          {/* Text area */}
          <div className="col-12 col-lg-6 order-1 mt-0 order-lg-1 d-flex align-items-start" >
            <div className="ps-lg-4">
              <h2 className="fw-normal mb-3" style={{ 
                color: '#0d78c0', 
                fontSize: window.innerWidth < 768 ? '1.5rem' : window.innerWidth < 992 ? '1.8rem' : '2rem',
                lineHeight: '1.4',
                marginTop: '0.5rem'
              }}>
                نحن نؤمن بأن الصحة حق للجميع
              </h2>
              
              <p className="mb-4" style={{ 
                color: '#666666', 
                fontSize: window.innerWidth < 768 ? '0.95rem' : '1.1rem',
                lineHeight: '1.7'
              }}>
                {aboutText && !isLoading ? aboutText : 'تأسس مركز غيم الطبي على رؤية واضحة: تقديم رعاية صحية استثنائية تجمع بين الخبرة الطبية العالية والتقنيات الحديثة والخدمة الإنسانية المتميزة. نلتزم بمعايير الجودة العالمية في جميع خدماتنا الطبية.'}
              </p>

              <div className="row gy-4 gx-3">
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="flex-shrink-0" style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: '#0d78c0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FontAwesomeIcon icon={faUserMd} style={{ color: '#ffffff', fontSize: '1.2rem' }} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: '#333333', fontSize: '1.1rem' }}>أطباء معتمدون</h6>
                      <p className="mb-0 text-muted small">خبرة دولية في جميع التخصصات الطبية</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="flex-shrink-0" style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: '#0d78c0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FontAwesomeIcon icon={faCogs} style={{ color: '#ffffff', fontSize: '1.2rem' }} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: '#333333', fontSize: '1.1rem' }}>تقنيات متقدمة</h6>
                      <p className="mb-0 text-muted small">أحدث المعدات والتقنيات الطبية</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="flex-shrink-0" style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: '#0d78c0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FontAwesomeIcon icon={faPhoneAlt} style={{ color: '#ffffff', fontSize: '1.2rem' }} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: '#333333', fontSize: '1.1rem' }}>خدمة على مدار الساعة</h6>
                      <p className="mb-0 text-muted small">دعم فني متقدم ورعاية مستمرة</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="flex-shrink-0" style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: '#0d78c0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FontAwesomeIcon icon={faShieldAlt} style={{ color: '#ffffff', fontSize: '1.2rem' }} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: '#333333', fontSize: '1.1rem' }}>معايير الجودة</h6>
                      <p className="mb-0 text-muted small">سلامة وجودة عالمية معتمدة</p>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>
          </div>

        
        </div>
        {/* Section actions moved below content */}
        <div className="text-center mt-4 about-actions">
          <a href="/all-services" className="btn fw-semibold rounded-pill shadow-sm mx-2 about-btn-primary">
            استكشف خدماتنا
          </a>
          <a href="/contact" className="btn fw-semibold rounded-pill mx-2 about-btn-outline">
            تواصل معنا
          </a>
        </div>
      </div>

      {/* Small responsive tweaks without extra css files */}
      <style>{`
        /* Buttons styling */
        #about .about-btn-primary {
          background-color: var(--color-main, #00a8b0);
          border-color: var(--color-main, #00a8b0);
          padding: 0.7rem 1.4rem;
          font-size: 1.05rem;
          color: #ffffff !important;
          transition: transform .15s ease, box-shadow .2s ease, background-color .2s ease, filter .2s ease;
        }
        #about .about-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(0,168,176,.15);
          background-color: #ffffff;
          color: var(--color-main, #00a8b0) !important;
          border-color: var(--color-main, #00a8b0);
          border-width: 1px;
          filter: none;
        }
        #about .about-btn-primary:active {
          transform: translateY(0);
          box-shadow: 0 6px 14px rgba(0,168,176,.18);
        }
        #about .about-btn-outline {
          background-color: transparent;
          color: var(--color-main, #00a8b0);
          border-color: var(--color-main, #00a8b0);
          border-width: 1px;
          border-style: solid;
          padding: 0.65rem 1.3rem;
          font-size: 1.05rem;
          transition: background-color .2s ease, color .2s ease, box-shadow .2s ease, transform .15s ease, filter .2s ease;
        }
        #about .about-btn-outline:hover {
          background-color: var(--color-main, #00a8b0)!important;
          color: #ffffff !important;
          border-color: var(--color-main, #00a8b0);
          transform: none;
          box-shadow: none;
          filter: none;
        }
        #about .about-btn-outline:active {
          background-color: rgba(0,168,176,.12);
          transform: translateY(0);
        }

        @media (min-width: 992px) {
          #about h2 { font-size: 3.5rem; }
          #about .container { padding-top: 3.25rem !important; padding-bottom: 3.25rem !important; }
        }

        /* Mobile spacing for action buttons */
        @media (max-width: 576px) {
          #about .about-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: center;
          }
          #about .about-btn-primary,
          #about .about-btn-outline {
            width: 100%;
            max-width: 360px;
          }
        }
        
        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          #about .row {
            gap: 1.5rem !important;
          }
          #about .container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default memo(AboutUs);


