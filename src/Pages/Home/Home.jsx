import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import Services from '../../Components/Services/Services';
import Testimonials from '../../Components/Testimonials/Testimonials';
import MapSection from '../../Components/MapSection/MapSection';
import NationalAlert from '../../Components/Home/NationalAlert';
import HeroCarousel from '../../Components/Home/HeroCarousel';
import BookingCard from '../../Components/Home/BookingCard';
import AboutSection from '../../Components/Home/AboutSection';
import SectionsCarousel from '../../Components/Home/SectionsCarousel';

export default function Home() {
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(true);

  // Handle smooth scrolling to sections
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      {/* Dynamic styles for navbar and sections positioning */}
      <style>{`
        .navbar, nav, .fixed-top {
          top: ${showAlert ? '46px' : '0'} !important;
          transition: top 0.3s ease !important;
        }
        body {
          padding-top: 0 !important;
          transition: padding-top 0.3s ease !important;
        }
        
        .home-page {
          position: relative;
        }
        
        .home-page .hero-section {
          margin-top: ${showAlert ? '46px' : '0'} !important;
          transition: margin-top 0.3s ease !important;
        }
        
        .home-page section {
          clear: both;
          position: relative;
        }
        
        .booking-card {
          box-sizing: border-box;
        }
        
        @media (max-width: 991.98px) and (min-width: 769px) {
          .home-page .hero-section {
            margin-top: 0 !important;
          }
        }
        
        @media (max-width: 991.98px) {
          .navbar, nav, .fixed-top {
            top: ${showAlert ? '40px' : '0'} !important;
          }
          body {
            padding-top: 0 !important;
          }
        }
        
        @media (max-width: 767.98px) {
          .navbar, nav, .fixed-top {
            top: ${showAlert ? '34px' : '0'} !important;
          }
          body {
            padding-top: 0 !important;
          }
          .home-page .hero-section {
            margin-top: ${showAlert ? '34px' : '0'} !important;
          }
          
          .booking-card {
            max-width: 95% !important;
          }
          
          .sections-section {
            padding-top: 30px !important;
            padding-bottom: 30px !important;
          }
        }
      `}</style>

      {/* SEO Meta Tags */}
      <Helmet>
        <title>غيم | ghaim</title>
        <meta name="description" content="مركز غيم الطبي يقدم خدمات طبية متطورة وعلاجات جلدية متخصصة. احجز موعدك الآن واستفد من خدماتنا المتميزة" />
        <meta name="keywords" content="مركز طبي, خدمات جلدية, علاجات طبية, حجز موعد, غيم, صحة" />

        {/* Open Graph tags */}
        <meta property="og:title" content="غيم | ghaim" />
        <meta property="og:description" content="مركز غيم الطبي يقدم خدمات طبية متطورة وعلاجات جلدية متخصصة" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://cdn.salla.sa/axjgg/fniOf3POWAeIz8DXX8oPcxjNgjUHvLeqHDdhtDAK.png" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="https://cdn.salla.sa/axjgg/fniOf3POWAeIz8DXX8oPcxjNgjUHvLeqHDdhtDAK.png" />
      </Helmet>

      {/* National Day Alert */}
      <NationalAlert showAlert={showAlert} onClose={() => setShowAlert(false)} />

      {/* Main Content */}
      <div className="home-page book-page" style={{ paddingTop: '0', width: '100%', margin: 0, padding: 0 }}>
        
        {/* Hero Carousel Section */}
        <HeroCarousel />
        
        {/* Booking Card Section */}
        <BookingCard />
        
        {/* About Section */}
        <AboutSection />

        {/* Sections Carousel */}
        <SectionsCarousel />

        {/* Services Section */}
        <div id="services-section" style={{ scrollMarginTop: '150px', marginTop: '60px', marginBottom: '60px' }}>
          <Services />
        </div>
        
        {/* Testimonials Section */}
        <div style={{ marginTop: '60px', marginBottom: '60px' }}>
          <Testimonials />
        </div>
        
        {/* Map Section */}
        <div style={{ marginTop: '60px', marginBottom: '40px' }}>
          <MapSection />
        </div>
      </div>
    </>
  );
}
