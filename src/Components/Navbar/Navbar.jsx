import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import DropdownWithState from "../DropDownMenue/DropDownMenue";
import CenterServicesDropdown from "../CenterServicesDropdown/CenterServicesDropdown";

const logo = "https://cdn.salla.sa/axjgg/fniOf3POWAeIz8DXX8oPcxjNgjUHvLeqHDdhtDAK.png";

function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inServicesSection, setInServicesSection] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // يقفل المنيو بعد ما اختار لينك
  const handleClose = () => setIsOpen(false);

  // تحقق من حالة تسجيل الدخول
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);

    // استمع لتغييرات في localStorage
    const handleStorageChange = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // استمع لتسجيل الدخول من نفس التبويب
    window.addEventListener('loginSuccess', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginSuccess', handleStorageChange);
    };
  }, []);

  // تحديد التبويب النشط داخل الصفحة الرئيسية عند التمرير
  useEffect(() => {
    const checkInServices = () => {
      // مفعّل فقط في الصفحة الرئيسية
      if (location.pathname !== '/') {
        setInServicesSection(false);
        return;
      }
      const section = document.getElementById('services-section');
      const navbar = document.querySelector('.navbar');
      if (!section || !navbar) {
        setInServicesSection(false);
        return;
      }
      const rect = section.getBoundingClientRect();
      const navH = navbar.offsetHeight || 0;
      // اعتبر القسم نشِط إذا كان أعلاه صعد تحت النافبار وأسفله مازال ظاهر
      const thresholdTop = navH + 10;
      const isActive = rect.top <= thresholdTop && rect.bottom > thresholdTop;
      setInServicesSection(isActive);
    };

    // افحص عند التحميل والتمرير وتغيير الحجم وتغيير العنوان
    checkInServices();
    window.addEventListener('scroll', checkInServices, { passive: true });
    window.addEventListener('resize', checkInServices);
    window.addEventListener('hashchange', checkInServices);
    return () => {
      window.removeEventListener('scroll', checkInServices);
      window.removeEventListener('resize', checkInServices);
      window.removeEventListener('hashchange', checkInServices);
    };
  }, [location]);

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/');
    handleClose();
  };

  // الذهاب للداشبورد
  const handleDashboard = () => {
    navigate('/dashboard');
    handleClose();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm mb-0 mb-md-0 mb-lg-0">
      <div className="container">
        {/* التقسيم الأول: اللوجو */}
        <div className="navbar-brand-section">
          <NavLink to="/" className="navbar-brand">
            <img src={logo} alt="Logo" className="img-fluid navbar-logo" />
          </NavLink>
        </div>

        {/* التقسيم الثاني: الروابط */}
        <div className="navbar-links-section">
          <div
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            id="navbarContent"
          >
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/"
                  onClick={handleClose}
                  className={() =>
                    location.pathname === '/' && !(inServicesSection || location.hash === '#services-section') ? "activeLink nav-link" : "nav-link"
                  }
                >
                  الرئيسية
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/book"
                  onClick={handleClose}
                  className={({ isActive }) =>
                    isActive ? "activeLink nav-link" : "nav-link"
                  }
                >
                  احجز موعد
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/#services-section"
                  onClick={handleClose}
                  className={() =>
                    location.pathname === '/' && (inServicesSection || location.hash === '#services-section') ? "activeLink nav-link" : "nav-link"
                  }
                >
                  الخدمات
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/contact"
                  onClick={handleClose}
                  className={({ isActive }) =>
                    isActive ? "activeLink nav-link" : "nav-link"
                  }
                >
                  تواصل معنا
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* التقسيم الثالث: زر تسجيل الدخول */}
        <div className="navbar-login-section">
          {isLoggedIn ? (
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={handleDashboard}
                className="btn btn-primary rounded-pill px-4 py-2 fw-bold"
                style={{
                  backgroundColor: '#0d78c0', 
                  borderColor: '#0d78c0', 
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#0d78c0';
                  e.target.style.color = '#0d78c0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#0d78c0';
                  e.target.style.borderColor = '#0d78c0';
                  e.target.style.color = 'white';
                }}
              >
                لوحة التحكم
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-outline-primary rounded-pill px-3 py-2"
                title="تسجيل الخروج"
                style={{
                  borderColor: '#0d78c0',
                  color: '#0d78c0',
                  backgroundColor: 'transparent',
                  fontSize: '1rem',
                  transform: 'scaleX(-1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#0d78c0';
                  e.target.style.borderColor = '#0d78c0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#0d78c0';
                  e.target.style.borderColor = '#0d78c0';
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              onClick={handleClose}
              className="btn btn-primary rounded-pill px-4 py-2 fw-bold"
              style={{
                backgroundColor: '#0d78c0', 
                borderColor: '#0d78c0', 
                color: 'white',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = '#0d78c0';
                e.target.style.color = '#0d78c0';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#0d78c0';
                e.target.style.borderColor = '#0d78c0';
                e.target.style.color = 'white';
              }}
            >
              تسجيل الدخول
            </NavLink>
          )}
        </div>

        {/* زر الهامبرجر للموبايل */}
        <button
          className="navbar-toggler border-0 d-lg-none"
          type="button"
          aria-controls="navbarContent"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>

      {/* CSS للتخطيط */}
      <style>{`
        .navbar .container {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          align-items: center;
          gap: 2rem;
          width: 80%;
          padding-left: calc(var(--bs-gutter-x) * .5);
          padding-right: calc(var(--bs-gutter-x) * .5);
        }
        
        .navbar-brand-section {
          justify-self: start;
        }
        
        .navbar-links-section {
          justify-self: center;
        }
        
        .navbar-login-section {
          justify-self: end;
        }
        
        /* تكبير اللوجو */
        .navbar-brand img {
          max-height: 70px !important;
          width: auto !important;
          transition: all 0.3s ease !important;
          object-fit: contain !important;
        }
        
        /* تكبير أزرار تسجيل الدخول */
        .navbar .btn {
          font-size: 1.1rem !important;
          padding: 0.6rem 1.5rem !important;
        }
        
        /* إلغاء تأثير الهافر لأيقونة تسجيل الخروج */
        .navbar .btn-outline-primary:hover {
          background-color: transparent !important;
          border-color: #0d78c0 !important;
          color: #0d78c0 !important;
        }
        
        /* تنسيق الروابط النشطة */
        .navbar .activeLink {
          color: #0d78c0 !important;
          font-weight: 900 !important;
          background: none !important;
          background-color: transparent !important;
          position: relative;
        }
        
        /* ضمان اللون الأساسي للروابط النشطة */
        .navbar .nav-link.activeLink {
          color: #0d78c0 !important;
          font-weight: 900 !important;
        }
        
        
        .navbar .nav-link {
          color: #333;
          font-weight: 500;
          font-size: 1.1rem;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease;
          background: none;
          background-color: transparent;
        }
        
        .navbar .nav-link:hover {
          color: #0d78c0;
          background: none;
          background-color: transparent;
        }
        
        /* إزالة أي خلفية من Bootstrap */
        .navbar .nav-link.activeLink,
        .navbar .nav-link.activeLink:hover,
        .navbar .nav-link.activeLink:focus,
        .navbar .nav-link.activeLink:active {
          background: none !important;
          background-color: transparent !important;
          background-image: none !important;
          color: #0d78c0 !important;
          font-weight: 900 !important;
        }
        
        @media (max-width: 1200px) {
          .navbar .container {
            width: 85%;
          }
        }
        
        @media (max-width: 992px) {
          .navbar .container {
            grid-template-columns: 1fr auto auto;
            gap: 1rem;
            width: 95%;
          }
          
          .navbar-links-section {
            justify-self: stretch;
            grid-column: 1 / -1;
            order: 3;
          }
        }
        
        @media (max-width: 768px) {
          .navbar .container {
            width: 95%;
          }
        }
        
        @media (max-width: 576px) {
          .navbar .container {
            width: 98%;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </nav>
  );
}

export default MainNavbar;