import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faTwitter, faSnapchatGhost, faInstagram } from '@fortawesome/free-brands-svg-icons';
import useAboutData from '../../hooks/useAboutData';

const AboutSection = () => {
  const isMobile = window.innerWidth < 768;
  const { data, loading, error } = useAboutData();

  // Loading state
  if (loading) {
    return (
      <section 
        id="about-section" 
        style={{ 
          scrollMarginTop: '150px', 
          marginTop: '80px',
          backgroundColor: '#fff',
          color: '#4A4A4A',
          fontWeight: '700', 
          paddingTop: '20px', 
          paddingBottom: '20px',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </section>
    );
  }

  // Only about_ar is dynamic from API, rest is static
  const aboutText = data?.about_ar || 'يقدم مجمع غيم الطبي الخدمات العلاجية و التجميلية في تخصصات الاسنان و الجلدية و الليزر من خلال نخبة من الاستشاريين و الاخصائيين و بأعلى معايير الجودة و الاحترافية';

  return (
    <section 
      id="about-section" 
      style={{ 
        scrollMarginTop: '150px', 
        marginTop: '80px',
        backgroundColor: '#fff',
        color: '#4A4A4A',
        fontWeight: '700', 
        paddingTop: '20px', 
        paddingBottom: '20px' 
      }}
    >
      <div className="container">
        <div className="d-flex flex-column align-items-center justify-content-between"> 
          <h2 
            className='text-center' 
            style={{
              color: '#4A4A4A', 
              fontSize: isMobile ? '1.5rem' : '35px'
            }}
          >
            مجمع غيم الطبي
          </h2>
          
          <p style={{
            fontSize: isMobile ? '0.85rem' : '1rem',
            marginTop: '0.5rem'
          }}>
            {aboutText}
          </p>
          
          <div className="d-flex align-items-center justify-content-center gap-4 mt-3" aria-label="روابط التواصل الاجتماعي">
            <a href="#" aria-label="TikTok" className="text-decoration-none" style={{color:'#4A4A4A'}}>
              <FontAwesomeIcon 
                icon={faTiktok} 
                style={{ 
                  fontSize: isMobile ? '24px' : '34px', 
                  width: isMobile ? '26px' : '36px', 
                  height: isMobile ? '26px' : '36px' 
                }} 
              />
            </a>
            <a href="#" aria-label="Twitter" className="text-decoration-none" style={{color:'#4A4A4A'}}>
              <FontAwesomeIcon 
                icon={faTwitter} 
                style={{ 
                  fontSize: isMobile ? '24px' : '34px', 
                  width: isMobile ? '26px' : '36px', 
                  height: isMobile ? '26px' : '36px' 
                }} 
              />
            </a>
            <a href="#" aria-label="Snapchat" className="text-decoration-none" style={{color:'#4A4A4A'}}>
              <FontAwesomeIcon 
                icon={faSnapchatGhost} 
                style={{ 
                  fontSize: isMobile ? '24px' : '34px', 
                  width: isMobile ? '26px' : '36px', 
                  height: isMobile ? '26px' : '36px' 
                }} 
              />
            </a>
            <a href="#" aria-label="Instagram" className="text-decoration-none" style={{color:'#4A4A4A'}}>
              <FontAwesomeIcon 
                icon={faInstagram} 
                style={{ 
                  fontSize: isMobile ? '24px' : '34px', 
                  width: isMobile ? '26px' : '36px', 
                  height: isMobile ? '26px' : '36px' 
                }} 
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

