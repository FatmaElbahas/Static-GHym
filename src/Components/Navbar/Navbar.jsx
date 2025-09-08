import React from "react";
import { NavLink } from "react-router-dom";
import DropdownWithState from "../DropDownMenue/DropDownMenue";
import CenterServicesDropdown from "../CenterServicesDropdown/CenterServicesDropdown";
import logo from "../../assets/images/logo.png";

function MainNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm mb-5">
      <div className="container d-flex justify-content-between align-items-center">

        {/* Logo + Cities Dropdown + Search */}
        <div className="d-flex align-items-center gap-3">
          <NavLink to="/" className="navbar-brand">
            <img src={logo} alt="Logo" className="logo w-full" />
          </NavLink>
          
          {/* Dropdown المدن */}
          <DropdownWithState />

          {/* Search + Button */}
          <input
            type="search"
            placeholder="ابحث عن طبيب او عياده او"
            className="form-control"
          />
          <button className="btn bg-main text-white">بحث</button>
        </div>

        {/* زر الهامبرجر للموبايل */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links + Dropdown */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center gap-3">
            
            {/* Dropdown لخدمات المراكز */}
            <li className="nav-item">
              <CenterServicesDropdown />
            </li>

            <li className="nav-item">
              <NavLink to="/offers" className={({ isActive }) => isActive ? "activeLink nav-link" : "nav-link"}>
                العروض
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/clinics" className={({ isActive }) => isActive ? "activeLink nav-link" : "nav-link"}>
                المراكز الطبية
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/jobs" className={({ isActive }) => isActive ? "activeLink nav-link" : "nav-link"}>
                التوظيف
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/pricing" className={({ isActive }) => isActive ? "activeLink nav-link" : "nav-link"}>
                الأسعار
              </NavLink>
            </li>

            {/* آخر عنصر */}
            <li className="nav-item">
              <NavLink to="/contact" className={({ isActive }) => isActive ? "activeLink nav-link" : "nav-link"}>
                تواصل معنا
              </NavLink>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default MainNavbar;