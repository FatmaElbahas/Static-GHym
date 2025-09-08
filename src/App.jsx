import React from 'react';
import MainNavbar from './Components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import OffersPage from './Pages/offers/OffersPage';
import ClinicsPage from './Pages/Clinics/ClinicsPage';
import JobsPage from './Pages/Jobs/JobsPage';
import PricingPage from './Pages/PricingPage/PricingPage';
import ContactPage from './Pages/ContactPage/ContactPage';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import Footer from './Components/Footer/Footer';

function App() {
  return (
    <div className="App">
      <MainNavbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/clinics" element={<ClinicsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;