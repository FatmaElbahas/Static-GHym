import React, { memo } from 'react';

// Simple, elegant map section centered on Riyadh
const MapSection = () => {
  // Google Maps embed focused on Riyadh
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d184457.3549189419!2d46.53114253451636!3d24.7254553144539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f035b21087a5f%3A0xb4e2e1b6f3b4e2f0!2sRiyadh!5e0!3m2!1sen!2ssa!4v1700000000000!5m2!1sen!2ssa";

  return (
    <section dir="rtl" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
      <div className="container py-5">
        <div id="map-title" className="section-title-divider my-3 text-center">
          <hr />
          <span className="title-pill">موقعنا على الخريطة</span>
        </div>

        <div className="position-relative" style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(15,23,42,0.12), 0 6px 14px rgba(15,23,42,0.06)' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(1200px 1200px at 100% 0%, rgba(3,143,173,0.06), transparent 60%)' }} />
          <iframe
            title="Riyadh Location Map"
            src={mapSrc}
            width="100%"
            height="420"
            style={{ border: 0, display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="row g-3 justify-content-center mt-3">
          <div className="col-auto">
            <div className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill" style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 4px 12px rgba(15,23,42,0.06)' }}>
              <span className="fw-semibold" style={{ color: 'var(--color-main, #00a8b0)', fontSize: '1.15rem' }}>الرياض</span>
              <span style={{ color: '#64748b', fontSize: '1.05rem' }}>المملكة العربية السعودية</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(MapSection);


