import React, { useState, useEffect, useCallback, useMemo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faBoxOpen, faListAlt, faHome, faCalendarAlt, faEnvelope, faShieldAlt, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import menuIcon from '../../assets/images/menu.png';

const logo = "https://cdn.salla.sa/axjgg/fniOf3POWAeIz8DXX8oPcxjNgjUHvLeqHDdhtDAK.png";

function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // تحقق من حالة تسجيل الدخول
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);

    const handleStorageChange = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // إغلاق السايد بار عند تغيير الصفحة
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // إغلاق السايد بار عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !showSubMenu && !e.target.closest('.sidebar-menu') && !e.target.closest('.burger-btn')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, showSubMenu]);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // تسجيل الخروج
  const handleLogout = useCallback(() => {
    // Remove all auth-related items
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear session storage
    sessionStorage.clear();
    
    // Update state
    setIsLoggedIn(false);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('logout'));
    
    // Navigate to home
    navigate('/');
    setIsOpen(false);
  }, [navigate]);

  // أنماط السايد بار
  const sidebarStyles = useMemo(() => ({
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9998,
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transition: 'opacity 0.3s ease, visibility 0.3s ease'
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      right: isOpen ? 0 : '-100%',
      width: '300px',
      maxWidth: '85%',
      height: '100vh',
      backgroundColor: '#ffffff',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fbfd 100%)',
      zIndex: 9999,
      overflowY: 'auto',
      transition: 'right 0.3s ease',
      boxShadow: '-4px 0 20px rgba(1, 113, 189, 0.1)',
      borderLeft: '3px solid #0171BD'
    }
  }), [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div style={sidebarStyles.overlay} onClick={() => setIsOpen(false)} />

      {/* Sidebar Menu */}
      <div className="sidebar-menu" style={sidebarStyles.sidebar}>
        <div style={{ padding: '1.5rem' }}>
          {/* Menu Items */}
          <div className="d-flex flex-column gap-1">
            {/* الصفحة الرئيسية */}
            <NavLink
              to="/"
              className="d-flex align-items-center gap-3 text-decoration-none"
              style={{
                borderRadius: '10px',
                backgroundColor: '#f0f7fc',
                color: '#2c3e50',
                fontSize: '18px',
                fontWeight: '500',
                padding: '0.6rem 1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e3f2fd';
                e.currentTarget.style.transform = 'translateX(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f7fc';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <FontAwesomeIcon icon={faHome} style={{ fontSize: '20px', color: '#0171BD' }} />
              <span>الصفحة الرئيسية</span>
            </NavLink>
            
            {/* تسجيل دخول أو لوحة التحكم */}
            {isLoggedIn ? (
              <>
                {/* لوحة التحكم */}
                <NavLink
                  to="/dashboard"
                  className="d-flex align-items-center gap-3 text-decoration-none"
                  style={{
                    borderRadius: '10px',
                    backgroundColor: '#f0f7fc',
                    color: '#2c3e50',
                    fontSize: '18px',
                    fontWeight: '500',
                    padding: '0.6rem 1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e3f2fd';
                    e.currentTarget.style.transform = 'translateX(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f7fc';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px', color: '#0171BD' }} />
                  <span>لوحة التحكم</span>
                </NavLink>
                
                {/* تسجيل الخروج */}
                <button
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-3 text-decoration-none w-100"
                  style={{
                    borderRadius: '10px',
                    backgroundColor: '#f0f7fc',
                    color: '#0171BD',
                    fontSize: '18px',
                    fontWeight: '500',
                    padding: '0.6rem 1rem',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'right'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e3f2fd';
                    e.currentTarget.style.transform = 'translateX(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f7fc';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <FontAwesomeIcon 
                    icon={faSignOutAlt} 
                    style={{ 
                      fontSize: '20px', 
                      color: '#0171BD',
                      transform: 'scaleX(-1)' // عكس اتجاه الأيقونة
                    }} 
                  />
                  <span>تسجيل الخروج</span>
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="d-flex align-items-center gap-3 text-decoration-none"
                style={{
                  borderRadius: '10px',
                  backgroundColor: '#f0f7fc',
                  color: '#2c3e50',
                  fontSize: '18px',
                  fontWeight: '500',
                  padding: '0.6rem 1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e3f2fd';
                  e.currentTarget.style.transform = 'translateX(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f7fc';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px', color: '#0171BD' }} />
                <span>تسجيل دخول</span>
              </NavLink>
            )}

            {/* حجز موعد */}
            <NavLink
              to="/book"
              className="d-flex align-items-center gap-3 text-decoration-none"
              style={{
                borderRadius: '10px',
                backgroundColor: '#f0f7fc',
                color: '#2c3e50',
                fontSize: '18px',
                fontWeight: '500',
                padding: '0.6rem 1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e3f2fd';
                e.currentTarget.style.transform = 'translateX(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f7fc';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '20px', color: '#0171BD' }} />
              <span>حجز موعد</span>
            </NavLink>

            {/* تواصل معنا */}
            <NavLink
              to="/contact"
              className="d-flex align-items-center gap-3 text-decoration-none"
              style={{
                borderRadius: '10px',
                backgroundColor: '#f0f7fc',
                color: '#2c3e50',
                fontSize: '18px',
                fontWeight: '500',
                padding: '0.6rem 1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e3f2fd';
                e.currentTarget.style.transform = 'translateX(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f7fc';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '20px', color: '#0171BD' }} />
              <span>تواصل معنا</span>
            </NavLink>

            <hr style={{ margin: '0.8rem 0', borderColor: '#e3f2fd' }} />

            {/* جميع الخدمات */}
            <NavLink
              to="/products"
              className="d-flex align-items-center gap-3 text-decoration-none"
              style={{
                borderRadius: '10px',
                backgroundColor: '#f0f7fc',
                color: '#2c3e50',
                fontSize: '18px',
                fontWeight: '500',
                padding: '0.6rem 1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e3f2fd';
                e.currentTarget.style.transform = 'translateX(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f7fc';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: '20px', color: '#0171BD' }} />
              <span>جميع الخدمات</span>
            </NavLink>

            {/* جميع التصنيفات */}
            <div
              className="d-flex align-items-center gap-3"
              style={{
                borderRadius: '10px',
                backgroundColor: '#f0f7fc',
                color: '#2c3e50',
                fontSize: '18px',
                fontWeight: '500',
                padding: '0.6rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e3f2fd';
                e.currentTarget.style.transform = 'translateX(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f7fc';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <FontAwesomeIcon icon={faListAlt} style={{ fontSize: '20px', color: '#0171BD' }} />
              <span>جميع التصنيفات</span>
            </div>

          </div>
        </div>
      </div>

      {/* Submenu - روابط مهمة */}
      {showSubMenu && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10000,
              opacity: 1,
              visibility: 'visible'
            }} 
            onClick={() => setShowSubMenu(false)}
          />
          
          <div 
            className="sidebar-submenu" 
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '300px',
              maxWidth: '85%',
              height: '100vh',
              backgroundColor: '#ffffff',
              background: 'linear-gradient(180deg, #ffffff 0%, #f8fbfd 100%)',
              zIndex: 10001,
              overflowY: 'auto',
              transition: 'right 0.3s ease',
              boxShadow: '-4px 0 20px rgba(1, 113, 189, 0.1)',
              borderLeft: '3px solid #0171BD'
            }}
          >
            <div style={{ padding: '1.5rem' }}>
              {/* زر الرجوع */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSubMenu(false);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#484848'
                }}
              >
                → الرجوع
              </button>

              {/* العنوان */}
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                marginBottom: '1.5rem',
                textAlign: 'center',
                color: '#484848'
              }}>
                روابط مهمة
              </h3>

              {/* قائمة الروابط */}
              <div className="d-flex flex-column gap-1">
                <NavLink
                  to="/"
                  onClick={() => setShowSubMenu(false)}
                  className="d-flex align-items-center gap-3 text-decoration-none"
                  style={{
                    borderRadius: '10px',
                    backgroundColor: '#f0f7fc',
                    color: '#2c3e50',
                    fontSize: '18px',
                    fontWeight: '500',
                    padding: '0.6rem 1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e3f2fd';
                    e.currentTarget.style.transform = 'translateX(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f7fc';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <FontAwesomeIcon icon={faShieldAlt} style={{ fontSize: '20px', color: '#0171BD' }} />
                  <span>سياسة الخصوصية</span>
                </NavLink>

                <NavLink
                  to="/contact"
                  onClick={() => setShowSubMenu(false)}
                  className="d-flex align-items-center gap-3 text-decoration-none"
                  style={{
                    borderRadius: '10px',
                    backgroundColor: '#f0f7fc',
                    color: '#2c3e50',
                    fontSize: '18px',
                    fontWeight: '500',
                    padding: '0.6rem 1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e3f2fd';
                    e.currentTarget.style.transform = 'translateX(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f7fc';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '20px', color: '#0171BD' }} />
                  <span>تواصل معنا</span>
                </NavLink>

                <NavLink
                  to="/"
                  onClick={() => setShowSubMenu(false)}
                  className="d-flex align-items-center gap-3 text-decoration-none"
                  style={{
                    borderRadius: '10px',
                    backgroundColor: '#f0f7fc',
                    color: '#2c3e50',
                    fontSize: '18px',
                    fontWeight: '500',
                    padding: '0.6rem 1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e3f2fd';
                    e.currentTarget.style.transform = 'translateX(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f7fc';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <FontAwesomeIcon icon={faMapMarkedAlt} style={{ fontSize: '20px', color: '#0171BD' }} />
                  <span>خريطة الموقع</span>
                </NavLink>

                <NavLink
                  to="/book"
                  onClick={() => setShowSubMenu(false)}
                  className="d-flex align-items-center gap-3 text-decoration-none"
                  style={{
                    borderRadius: '10px',
                    backgroundColor: '#f0f7fc',
                    color: '#2c3e50',
                    fontSize: '18px',
                    fontWeight: '500',
                    padding: '0.6rem 1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e3f2fd';
                    e.currentTarget.style.transform = 'translateX(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f7fc';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '20px', color: '#0171BD' }} />
                  <span>حجز مواعيد</span>
                </NavLink>
              </div>
            </div>
          </div>
        </>
      )}

      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top" style={{ 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '0.5rem 0',
        width: '100%',
        left: 0,
        right: 0,
        margin: 0
      }}>
        <div className="d-flex justify-content-between align-items-center" style={{
          paddingLeft: isMobile ? '0' : '1rem',
          paddingRight: isMobile ? '0' : '1rem',
          width: '100%',
          margin: 0
        }}>
          
          {/* على الموبايل: اللوجو على اليمين */}
          <div className="d-flex align-items-center">
            {/* الشعار */}
            <NavLink to="/" className="navbar-brand navbar-logo-link">
              <img
                src={logo}
                alt="Logo"
                className="navbar-logo-img"
                style={{ 
                  objectFit: "contain",
                  width: isMobile ? '70px' : 
                         window.innerWidth <= 991 ? '110px' :
                         window.innerWidth <= 1200 ? '150px' : '300px',
                  height: isMobile ? '28px' : 
                          window.innerWidth <= 991 ? '35px' :
                          window.innerWidth <= 1200 ? '50px' : '80px',
                  maxWidth: isMobile ? '70px' : 
                            window.innerWidth <= 991 ? '110px' :
                            window.innerWidth <= 1200 ? '150px' : '250px',
                  marginRight: isMobile ? '0.75rem' : '0'
                }}
              />
            </NavLink>
          </div>
          
          {/* على الموبايل: Burger Menu على اليسار */}
          <div className="d-flex align-items-center" style={{ marginLeft: '-15rem' }}>
            {/* Burger Menu - يظهر فقط على الموبايل */}
            <button
              className="burger-btn d-lg-none"
              onClick={toggleSidebar}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Toggle Menu"
            >
              <img 
                src={menuIcon} 
                alt="Menu" 
                style={{ 
                  width: '28px', 
                  height: '28px',
                  objectFit: 'contain'
                }} 
              />
            </button>
          </div>

          {/* القسم الأيمن: تسجيل الدخول */}
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {/* لوحة التحكم أو تسجيل الدخول */}
            {isLoggedIn ? (
              <div className="d-none d-lg-flex align-items-center gap-2">
                <NavLink 
                  to="/dashboard" 
                  className="dashboard-btn" 
                  style={{ 
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#ffffff',
                    backgroundColor: '#0171BD',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    border: '2px solid #0171BD'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#0171BD';
                    e.currentTarget.style.borderColor = '#0171BD';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(1, 113, 189, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#0171BD';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = '#0171BD';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  لوحة التحكم
                </NavLink>
                
                {/* أيقونة تسجيل الخروج */}
                <button
                  onClick={handleLogout}
                  className="btn"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="تسجيل الخروج"
                >
                  <FontAwesomeIcon 
                    icon={faSignOutAlt} 
                    style={{ 
                      fontSize: '22px', 
                      color: '#0171BD',
                      transition: 'all 0.3s ease',
                      transform: 'scaleX(-1)' // عكس اتجاه الأيقونة
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scaleX(-1) scale(1.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scaleX(-1) scale(1)';
                    }}
                  />
                </button>
              </div>
            ) : (
              <NavLink 
                to="/login" 
                className="login-btn d-none d-lg-block" 
                style={{ 
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#0171BD',
                  backgroundColor: '#ffffff',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  border: '2px solid #0171BD'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0171BD';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = '#0171BD';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(1, 113, 189, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#0171BD';
                  e.currentTarget.style.borderColor = '#0171BD';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                تسجيل دخول
              </NavLink>
            )}
            
          </div>
        </div>
    </nav>

    {/* شريط التصنيفات - مخفي على الموبايل */}
    <div className="bg-white border-top fixed-top d-none d-lg-block" style={{ 
      padding: '0.8rem 0', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginTop: '80px',
      zIndex: 1000,
      width: '100%',
      left: 0,
      right: 0,
      paddingLeft: '3rem',
      paddingRight: '3rem'
    }}>
        <div className="d-flex py-3 align-items-center gap-4" style={{ 
          fontSize: '16px', 
          fontWeight: 'bolder',
          flexWrap: 'wrap',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          letterSpacing: '0.5px'
        }}>
          <NavLink 
            to="/" 
            className="text-decoration-none" 
            style={{ 
              fontSize: '20px',
              fontWeight: 'bolder',
              color: '#4A4A4A',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px'
            }}
          >
            الصفحة الرئيسية
          </NavLink>
          <NavLink 
            to="/products" 
            className="text-decoration-none" 
            style={{ 
              fontSize: '20px',
              fontWeight: 'bolder',
              color: '#4A4A4A',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px'
            }}
          >
            جميع الخدمات
          </NavLink>
          <NavLink 
            to="/book" 
            className="text-decoration-none" 
            style={{ 
              fontSize: '20px',
              fontWeight: 'bolder',
              color: '#4A4A4A',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px'
            }}
          >
            حجز موعد
          </NavLink>
          <NavLink 
            to="/contact" 
            className="text-decoration-none" 
            style={{ 
              fontSize: '20px',
              fontWeight: 'bolder',
              color: '#4A4A4A',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px'
            }}
          >
            تواصل معنا
          </NavLink>
        </div>
    </div>

    </>
  );
}

export default MainNavbar;