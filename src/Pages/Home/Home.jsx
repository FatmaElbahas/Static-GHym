import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Stats from '../../Components/Stats/Stats';
import Services from '../../Components/Services/Services';
import ImageSwiper from '../../Components/ImageSwiper/ImageSwiper';
import Logo from '../../assets/images/Logo.png';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>بلسمي | blsmy</title>
        <meta name="description" content="مركز بلسمي الطبي يقدم خدمات طبية متطورة وعلاجات جلدية متخصصة. احجز موعدك الآن واستفد من خدماتنا المتميزة" />
        <meta name="keywords" content="مركز طبي, خدمات جلدية, علاجات طبية, حجز موعد, بلسمي, صحة" />
        <meta property="og:title" content="بلسمي | blsmy" />
        <meta property="og:description" content="مركز بلسمي الطبي يقدم خدمات طبية متطورة وعلاجات جلدية متخصصة" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="home-page">
      <section className="hero-section position-relative min-vh-100 overflow-hidden">
        <div className="hero-background position-absolute top-0 start-0 w-100 h-50">
          <div className="hero-overlay position-relative h-100 d-flex align-items-center justify-content-start pe-5">
            <div className="hero-text text-end">
              <div className="d-flex align-items-center justify-content-end mb-3">
                <img src={Logo} alt="بلسمي" className="logo-img me-3" style={{height: '80px', width: 'auto'}} />
                <h1 className="brand-name color-main display-1 fw-bold mb-0">بلسمي</h1>
              </div>
              <p className="brand-tagline fs-4 text-secondary mb-0">منصتك ... لحلول صحية ذكية</p>
            </div>
          </div>
        </div>
        
        <div className="booking-card bg-white rounded-4 shadow-lg p-4">
          <div className="container-fluid">
            <div className="booking-content d-flex align-items-center gap-4">
              <div className="booking-icon flex-shrink-0">
                <i className="fas fa-calendar-alt fs-1 color-main"></i>
              </div>
              <div className="booking-text flex-grow-1 text-end">
                <div className="question-container bg-light rounded-3 p-3 mb-2">
                  <h3 className="booking-question fs-3 fw-bold mb-0" style={{color: '#00a8b0'}}>هل ترغب بحجز موعد ؟</h3>
                </div>
                <p className="booking-description fs-5 text-muted fw-bold mb-0">احجز موعدك لدى إحدى المراكز بخطوات بسيطة....</p>
              </div>
              <div className="booking-button flex-shrink-0">
                <Link to="/offers" className="btn btn-lg px-4 py-3 rounded-pill fw-bold" style={{backgroundColor: 'var(--color-main)', borderColor: 'var(--color-main)', color: 'white'}}>
                  احجز الآن
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Stats />
      <Services />
      <ImageSwiper />
    </div>
    </>
  );
}



