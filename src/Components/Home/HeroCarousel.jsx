import React from 'react';
import HeroBg from '../../assets/images/heroghym.webp';
import HeroBg2 from '../../assets/images/heroghym2.webp';

const HeroCarousel = () => {
  return (
    <section className="hero-section position-relative mb-0" style={{ width: '100%', marginLeft: 0, marginRight: 0 }} dir="rtl">
      <div 
        id="heroCarousel" 
        className="carousel slide h-100" 
        data-bs-ride="carousel" 
        data-bs-interval="5000"
        style={{ margin: 0, padding: 0 }}
        onMouseEnter={(e) => {
          const prevBtn = e.currentTarget.querySelector('.carousel-control-prev');
          const nextBtn = e.currentTarget.querySelector('.carousel-control-next');
          if (prevBtn) prevBtn.style.opacity = '1';
          if (nextBtn) nextBtn.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          const prevBtn = e.currentTarget.querySelector('.carousel-control-prev');
          const nextBtn = e.currentTarget.querySelector('.carousel-control-next');
          if (prevBtn) prevBtn.style.opacity = '0';
          if (nextBtn) nextBtn.style.opacity = '0';
        }}
      >
        <div className="carousel-inner h-100" style={{ margin: 0, padding: 0 }}>
          {/* Slide 1 */}
          <div className="carousel-item active h-100">
            <div className="hero-background w-100 h-100 position-relative" data-bg="1">
              <img 
                src={HeroBg2} 
                alt="Hero Background 1" 
                className="w-100 h-100"
                style={{
                  objectFit: 'contain',
                  backgroundColor: '#f8f9fa'
                }}
              />
            </div>
          </div>

          {/* Slide 2 */}
          <div className="carousel-item h-100">
            <div className="w-100 h-100 hero-background position-relative" data-bg="2">
              <img 
                src={HeroBg} 
                alt="Hero Background 2" 
                className="w-100 h-100"
                style={{
                  objectFit: 'contain',
                  backgroundColor: '#f8f9fa'
                }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          className="carousel-control-prev position-absolute top-50 translate-middle-y" 
          type="button" 
          data-bs-target="#heroCarousel" 
          data-bs-slide="prev"
          style={{
            opacity: 0.7,
            transition: 'all 0.3s ease',
            zIndex: 10,
            width: '45px',
            height: '45px',
            backgroundColor: '#0171BD',
            borderRadius: '50%',
            border: '2px solid white',
            boxShadow: '0 4px 12px rgba(1, 113, 189, 0.4)',
            left: '20px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.7';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <span 
            className="carousel-control-prev-icon" 
            aria-hidden="true"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'%3e%3cpath d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/%3e%3c/svg%3e\")",
              width: '20px',
              height: '20px'
            }}
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        
        <button 
          className="carousel-control-next position-absolute top-50 translate-middle-y" 
          type="button" 
          data-bs-target="#heroCarousel" 
          data-bs-slide="next"
          style={{
            opacity: 0.7,
            transition: 'all 0.3s ease',
            zIndex: 10,
            width: '45px',
            height: '45px',
            backgroundColor: '#0171BD',
            borderRadius: '50%',
            border: '2px solid white',
            boxShadow: '0 4px 12px rgba(1, 113, 189, 0.4)',
            right: '20px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.7';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <span 
            className="carousel-control-next-icon" 
            aria-hidden="true"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'%3e%3cpath d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e\")",
              width: '20px',
              height: '20px'
            }}
          ></span>
          <span className="visually-hidden">Next</span>
        </button>

        {/* Indicators */}
        <div className="carousel-indicators position-absolute bottom-0 start-50 translate-middle-x" style={{ marginBottom: '0.2rem' }}>
          <button 
            type="button" 
            data-bs-target="#heroCarousel" 
            data-bs-slide-to="0" 
            className="active" 
            aria-current="true" 
            aria-label="Slide 1"
            style={{
              width: '18px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#0171BD',
              border: 'none',
              margin: '0 5px'
            }}
          ></button>
          <button 
            type="button" 
            data-bs-target="#heroCarousel" 
            data-bs-slide-to="1" 
            aria-label="Slide 2"
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: 'none',
              margin: '0 5px'
            }}
          ></button>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;

