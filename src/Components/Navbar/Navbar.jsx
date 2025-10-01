import React, { useState, useEffect, useCallback, useMemo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faShoppingCart, faSearch, faTimes, faUser, faGlobe, faBoxOpen, faListAlt, faTags, faLink, faHome } from '@fortawesome/free-solid-svg-icons';
import menuIcon from '../../assets/images/menu.png';

const logo = "https://cdn.salla.sa/axjgg/fniOf3POWAeIz8DXX8oPcxjNgjUHvLeqHDdhtDAK.png";

function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('عربي');
  const [selectedCountry, setSelectedCountry] = useState('السعودية');
  const [showSubMenu, setShowSubMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
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
      backgroundColor: '#fff',
      zIndex: 9999,
      overflowY: 'auto',
      transition: 'right 0.3s ease',
      boxShadow: '-2px 0 10px rgba(0,0,0,0.1)'
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
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                color: '#4a4a4a',
                fontSize: '18px',
                fontWeight: '400',
                padding: '0.4rem 1rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            >
              <FontAwesomeIcon icon={faHome} style={{ fontSize: '20px' }} />
              <span>الصفحة الرئيسية</span>
            </NavLink>
            
            {/* تسجيل دخول */}
            <NavLink
              to="/login"
              className="d-flex align-items-center gap-3 text-decoration-none"
              style={{
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                color: '#4a4a4a',
                fontSize: '18px',
                fontWeight: '400',
                padding: '0.4rem 1rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            >
              <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px' }} />
              <span>تسجيل دخول</span>
            </NavLink>

            <hr style={{ margin: '0.15rem 0' }} />

            {/* جميع المنتجات */}
            <NavLink
              to="/products"
              className="d-flex align-items-center gap-3 text-decoration-none"
              style={{
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                color: '#4a4a4a',
                fontSize: '18px',
                fontWeight: '400',
                padding: '0.4rem 1rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            >
              <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: '20px' }} />
              <span>جميع المنتجات</span>
            </NavLink>

            {/* جميع التصنيفات */}
            <div
              className="d-flex align-items-center gap-3"
              style={{
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                color: '#4a4a4a',
                fontSize: '18px',
                fontWeight: '400',
                padding: '0.4rem 1rem',
                cursor: 'pointer'
              }}
            >
              <FontAwesomeIcon icon={faListAlt} style={{ fontSize: '20px' }} />
              <span>جميع التصنيفات</span>
            </div>

            <hr style={{ margin: '0.15rem 0' }} />

            {/* عروض اليوم الوطني 95 */}
            <NavLink
              to="/offers"
              className="d-flex align-items-center gap-3 text-decoration-none"
              style={{
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                color: '#4a4a4a',
                fontSize: '18px',
                fontWeight: '400',
                padding: '0.4rem 1rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            >
              <FontAwesomeIcon icon={faTags} style={{ fontSize: '20px' }} />
              <span>عروض اليوم الوطني 95</span>
            </NavLink>

            {/* الجلدية */}
            <div
              className="d-flex align-items-center gap-3"
              style={{
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                color: '#4a4a4a',
                fontSize: '17px',
                fontWeight: '400',
                padding: '0.6rem 1rem 0.6rem 2rem'
              }}
            >
              <span>■ الجلدية</span>
            </div>

            {/* الأسنان */}
            <div
              className="d-flex align-items-center gap-3"
              style={{
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                color: '#4a4a4a',
                fontSize: '17px',
                fontWeight: '400',
                padding: '0.6rem 1rem 0.6rem 2rem'
              }}
            >
              <span>■ الأسنان</span>
            </div>

            {/* عروض ليزر الرجال */}
            <div
              className="d-flex align-items-center gap-3"
              style={{
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                color: '#4a4a4a',
                fontSize: '17px',
                fontWeight: '400',
                padding: '0.6rem 1rem 0.6rem 2rem'
              }}
            >
              <span>■ عروض ليزر الرجال</span>
            </div>

            {/* عروض ليزر النساء */}
            <div
              className="d-flex align-items-center gap-3"
              style={{
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                color: '#4a4a4a',
                fontSize: '17px',
                fontWeight: '400',
                padding: '0.6rem 1rem 0.6rem 2rem'
              }}
            >
              <span>■ عروض ليزر النساء</span>
            </div>

            <hr style={{ margin: '0.15rem 0' }} />

            {/* روابط مهمة */}
            <div
              onClick={() => setShowSubMenu(true)}
              className="d-flex align-items-center gap-3"
              style={{
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                color: '#4a4a4a',
                fontSize: '18px',
                fontWeight: '400',
                padding: '0.4rem 1rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            >
              <FontAwesomeIcon icon={faLink} style={{ fontSize: '20px' }} />
              <span>روابط مهمة</span>
              <span style={{ marginRight: 'auto' }}>◄</span>
            </div>

            {/* الشحن إلى */}
            <div
              className="d-flex align-items-center gap-3"
              style={{
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                color: '#4a4a4a',
                fontSize: '18px',
                fontWeight: '400',
                padding: '0.6rem 1rem'
              }}
            >
              <FontAwesomeIcon icon={faGlobe} style={{ fontSize: '20px' }} />
              <div className="d-flex flex-column">
                <span style={{ fontSize: '14px', color: '#6c757d' }}>الشحن إلى</span>
                <span>السعودية</span>
              </div>
            </div>

            <hr style={{ margin: '0.15rem 0' }} />

            {/* خيارات الدفع والتوصيل */}
            <NavLink
              to="/payment-methods"
              className="d-flex align-items-center gap-3 text-decoration-none"
              style={{
                borderRadius: '8px',
                backgroundColor: '#DFD458',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '500',
                padding: '0.8rem 1rem',
                transition: 'background-color 0.2s',
                textAlign: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C5B34E'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DFD458'}
            >
              <span>خيارات الدفع والتوصيل</span>
            </NavLink>
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
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
              backgroundColor: '#fff',
              zIndex: 10001,
              overflowY: 'auto',
              transition: 'right 0.3s ease',
              boxShadow: '-2px 0 10px rgba(0,0,0,0.1)'
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

              {/* الشحن إلى */}
              <div
                className="d-flex align-items-center gap-3"
                style={{
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  color: '#4a4a4a',
                  fontSize: '16px',
                  fontWeight: '400',
                  padding: '0.8rem 1rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  <img 
                    src="https://flagcdn.com/w80/sa.png" 
                    alt="السعودية"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="d-flex align-items-center justify-content-between" style={{ flex: 1 }}>
                  <div className="d-flex flex-column">
                    <span style={{ fontSize: '12px', color: '#6c757d' }}>الشحن إلى</span>
                    <span style={{ fontSize: '16px', fontWeight: '500' }}>السعودية</span>
                  </div>
                  <FontAwesomeIcon icon={faGlobe} style={{ fontSize: '18px', color: '#6c757d' }} />
                </div>
              </div>

              {/* قائمة الروابط */}
              <div className="d-flex flex-column gap-1">
                <NavLink
                  to="/"
                  onClick={() => setShowSubMenu(false)}
                  className="d-flex align-items-center text-decoration-none"
                  style={{
                    padding: '0.8rem 1rem',
                    color: '#484848',
                    fontSize: '16px',
                    fontWeight: '400',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  سياسة الخصوصية
                </NavLink>

                <NavLink
                  to="/contact"
                  onClick={() => setShowSubMenu(false)}
                  className="d-flex align-items-center text-decoration-none"
                  style={{
                    padding: '0.8rem 1rem',
                    color: '#484848',
                    fontSize: '16px',
                    fontWeight: '400',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  تواصل معنا
                </NavLink>

                <NavLink
                  to="/"
                  onClick={() => setShowSubMenu(false)}
                  className="d-flex align-items-center text-decoration-none"
                  style={{
                    padding: '0.8rem 1rem',
                    color: '#484848',
                    fontSize: '16px',
                    fontWeight: '400',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  خريطة الموقع
                </NavLink>

                <NavLink
                  to="/book"
                  onClick={() => setShowSubMenu(false)}
                  className="d-flex align-items-center text-decoration-none"
                  style={{
                    padding: '0.8rem 1rem',
                    color: '#484848',
                    fontSize: '16px',
                    fontWeight: '400',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  حجز مواعيد
                </NavLink>
              </div>
            </div>
          </div>
        </>
      )}

      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top" style={{ 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '0.5rem 0'
      }}>
      <div className="mx-auto" style={{ width: '95%', maxWidth: 'none' }}>
        <div className="d-flex justify-content-between align-items-center w-100">
          
          {/* القسم الأيسر: خيارات الدفع والتوصيل + Burger Menu للموبايل */}
          <div className="d-flex align-items-center gap-3">
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

            <NavLink to="/payment-methods" className="d-none d-lg-block text-decoration-none" style={{ 
              fontSize: '20px',
              fontWeight: 'bolder',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px',
              color: '#4A4A4A',
              cursor: 'pointer'
            }}>
              خيارات الدفع والتوصيل
            </NavLink>
          </div>

          {/* القسم الأوسط: الشعار */}
          <NavLink to="/" className="navbar-brand mx-auto">
            <img
              src={logo}
              alt="Logo"
              style={{ 
                width: "200px", 
                height: "50px", 
                objectFit: "contain",
                maxWidth: '150px'
              }}
            />
          </NavLink>

          {/* القسم الأيمن: السلة + تسجيل الدخول + البحث + اللغة + الدولة */}
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {/* الدولة - مخفي على الموبايل */}
            <div className="d-flex align-items-center gap-2">
            <button 
              onClick={() => setShowLocationModal(true)}
              className="btn btn-outline-secondary btn-sm d-none d-lg-flex align-items-center gap-1" 
              style={{
                fontSize: '22px',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                color: '#000000',
                fontWeight: '900'
              }}
            >
              {selectedCountry}
              <span style={{ fontSize: '0.7rem' }}>▼</span>
            </button>
            
            {/* خط فاصل */}
            <div className="d-none d-lg-block" style={{ width: '1px', height: '20px', backgroundColor: '#ddd' }}></div>
            
            {/* اللغة - مخفي على الموبايل */}
            <button 
              onClick={() => setShowLocationModal(true)}
              className="btn btn-outline-secondary btn-sm d-none d-lg-block" 
              style={{
                fontSize: '22px',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                color: '#000000',
                fontWeight: '900'
              }}
            >
              {selectedLanguage}
            </button>
              </div>
            
            {/* خط فاصل */}
            <div className="d-none d-lg-block" style={{ width: '1px', height: '20px', backgroundColor: '#ddd' }}></div>
            
            {/* البحث */}
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faSearch} className="text-muted" style={{ fontSize: '18px' }} />
            </div>
            
            {/* خط فاصل */}
            <div className="d-none d-lg-block" style={{ width: '1px', height: '20px', backgroundColor: '#ddd' }}></div>
            
            {/* تسجيل الدخول - مخفي على الموبايل */}
            <NavLink to="/login" className="text-decoration-none d-none d-lg-block" style={{ 
              fontSize: '20px',
              fontWeight: 'bolder',
              color: '#4A4A4A',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px'
            }}>
              تسجيل دخول
            </NavLink>
            
            {/* خط فاصل */}
            <div className="d-none d-lg-block" style={{ width: '1px', height: '20px', backgroundColor: '#ddd' }}></div>
            
            {/* سلة التسوق */}
            <FontAwesomeIcon icon={faShoppingCart} className="text-dark" style={{ fontSize: '18px' }} />
          </div>
        </div>
      </div>
    </nav>

    {/* شريط التصنيفات - مخفي على الموبايل */}
    <div className="bg-white border-top fixed-top d-none d-lg-block" style={{ 
      padding: '0.8rem 0', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginTop: '80px',
      zIndex: 1000
    }}>
      <div className="mx-auto" style={{ width: '94%', maxWidth: 'none' }}>
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
            جميع المنتجات
          </NavLink>
          <NavLink 
            to="/offers" 
            className="text-decoration-none" 
            style={{ 
              fontSize: '20px',
              fontWeight: 'bolder',
              color: '#4A4A4A',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px'
            }}
          >
            عروض اليوم الوطني 95
          </NavLink>
        </div>
      </div>
    </div>

    {/* Location & Language Modal */}
    {showLocationModal && (
      <>
        {/* Backdrop */}
        <div 
          onClick={() => setShowLocationModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9998
          }}
        />
        
        {/* Modal */}
        <div 
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '3rem 2.5rem',
            maxWidth: '600px',
            width: '90%',
            zIndex: 9999,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowLocationModal(false)}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: '#f0f0f0',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#000',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e0e0e0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f0f0f0';
            }}
          >
            ×
          </button>

          {/* Content */}
          <div className="row g-4" style={{ marginBottom: '2rem' }}>
            {/* الشحن إلى */}
            <div className="col-6">
              <label style={{ 
                display: 'block', 
                marginBottom: '15px', 
                fontWeight: '700',
                fontSize: '20px',
                color: '#000000',
                textAlign: 'right'
              }}>
                الشحن إلى
              </label>
              <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  border: 'none',
                  backgroundColor: '#e8e8e8',
                  borderRadius: '10px',
                  fontSize: '18px',
                  color: '#000000',
                  textAlign: 'right',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23000000\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left 15px center',
                  backgroundSize: '18px',
                  paddingLeft: '45px',
                  fontWeight: '500',
                  outline: 'none'
                }}
              >
                <option value="السعودية">السعودية</option>
                <option value="الإمارات">الإمارات</option>
                <option value="الكويت">الكويت</option>
                <option value="قطر">قطر</option>
                <option value="البحرين">البحرين</option>
                <option value="عمان">عمان</option>
              </select>
            </div>

            {/* اللغة */}
            <div className="col-6">
              <label style={{ 
                display: 'block', 
                marginBottom: '15px', 
                fontWeight: '700',
                fontSize: '20px',
                color: '#000000',
                textAlign: 'right'
              }}>
                اللغة
              </label>
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  border: 'none',
                  backgroundColor: '#e8e8e8',
                  borderRadius: '10px',
                  fontSize: '18px',
                  color: '#000000',
                  textAlign: 'right',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23000000\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left 15px center',
                  backgroundSize: '18px',
                  paddingLeft: '45px',
                  fontWeight: '500',
                  outline: 'none'
                }}
              >
                <option value="عربي">عربي</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          {/* حفظ Button */}
          <a
            onClick={() => setShowLocationModal(false)}
            style={{
              width: '180px',
              margin: '3rem auto 0',
              display: 'block',
              padding: '15px',
              borderRadius: '10px',
              border: '1px solid #e0e0e0',
              backgroundColor: '#ffffff',
              fontSize: '18px',
              fontWeight: '600',
              color: '#000',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            حفظ
          </a>
        </div>
      </>
    )}
    </>
  );
}

export default MainNavbar;