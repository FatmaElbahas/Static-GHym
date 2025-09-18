import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import Stats from '../../Components/Stats/Stats';
import Services from '../../Components/Services/Services';
import Partners from '../../Components/Partners/Partners';
import MostBookedClinics from '../../Components/PartnersSwiper/MostBookedClinics';
import MostBookedDoctors from '../../Components/PartnersSwiper/MostBookedDoctors';
import Testimonials from '../../Components/Testimonials/Testimonials';
import Logo from '../../assets/images/Logo.png';
import HeroBg from '../../assets/images/hero-bg.ab3138f8.webp';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // تأخير بسيط حتى يتأكد من رسم العناصر
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);
  return (
    <>
      <Helmet>
        <title>غنيم | ghanim</title>
        <meta name="description" content="مركز غنيم الطبي يقدم خدمات طبية متطورة وعلاجات جلدية متخصصة. احجز موعدك الآن واستفد من خدماتنا المتميزة" />
        <meta name="keywords" content="مركز طبي, خدمات جلدية, علاجات طبية, حجز موعد, غنيم, صحة" />
        <meta property="og:title" content="غنيم | ghanim" />
        <meta property="og:description" content="مركز غنيم الطبي يقدم خدمات طبية متطورة وعلاجات جلدية متخصصة" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="home-page book-page ">
      <section className="hero-section position-relative mb-0" style={{height: '60vh'}} dir="rtl">
          <div id="heroCarousel" className="carousel slide h-100" data-bs-ride="carousel" data-bs-interval="5000">
            <div className="carousel-inner h-100">

              {/* Slide 1 */}
              <div className="carousel-item active h-100">
                <div
                  className="hero-background position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    backgroundImage: `url(${HeroBg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                  }}
                >
                  <div className="hero-overlay position-relative h-100 d-flex align-items-start justify-content-end">
                    <div className="hero-text " style={{ paddingTop: '8%', paddingRight:'15%' }}>
                      <h1 className="brand-name color-main fw-bold mb-3" style={{ fontSize: '3.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                        احجز موعدك بسهولة
                      </h1>
                      <p className="text-white fs-5 fw-medium pe-0" style={{ maxWidth: '500px' }}>
                        فريقنا الطبي المتخصص في خدمتك على مدار الساعة
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide 2 */}
              <div className="carousel-item h-100">
                <div
                  className="hero-background position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    backgroundImage: `url(${HeroBg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                  }}
                >
                  <div className="hero-overlay position-relative h-100 d-flex align-items-start justify-content-end">
                    <div className="hero-text " style={{ paddingTop: '8%',  paddingRight:'15%'  }}>
                      <h1 className="brand-name color-main fw-bold mb-3" style={{ fontSize: '3.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                        دكاتره متميزة ورائدة
                      </h1>
                      <p className="text-white fs-5 fw-medium pe-0" style={{ maxWidth: '500px' }}>
                        احصلي على أفضل رعاية صحية مع أحدث الأجهزة الطبية والخبرة الممتازة
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

           

            {/* Indicators */}
            <div className="carousel-indicators position-absolute bottom-0 start-50 translate-middle-x mb-3">
              <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active bg-main" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            </div>
          </div>
          {/* <div className="booking-card bg-white rounded-4 shadow-lg p-4">
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
        </div> */}
        </section>
        <div className="booking-card bg-white rounded-5 shadow-lg p-5" style={{marginBottom: '-80px' ,width: '80%',minHeight: '120px'}}>
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
                <Link to="/offers" className="btn btn-lg px-4 py-2 rounded-pill fw-bold" style={{backgroundColor: 'var(--color-main)', borderColor: 'var(--color-main)', color: 'white'}}>
                  احجز الآن
                </Link>
              </div>
            </div>
          </div>
        </div>
      <Stats />
      <div id="services-section" style={{ scrollMarginTop: '100px' }}>
        <Services />
      </div>
      <Partners />
      <MostBookedClinics />
      <MostBookedDoctors />
      <Testimonials />
    </div>
    </>
  );
}



