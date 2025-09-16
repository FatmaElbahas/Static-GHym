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
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm mb-5">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo */}
        <NavLink to="/" className="navbar-brand">
          <img src={logo} alt="Logo" className="img-fluid navbar-logo" />
        </NavLink>

        {/* Links + Dropdown + Hamburger */}
        <div className="d-flex align-items-center">
          {/* Links + Dropdown */}
          <div
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            id="navbarContent"
          >
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/"
                  onClick={handleClose}
                  className={({ isActive }) =>
                    isActive ? "activeLink nav-link" : "nav-link"
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
                  to="/offers"
                  onClick={handleClose}
                  className={({ isActive }) =>
                    isActive ? "activeLink nav-link" : "nav-link"
                  }
                >
                  الخدمات
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/error"
                  onClick={handleClose}
                  className={({ isActive }) =>
                    isActive ? "activeLink nav-link" : "nav-link"
                  }
                >
                  العروض
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
              {/* أزرار تسجيل الدخول/الداشبورد للموبايل */}
              {isLoggedIn ? (
                <>
                  <li className="nav-item d-lg-none">
                    <button
                      onClick={handleDashboard}
                      className={location.pathname === '/dashboard' ? "activeLink nav-link" : "nav-link"}
                      style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      لوحة التحكم
                    </button>
                  </li>
                  <li className="nav-item d-lg-none">
                    <NavLink
                      to="/logout"
                      onClick={handleLogout}
                      className={({ isActive }) =>
                        isActive ? "activeLink nav-link logout-btn" : "nav-link logout-btn"
                      }
                      title="تسجيل الخروج"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                    </NavLink>
                  </li>
                </>
              ) : (
                <li className="nav-item d-lg-none">
                  <NavLink
                    to="/login"
                    onClick={handleClose}
                    className={({ isActive }) =>
                      isActive ? "activeLink nav-link" : "nav-link"
                    }
                  >
                    تسجيل الدخول
                  </NavLink>
                </li>
              )}
            </ul>
          </div>

          {/* أزرار تسجيل الدخول/الداشبورد */}
          <div className="d-flex align-items-center gap-2">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <button
                    onClick={handleDashboard}
                    className={location.pathname === '/dashboard' ? "activeLink nav-link" : "nav-link"}
                    style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    لوحة التحكم
                  </button>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/logout"
                    onClick={handleLogout}
                    className={({ isActive }) =>
                      isActive ? "activeLink nav-link logout-btn" : "nav-link logout-btn"
                    }
                    title="تسجيل الخروج"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <NavLink
                  to="/login"
                  onClick={handleClose}
                  className={({ isActive }) =>
                    isActive ? "activeLink nav-link" : "nav-link"
                  }
                >
                  تسجيل الدخول
                </NavLink>
              </li>
            )}
          </div>

          {/* زر الهامبرجر للموبايل */}
          <button
            className="navbar-toggler border-0 ms-3"
            type="button"
            aria-controls="navbarContent"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default MainNavbar;