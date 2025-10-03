import React, { useState, useEffect } from 'react';
import MainNavbar from './Components/Navbar/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './Pages/Home/Home';
import ContactPage from './Pages/ContactPage/ContactPage';
import Footer from './Components/Footer/Footer';
import Dashboard from './Pages/Dashboard/Dashboard';
import RegisterPage from './Pages/Auth/RegisterPage';
import Login from './Pages/Auth/Login';
import ProductsPage from './Pages/Products/ProductsPage';
import NationalDay from './Pages/NationalDay/NationalDay';
import PaymentMethods from './Pages/PaymentMethods/PaymentMethods';
import Book from './Pages/Book/Book';
import Error404 from './Pages/Error404/Error404';

function App() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const isDashboard = location.pathname === '/dashboard';
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';
  const isError404 = !['/', '/offers', '/national-day', '/products', '/contact', '/payment-methods', '/book', '/dashboard', '/register', '/login', '/logout'].includes(location.pathname);
  
  const hideMainNavbar = isDashboard || isLogin || isRegister || isError404;
  const hideFooter = isDashboard || isError404;

  // Loading bar animation on route change
  useEffect(() => {
    setIsLoading(true);
    setProgress(0);
    
    // Simulate progress
    const interval1 = setTimeout(() => setProgress(30), 100);
    const interval2 = setTimeout(() => setProgress(60), 300);
    const interval3 = setTimeout(() => setProgress(90), 500);
    const interval4 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
    }, 800);

    return () => {
      clearTimeout(interval1);
      clearTimeout(interval2);
      clearTimeout(interval3);
      clearTimeout(interval4);
    };
  }, [location.pathname]);

  return (
    <div className="App">
      {/* Loading Progress Bar */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: `${progress}%`,
          height: '4px',
          backgroundColor: '#0171BD',
          zIndex: 99999,
          transition: 'width 0.3s ease',
          boxShadow: '0 0 10px rgba(1, 113, 189, 0.8)'
        }} />
      )}
      
      {!hideMainNavbar && <MainNavbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offers" element={<NationalDay />} />
          <Route path="/national-day" element={<NationalDay />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/book" element={<Book />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Home />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;