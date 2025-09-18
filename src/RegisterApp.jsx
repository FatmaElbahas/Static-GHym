import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainNavbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import OffersPage from './Pages/offers/OffersPage';
import ClinicsPage from './Pages/Clinics/ClinicsPage';
import JobsPage from './Pages/Jobs/JobsPage';
import PricingPage from './Pages/PricingPage/PricingPage';
import ContactPage from './Pages/ContactPage/ContactPage';
import Services from './Components/Services/Services';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import Footer from './Components/Footer/Footer';
import Book from './Pages/Book/Book';
import Dashboard from './Pages/Dashboard/Dashboard';
import RegisterPage from './Pages/Auth/RegisterPage';
import Login from './Pages/Auth/Login';

function RegisterApp() {
  const location = useLocation();
  const isRegisterPage = location.pathname === '/register';
  const isDashboardPage = location.pathname === '/dashboard';

  return (
    <div className="App">
      {!isRegisterPage && !isDashboardPage && <MainNavbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Book/>} />
          <Route path="/home" element={<Home />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/clinics" element={<ClinicsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
      {!isRegisterPage && !isDashboardPage && <Footer />}
    </div>
  );
}

export default RegisterApp;
