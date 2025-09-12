import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import DropdownWithState from "../DropDownMenue/DropDownMenue";
import CenterServicesDropdown from "../CenterServicesDropdown/CenterServicesDropdown";

const logo = "https://cdn.salla.sa/axjgg/fniOf3POWAeIz8DXX8oPcxjNgjUHvLeqHDdhtDAK.png";

function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  // يقفل المنيو بعد ما اختار لينك
  const handleClose = () => setIsOpen(false);

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
                <CenterServicesDropdown />
              </li>
              <li className="nav-item">
                <NavLink
                  to="/"
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
            </ul>
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