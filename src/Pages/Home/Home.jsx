import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faTwitter, faSnapchatGhost, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Stats from '../../Components/Stats/Stats';
import Services from '../../Components/Services/Services';
import Partners from '../../Components/Partners/Partners';
import MostBookedClinics from '../../Components/PartnersSwiper/MostBookedClinics';
import MostBookedDoctors from '../../Components/PartnersSwiper/MostBookedDoctors';
import Testimonials from '../../Components/Testimonials/Testimonials';
import AboutUs from '../../Components/AboutUs/AboutUs';
import MapSection from '../../Components/MapSection/MapSection';
import HeroBg from '../../assets/images/روتت.avif';
import HeroBg2 from '../../assets/images/attractive hero.png';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = React.useState(true);

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
      <style>{`
        .navbar, nav, .fixed-top {
          top: ${showAlert ? '46px' : '0'} !important;
          transition: top 0.3s ease !important;
        }
        body {
          padding-top: ${showAlert ? '46px' : '0'} !important;
          transition: padding-top 0.3s ease !important;
        }
        
        @media (max-width: 991.98px) {
          .navbar, nav, .fixed-top {
            top: ${showAlert ? '40px' : '0'} !important;
          }
          body {
            padding-top: ${showAlert ? '40px' : '0'} !important;
          }
        }
        
        @media (max-width: 767.98px) {
          .navbar, nav, .fixed-top {
            top: ${showAlert ? '34px' : '0'} !important;
          }
          body {
            padding-top: ${showAlert ? '34px' : '0'} !important;
          }
        }
      `}</style>

      {/* Alert */}
      {showAlert && (
        <div 
          className="mb-0 text-center home-national-alert" 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1050,
            borderRadius: 0,
            padding: '8px 12px',
            fontSize: '16px',
            backgroundColor: '#215931',
            color: '#ffffff'
          }}
        >
          <div className="container d-flex justify-content-center align-items-center" style={{ gap: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#ffffff', textAlign: 'center', flex: 1, fontSize: '16px' }}>
              عروض اليوم الوطني 95 بدأت لاتفوتك🇸🇦💚! ضبطناكم باقوى العروض على خدمات قسم الاسنان والجلدية والليزر
            </span>
            <button
              type="button"
              onClick={() => setShowAlert(false)}
              style={{
                background: 'transparent',
                border: '2px solid #ffffff',
                borderRadius: '50%',
                fontSize: '22px',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: '#ffffff',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                lineHeight: 1,
                flexShrink: 0,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#215931';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

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
      <div className="home-page book-page " style={{ paddingTop: '0', width: '100%', overflow: 'hidden', margin: 0, padding: 0 }}>
      <section className="hero-section position-relative mb-0" style={{height: '60vh', width: '100vw', marginTop: showAlert ? '208px' : '160px', transition: 'margin-top 0.3s ease', padding: 0, marginLeft: 0, marginRight: 0, left: 0, right: 0}} dir="rtl">
          <div 
            id="heroCarousel" 
            className="carousel slide h-100" 
            data-bs-ride="carousel" 
            data-bs-interval="5000"
            style={{ margin: 0, padding: 0, width: '100%' }}
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
              <div
  className="hero-background position-absolute top-0 start-0 w-100 h-100"
  style={{ 
    backgroundImage: 'url("https://media.zid.store/cdn-cgi/image/q=85,f=auto/https://media.zid.store/69733e3a-6328-43ea-90ee-cd02df32c66d/cd450c71-bf69-4fee-baf2-e7720296929c.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    opacity: 1,
    margin: 0,
    padding: 0
  }}
>

  

                  {/* <div className="hero-overlay position-relative h-100 d-flex align-items-start justify-content-end" >
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
                  </div> */}
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
                  {/* <div className="hero-overlay position-relative h-100 d-flex align-items-start justify-content-end">
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
                  </div> */}
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
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'%3e%3cpath d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/%3e%3c/svg%3e")`,
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
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'%3e%3cpath d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e")`,
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
        <div className="booking-card bg-white rounded-5 shadow-lg p-5 px-4 d-flex justify-content-between align-items-center" style={{marginBottom: '-20px' ,width: '80%',minHeight: '120px', borderRadius: '50px'}}>
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
        {/* <div className="booking-card bg-white rounded-5 shadow-lg p-5 px-4 d-flex justify-content-between align-items-center" style={{marginBottom: '-100px' ,width: '80%',minHeight: '120px', borderRadius: '50px'}}>
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
        </div> */}
       <section id="about-section" style={{ scrollMarginTop: '150px', marginTop: '48px',backgroundColor: '#fff',color: '#4A4A4A',fontWeight: '700' }}>
        <div className="container">
          <div className="d-flex flex-column align-items-center justify-content-between"> 
           <h2 className='text-center' style={{color: '#4A4A4A', fontSize: '35px'}}>مجمع غيم الطبي </h2>
           <p>يقدم مجمع غيم الطبي الخدمات العلاجية و التجميلية في تخصصات الاسنان و الجلدية و الليزر من خلال نخبة من الاستشاريين و الاخصائيين و بأعلى معايير الجودة و الاحترافية</p>
           <div className="d-flex align-items-center justify-content-center gap-4 mt-3" aria-label="روابط التواصل الاجتماعي">
             <a href="#" aria-label="TikTok" className="text-decoration-none" style={{color:'#4A4A4A'}}>
               <FontAwesomeIcon icon={faTiktok} style={{ fontSize: '34px', width: '36px', height: '36px' }} />
             </a>
             <a href="#" aria-label="Twitter" className="text-decoration-none" style={{color:'#4A4A4A'}}>
               <FontAwesomeIcon icon={faTwitter} style={{ fontSize: '34px', width: '36px', height: '36px' }} />
             </a>
             <a href="#" aria-label="Snapchat" className="text-decoration-none" style={{color:'#4A4A4A'}}>
               <FontAwesomeIcon icon={faSnapchatGhost} style={{ fontSize: '34px', width: '36px', height: '36px' }} />
             </a>
             <a href="#" aria-label="Instagram" className="text-decoration-none" style={{color:'#4A4A4A'}}>
               <FontAwesomeIcon icon={faInstagram} style={{ fontSize: '34px', width: '36px', height: '36px' }} />
             </a>
           </div>
          </div>
        </div>
       </section>
       </div>
        {/* <AboutUs /> */}

        {/* Sections Cards */}
        <section className="sections-section py-5" style={{ backgroundColor: '#F9F9F9', marginTop: '48px' }}>
          <div className="mx-auto" style={{ width: '90%' }}>
            <div className="mb-4 text-end" style={{ paddingRight: '10px' }}>
              <h2 className="m-0" style={{ color: '#484848', fontWeight: 800, fontSize: '34px' }}>الأقسام</h2>
            </div>
            <div className="position-relative">
              <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={16}
                slidesPerView={4}
                autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                navigation={{
                  nextEl: '.sections-next',
                  prevEl: '.sections-prev',
                }}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  576: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  992: { slidesPerView: 4 }
                }}
                style={{ paddingBottom: '0px' }}
              >
              <SwiperSlide>
                <div className="card border-0 shadow-sm h-100 sections-card" style={{ borderRadius: '15px', overflow: 'hidden', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.querySelector('.sections-text').style.color = '#0171BD';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = '#0171BD';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.querySelector('.sections-text').style.color = 'white';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = 'white';
                  }}
                >
                  <div className="position-relative">
                    <img 
                      src="https://media.zid.store/cdn-cgi/image/q=85,f=auto/https://media.zid.store/69733e3a-6328-43ea-90ee-cd02df32c66d/cd450c71-bf69-4fee-baf2-e7720296929c.jpg" 
                      alt="عروض ليزر الرجال" 
                      className="img-fluid w-100" 
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute bottom-0 start-0 end-0 p-3 sections-overlay" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', paddingRight: '32px !important', paddingBottom: '28px !important' }}>
                      <div className="sections-text mb-0 fw-bold text-end" style={{ fontSize: '22px', color: 'white', transition: 'color 0.3s ease' }}>
                        <div className="sections-line" style={{ width: '35px', height: '2.5px', backgroundColor: 'white', margin: '0 0 8px auto', transition: 'background-color 0.3s ease' }}></div>
                        عروض ليزر الرجال
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card border-0 shadow-sm h-100 sections-card" style={{ borderRadius: '15px', overflow: 'hidden', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.querySelector('.sections-text').style.color = '#0171BD';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = '#0171BD';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.querySelector('.sections-text').style.color = 'white';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = 'white';
                  }}
                >
                  <div className="position-relative">
                    <img 
                      src="https://media.zid.store/cdn-cgi/image/h=230,q=85,f=auto/https://media.zid.store/69733e3a-6328-43ea-90ee-cd02df32c66d/937240f5-3bb0-4658-8059-df16b88098fe-260x260.png" 
                      alt="الاسنان" 
                      className="img-fluid w-100" 
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute bottom-0 start-0 end-0 p-3 sections-overlay" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', paddingRight: '32px !important', paddingBottom: '28px !important' }}>
                      <div className="sections-text mb-0 fw-bold text-end" style={{ fontSize: '22px', color: 'white', transition: 'color 0.3s ease' }}>
                        <div className="sections-line" style={{ width: '35px', height: '2.5px', backgroundColor: 'white', margin: '0 0 8px auto', transition: 'background-color 0.3s ease' }}></div>
                        الاسنان
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card border-0 shadow-sm h-100 sections-card" style={{ borderRadius: '15px', overflow: 'hidden', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.querySelector('.sections-text').style.color = '#0171BD';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = '#0171BD';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.querySelector('.sections-text').style.color = 'white';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = 'white';
                  }}
                >
                  <div className="position-relative">
                    <img 
                      src="https://media.zid.store/cdn-cgi/image/h=230,q=85,f=auto/https://media.zid.store/69733e3a-6328-43ea-90ee-cd02df32c66d/908ea229-c828-4222-934c-ebf924c31053-260x260.png" 
                      alt="الجلدية" 
                      className="img-fluid w-100" 
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute bottom-0 start-0 end-0 p-3 sections-overlay" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', paddingRight: '32px !important', paddingBottom: '28px !important' }}>
                      <div className="sections-text mb-0 fw-bold text-end" style={{ fontSize: '22px', color: 'white', transition: 'color 0.3s ease' }}>
                        <div className="sections-line" style={{ width: '35px', height: '2.5px', backgroundColor: 'white', margin: '0 0 8px auto', transition: 'background-color 0.3s ease' }}></div>
                        الجلدية
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card border-0 shadow-sm h-100 sections-card" style={{ borderRadius: '15px', overflow: 'hidden', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.querySelector('.sections-text').style.color = '#0171BD';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = '#0171BD';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.querySelector('.sections-text').style.color = 'white';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = 'white';
                  }}
                >
                  <div className="position-relative">
                    <img 
                      src="https://media.zid.store/cdn-cgi/image/h=230,q=85,f=auto/https://media.zid.store/69733e3a-6328-43ea-90ee-cd02df32c66d/2a19fc67-b1f1-44f6-ba39-2476d48ce8d3-260x260.png" 
                      alt="عروض اليوم الوطني 95" 
                      className="img-fluid w-100" 
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute bottom-0 start-0 end-0 p-3 sections-overlay" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', paddingRight: '32px !important', paddingBottom: '28px !important' }}>
                      <div className="sections-text mb-0 fw-bold text-end" style={{ fontSize: '22px', color: 'white', transition: 'color 0.3s ease' }}>
                        <div className="sections-line" style={{ width: '35px', height: '2.5px', backgroundColor: 'white', margin: '0 0 8px auto', transition: 'background-color 0.3s ease' }}></div>
                        عروض اليوم الوطني 95
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card border-0 shadow-sm h-100 sections-card" style={{ borderRadius: '15px', overflow: 'hidden', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.querySelector('.sections-text').style.color = '#0171BD';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = '#0171BD';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.querySelector('.sections-text').style.color = 'white';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = 'white';
                  }}
                >
                  <div className="position-relative">
                    <img 
                      src="https://media.zid.store/cdn-cgi/image/h=230,q=85,f=auto/https://media.zid.store/69733e3a-6328-43ea-90ee-cd02df32c66d/7d9bcaab-f342-4dc8-96b4-927877f83cb1-260x260.png" 
                      alt="الطب العام" 
                      className="img-fluid w-100" 
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute bottom-0 start-0 end-0 p-3 sections-overlay" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', paddingRight: '32px !important', paddingBottom: '28px !important' }}>
                      <div className="sections-text mb-0 fw-bold text-end" style={{ fontSize: '22px', color: 'white', transition: 'color 0.3s ease' }}>
                        <div className="sections-line" style={{ width: '35px', height: '2.5px', backgroundColor: 'white', margin: '0 0 8px auto', transition: 'background-color 0.3s ease' }}></div>
                        الطب العام
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card border-0 shadow-sm h-100 sections-card" style={{ borderRadius: '15px', overflow: 'hidden', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.querySelector('.sections-text').style.color = '#0171BD';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = '#0171BD';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.querySelector('.sections-text').style.color = 'white';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = 'white';
                  }}
                >
                  <div className="position-relative">
                    <img 
                      src="https://media.zid.store/cdn-cgi/image/q=85,f=auto/https://media.zid.store/69733e3a-6328-43ea-90ee-cd02df32c66d/cd450c71-bf69-4fee-baf2-e7720296929c.jpg" 
                      alt="الجراحة التجميلية" 
                      className="img-fluid w-100" 
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute bottom-0 start-0 end-0 p-3 sections-overlay" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', paddingRight: '32px !important', paddingBottom: '28px !important' }}>
                      <div className="sections-text mb-0 fw-bold text-end" style={{ fontSize: '22px', color: 'white', transition: 'color 0.3s ease' }}>
                        <div className="sections-line" style={{ width: '35px', height: '2.5px', backgroundColor: 'white', margin: '0 0 8px auto', transition: 'background-color 0.3s ease' }}></div>
                        الجراحة التجميلية
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card border-0 shadow-sm h-100 sections-card" style={{ borderRadius: '15px', overflow: 'hidden', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.querySelector('.sections-text').style.color = '#0171BD';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = '#0171BD';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.querySelector('.sections-text').style.color = 'white';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = 'white';
                  }}
                >
                  <div className="position-relative">
                    <img 
                      src="https://media.zid.store/cdn-cgi/image/q=85,f=auto/https://media.zid.store/69733e3a-6328-43ea-90ee-cd02df32c66d/cd450c71-bf69-4fee-baf2-e7720296929c.jpg" 
                      alt="العناية بالبشرة" 
                      className="img-fluid w-100" 
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute bottom-0 start-0 end-0 p-3 sections-overlay" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', paddingRight: '32px !important', paddingBottom: '28px !important' }}>
                      <div className="sections-text mb-0 fw-bold text-end" style={{ fontSize: '22px', color: 'white', transition: 'color 0.3s ease' }}>
                        <div className="sections-line" style={{ width: '35px', height: '2.5px', backgroundColor: 'white', margin: '0 0 8px auto', transition: 'background-color 0.3s ease' }}></div>
                        العناية بالبشرة
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card border-0 shadow-sm h-100 sections-card" style={{ borderRadius: '15px', overflow: 'hidden', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.querySelector('.sections-text').style.color = '#0171BD';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = '#0171BD';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.querySelector('.sections-text').style.color = 'white';
                    e.currentTarget.querySelector('.sections-line').style.backgroundColor = 'white';
                  }}
                >
                  <div className="position-relative">
                    <img 
                      src="https://media.zid.store/cdn-cgi/image/q=85,f=auto/https://media.zid.store/69733e3a-6328-43ea-90ee-cd02df32c66d/cd450c71-bf69-4fee-baf2-e7720296929c.jpg" 
                      alt="ليزر الشعر" 
                      className="img-fluid w-100" 
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute bottom-0 start-0 end-0 p-3 sections-overlay" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', paddingRight: '32px !important', paddingBottom: '28px !important' }}>
                      <div className="sections-text mb-0 fw-bold text-end" style={{ fontSize: '22px', color: 'white', transition: 'color 0.3s ease' }}>
                        <div className="sections-line" style={{ width: '35px', height: '2.5px', backgroundColor: 'white', margin: '0 0 8px auto', transition: 'background-color 0.3s ease' }}></div>
                        ليزر الشعر
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              </Swiper>
              
              {/* Navigation Buttons */}
              <button className="sections-prev position-absolute top-50 start-0 translate-middle-y" 
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <span 
                  className="carousel-control-prev-icon" 
                  aria-hidden="true"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23666'%3e%3cpath d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/%3e%3c/svg%3e")`,
                    width: '30px',
                    height: '30px',
                    backgroundSize: '30px 30px',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}
                ></span>
              </button>
              
              <button className="sections-next position-absolute top-50 end-0 translate-middle-y" 
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <span 
                  className="carousel-control-next-icon" 
                  aria-hidden="true"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23666'%3e%3cpath d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e")`,
                    width: '30px',
                    height: '30px',
                    backgroundSize: '30px 30px',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}
                ></span>
              </button>
            </div>
          </div>
        </section>

        <div id="services-section" style={{ scrollMarginTop: '150px', marginTop: '48px' }}>
        <Services />
      </div>
      {/* <Stats /> */}
      
      {/* <MostBookedDoctors /> */}
      <Testimonials />
      <MapSection />
      </>
    );
}



