import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainNavbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import ContactPage from './Pages/ContactPage/ContactPage';
import Footer from './Components/Footer/Footer';
import Dashboard from './Pages/Dashboard/Dashboard';
import RegisterPage from './Pages/Auth/RegisterPage';
import Login from './Pages/Auth/Login';
import ProductsPage from './Pages/Products/ProductsPage';
import ServiceDetails from './Pages/ServiceDetails/ServiceDetails';
import PaymentMethods from './Pages/PaymentMethods/PaymentMethods';
import Book from './Pages/Book/Book';

function RegisterApp() {
  const location = useLocation();
  const isRegisterPage = location.pathname === '/register';
  const isDashboardPage = location.pathname === '/dashboard';

  // Smooth scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="App">
      {!isRegisterPage && !isDashboardPage && <MainNavbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/service/:serviceId" element={<ServiceDetails />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/book" element={<Book />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      {!isRegisterPage && !isDashboardPage && <Footer />}
    </div>
  );
}

export default RegisterApp;
