import React from 'react';
import MainNavbar from './Components/Navbar/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './Pages/Home/Home';
import OffersPage from './Pages/offers/OffersPage';
import Services from './Components/Services/Services';
import ClinicsPage from './Pages/Clinics/ClinicsPage';
import JobsPage from './Pages/Jobs/JobsPage';
import PricingPage from './Pages/PricingPage/PricingPage';
import ContactPage from './Pages/ContactPage/ContactPage';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import Footer from './Components/Footer/Footer';
import MapSection from './Components/MapSection/MapSection';
import Book from './Pages/Book/Book';
import Dashboard from './Pages/Dashboard/Dashboard';
import Register from './Pages/Auth/Register';
import RegisterPage from './Pages/Auth/RegisterPage';
import Login from './Pages/Auth/Login';
import AllServices from './Pages/AllServices/AllServices';

function App() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="App">
      {!isDashboard && <MainNavbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Book/>} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/all-services" element={<AllServices />} />
          <Route path="/services" element={<Services />} />
          <Route path="/clinics" element={<ClinicsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Home />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
      {!isDashboard && <>
        <MapSection />
        <Footer />
      </>}
    </div>
  );
}

export default App;