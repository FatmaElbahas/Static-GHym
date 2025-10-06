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
          marginTop: isMobile ? '30px' : '60px',
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
        marginTop: isMobile ? '30px' : '80px',
        backgroundColor: '#fff',
        color: '#4A4A4A',
        fontWeight: '700', 
        paddingTop: isMobile ? '1.5rem' : '2rem', 
        paddingBottom: isMobile ? '1.5rem' : '2rem' 
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 1rem' : '0 1.5rem' }}>
        <div className="d-flex flex-column align-items-center justify-content-between"> 
          <h2 
            className='text-center' 
            style={{
              color: '#4A4A4A', 
              fontSize: isMobile ? '22px' : '40px',
              maxWidth: '100%',
              fontWeight: '800',
              marginBottom: isMobile ? '0.75rem' : '1.5rem'
            }}
          >
            مجمع غيم الطبي
          </h2>
          
          <p style={{
            fontSize: isMobile ? '14px' : '18px',
            marginTop: isMobile ? '0' : '0.5rem',
            lineHeight: isMobile ? '1.7' : '1.9',
            maxWidth: isMobile ? '100%' : '900px',
            textAlign: 'center',
            color: '#666',
            fontWeight: isMobile ? '400' : '500',
            padding: isMobile ? '0 0.5rem' : '0 1rem'
          }}>
            {aboutText}
          </p>
          
          <div className="d-flex align-items-center justify-content-center mt-3" style={{ gap: isMobile ? '0.75rem' : '1.25rem', flexWrap: 'wrap' }} aria-label="روابط التواصل الاجتماعي">
            <a 
              href="#" 
              aria-label="TikTok" 
              className="text-decoration-none" 
              style={{
                width: isMobile ? '40px' : '55px',
                height: isMobile ? '40px' : '55px',
                borderRadius: '50%',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e9ecef',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0171BD';
                e.currentTarget.querySelector('svg').style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.querySelector('svg').style.color = '#4A4A4A';
              }}
            >
              <FontAwesomeIcon 
                icon={faTiktok} 
                style={{ 
                  fontSize: isMobile ? '18px' : '24px',
                  color: '#4A4A4A',
                  transition: 'color 0.3s ease'
                }} 
              />
            </a>
            <a 
              href="#" 
              aria-label="Twitter" 
              className="text-decoration-none"
              style={{
                width: isMobile ? '40px' : '55px',
                height: isMobile ? '40px' : '55px',
                borderRadius: '50%',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e9ecef',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0171BD';
                e.currentTarget.querySelector('svg').style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.querySelector('svg').style.color = '#4A4A4A';
              }}
            >
              <FontAwesomeIcon 
                icon={faTwitter} 
                style={{ 
                  fontSize: isMobile ? '18px' : '24px',
                  color: '#4A4A4A',
                  transition: 'color 0.3s ease'
                }} 
              />
            </a>
            <a 
              href="#" 
              aria-label="Snapchat" 
              className="text-decoration-none"
              style={{
                width: isMobile ? '40px' : '55px',
                height: isMobile ? '40px' : '55px',
                borderRadius: '50%',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e9ecef',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0171BD';
                e.currentTarget.querySelector('svg').style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.querySelector('svg').style.color = '#4A4A4A';
              }}
            >
              <FontAwesomeIcon 
                icon={faSnapchatGhost} 
                style={{ 
                  fontSize: isMobile ? '18px' : '24px',
                  color: '#4A4A4A',
                  transition: 'color 0.3s ease'
                }} 
              />
            </a>
            <a 
              href="#" 
              aria-label="Instagram" 
              className="text-decoration-none"
              style={{
                width: isMobile ? '40px' : '55px',
                height: isMobile ? '40px' : '55px',
                borderRadius: '50%',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e9ecef',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0171BD';
                e.currentTarget.querySelector('svg').style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.querySelector('svg').style.color = '#4A4A4A';
              }}
            >
              <FontAwesomeIcon 
                icon={faInstagram} 
                style={{ 
                  fontSize: isMobile ? '18px' : '24px',
                  color: '#4A4A4A',
                  transition: 'color 0.3s ease'
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

