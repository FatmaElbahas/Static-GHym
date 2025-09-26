import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Stats from '../../Components/Stats/Stats';
import Services from '../../Components/Services/Services';
import Partners from '../../Components/Partners/Partners';
import MostBookedClinics from '../../Components/PartnersSwiper/MostBookedClinics';
import MostBookedDoctors from '../../Components/PartnersSwiper/MostBookedDoctors';
import Testimonials from '../../Components/Testimonials/Testimonials';
import AboutUs from '../../Components/AboutUs/AboutUs';
import MapSection from '../../Components/MapSection/MapSection';
import HeroBg from '../../assets/images/heropage.png';
import HeroBg2 from '../../assets/images/attractive hero.png';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  // دالة للتحقق من حالة تسجيل الدخول
  const handleBookingClick = (e) => {
    e.preventDefault();
    
    // التحقق من وجود token في localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      // المستخدم مسجل دخول - التوجيه للداشبورد
      navigate('/dashboard');
    } else {
      // المستخدم غير مسجل دخول - التوجيه لصفحة تسجيل الدخول
      navigate('/login');
    }
  };

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
 <title>غيم | ghaim</title>
  <meta name="description" content="مركز غيم الطبي يقدم خدمات طبية متطورة وعلاجات جلدية متخصصة. احجز موعدك الآن واستفد من خدماتنا المتميزة" />
  <meta name="keywords" content="مركز طبي, خدمات جلدية, علاجات طبية, حجز موعد, غيم, صحة" />

  {/* OG tags */}
  <meta property="og:title" content="غيم | ghaim" />
  <meta property="og:description" content="مركز غيم الطبي يقدم خدمات طبية متطورة وعلاجات جلدية متخصصة" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://cdn.salla.sa/axjgg/fniOf3POWAeIz8DXX8oPcxjNgjUHvLeqHDdhtDAK.png" />

  {/* Favicon */}
  <link rel="icon" type="image/png" href="https://cdn.salla.sa/axjgg/fniOf3POWAeIz8DXX8oPcxjNgjUHvLeqHDdhtDAK.png" />
</Helmet>
      <div className="home-page book-page " style={{ paddingTop: '0' }}>
      <section className="hero-section position-relative mb-0" style={{height: '60vh', width: '100vw', marginLeft: 'calc(-50vw + 50%)'}} dir="rtl">
          <div id="heroCarousel" className="carousel slide h-100" data-bs-ride="carousel" data-bs-interval="5000">
            <div className="carousel-inner h-100">

              {/* Slide 1 */}
              <div className="carousel-item active h-100">
  <div
    className="hero-background"
    style={{ backgroundImage: `url(${HeroBg})` }}
  >

  

                  <div className="hero-overlay position-relative h-100 d-flex align-items-start justify-content-end" >
                    <div className="hero-text" style={{ paddingTop: '8%', paddingRight:'15%' }}>
                      <h1 className="brand-name fw-bold mb-3" style={{ 
                        fontSize: window.innerWidth < 768 ? '2rem' : '3.5rem', 
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)', 
                        color: '#ffffff',
                        lineHeight: '1.2'
                      }}>
                        احجز موعدك بسهولة
                      </h1>
                      <p className="text-light fs-5 fw-medium pe-0" style={{ 
                        maxWidth: '500px',
                        fontSize: window.innerWidth < 768 ? '1rem' : '1.25rem'
                      }}>
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
                    <div className="hero-text" style={{ paddingTop: '8%', paddingRight:'15%' }}>
                      <h1 className="brand-name fw-bold mb-3" style={{ 
                        fontSize: window.innerWidth < 768 ? '2rem' : '3.5rem', 
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)', 
                        color: '#ffffff',
                        lineHeight: '1.2'
                      }}>
                        الرعاية الطبية التي تستحقها
                      </h1>
                      <p className="text-light fs-5 fw-medium pe-0" style={{ 
                        maxWidth: '500px',
                        fontSize: window.innerWidth < 768 ? '1rem' : '1.25rem'
                      }}>
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
        <div className="booking-card bg-white rounded-5 shadow-lg p-5 px-4 d-flex justify-content-between align-items-center" style={{marginBottom: '-100px' ,width: '80%',minHeight: '120px', borderRadius: '50px'}}>
          <div className="container-fluid">
            <div className="booking-content d-flex align-items-center gap-4">
              <div className="booking-icon flex-shrink-0">
                <i className="fas fa-calendar-alt fs-1 color-main"></i>
              </div>
              <div className="booking-text flex-grow-1 text-end">
                <div className="question-container rounded-3 p-3 mb-2">
                  <h3 className="booking-question fw-bold mb-0" style={{
                    color: '#000000',
                    fontSize: window.innerWidth < 768 ? '1.5rem' : '2.2rem'
                  }}>خدمات غيم</h3>
                </div>
                <p className="booking-description text-muted fw-bold mb-0 text-nowrap" style={{
                  fontSize: window.innerWidth < 768 ? '0.9rem' : '1.25rem'
                }}>احجز موعدك لدى <span style={{color: '#0d78c0', fontWeight: '900'}}>خدمات غيم</span> بخطوات بسيطة....</p>
              </div>
              <div className="booking-button flex-shrink-0">
                <button 
                  onClick={handleBookingClick}
                  className="btn rounded-pill fw-bold" 
                  style={{
                    backgroundColor: '#0d78c0', 
                    borderColor: '#0d78c0', 
                    color: 'white',
                    fontSize: window.innerWidth < 768 ? '1.1rem' : '1.4rem',
                    padding: window.innerWidth < 768 ? '0.6rem 1.5rem' : '0.8rem 2.5rem',
                    fontWeight: '900',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.color = '#0d78c0';
                    e.target.style.borderColor = '#0d78c0';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#0d78c0';
                    e.target.style.color = 'white';
                    e.target.style.borderColor = '#0d78c0';
                  }}>
                  احجز الآن
                </button>
              </div>
            </div>
          </div>
        </div>
        <AboutUs />

        <div id="services-section" style={{ scrollMarginTop: '150px', marginTop: '48px' }}>
        <Services />
      </div>
      <Stats />
      
      <MostBookedDoctors />
      <Testimonials />
      <MapSection />
    </div>
    </>
  );
}



