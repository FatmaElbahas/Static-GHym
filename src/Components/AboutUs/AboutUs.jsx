import React, { memo, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faCogs, faPhoneAlt, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import TeamAbout from '../../assets/images/team about.jpg';
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
    <section id="about" className='my-5' dir="rtl" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 45%)', marginBottom: 0 }}>
      <div className="container py-5">
        <div id="about-title" className="section-title-divider my-3 text-center">
          <hr />
          <span className="title-pill">من نحن</span>
        </div>
        <div className="row g-4 align-items-center">
              {/* Text area */}
          <div className="col-12 col-lg-6 order-2 order-lg-1 text-end">
            <div className="d-flex flex-column gap-3">
              
              <h3 className="fw-bold" style={{ color: 'var(--color-main, #00a8b0)', fontSize: '1.5rem' }}>نحن نؤمن بأن الصحة حق للجميع</h3>
              <p className="mb-2" style={{ color: '#334155', lineHeight: 1.9, fontSize: '1.05rem' }}>
                {aboutText && !isLoading ? aboutText : 'تأسس مركز غيم الطبي على رؤية واضحة: تقديم رعاية صحية استثنائية تجمع بين الخبرة الطبية العالية والتقنيات الحديثة والخدمة الإنسانية المتميزة. نلتزم بمعايير الجودة العالمية في جميع خدماتنا الطبية.'}
              </p>

              <ul className="list-unstyled m-0">
                <li className="d-flex align-items-center gap-2 mb-2">
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', border: '1px solid rgba(15,23,42,0.08)' }}>
                    <FontAwesomeIcon icon={faUserMd} style={{ color: 'var(--color-main, #00a8b0)', fontSize: '0.95rem' }} />
                  </span>
                  <span>أطباء معتمدون بخبرة دولية</span>
                </li>
                <li className="d-flex align-items-center gap-2 mb-2">
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', border: '1px solid rgba(15,23,42,0.08)' }}>
                    <FontAwesomeIcon icon={faCogs} style={{ color: 'var(--color-main, #00a8b0)', fontSize: '0.95rem' }} />
                  </span>
                  <span>تقنيات طبية متقدمة ومعدات حديثة</span>
                </li>
                <li className="d-flex align-items-center gap-2 mb-2">
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', border: '1px solid rgba(15,23,42,0.08)' }}>
                    <FontAwesomeIcon icon={faPhoneAlt} style={{ color: 'var(--color-main, #00a8b0)', fontSize: '0.95rem' }} />
                  </span>
                  <span>خدمة عملاء متميزة على مدار الساعة</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', border: '1px solid rgba(15,23,42,0.08)' }}>
                    <FontAwesomeIcon icon={faShieldAlt} style={{ color: 'var(--color-main, #00a8b0)', fontSize: '0.95rem' }} />
                  </span>
                  <span>معايير سلامة وجودة عالمية</span>
                </li>
              </ul>

              
            </div>
          </div>
          {/* Image area */}
          <div className="col-12 col-lg-6 order-1 order-lg-2">
            <div className="position-relative overflow-hidden" style={{ border: '1px solid rgba(15,23,42,0.06)', borderRadius: 24, boxShadow: '0 12px 28px rgba(15,23,42,0.12), 0 2px 8px rgba(15,23,42,0.06)' }}>
              <div
                className="w-100"
                style={{
                  backgroundImage: `url(${imageUrl || TeamAbout})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  aspectRatio: '16 / 10',
                  borderRadius: 24,
                }}
                aria-label="صورة تعريفية"
                role="img"
              />
            </div>
          </div>

        
        </div>
        {/* Section actions moved below content */}
        <div className="text-center mt-4">
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
      `}</style>
    </section>
  );
};

export default memo(AboutUs);


