import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';

const Error404 = () => {
  return (
    <>
      <Helmet>
        <title>404 - الصفحة غير موجودة | غيم</title>
        <meta name="description" content="الصفحة التي تبحث عنها غير موجودة" />
      </Helmet>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px',
        fontFamily: '"IBM Plex Sans Arabic", sans-serif'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-sm-10">
              <div style={{
                background: 'white',
                borderRadius: '30px',
                padding: '60px 40px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                {/* 404 Number */}
                <div style={{
                  fontSize: 'clamp(80px, 15vw, 150px)',
                  fontWeight: 'bold',
                  color: '#0171BD',
                  lineHeight: 1,
                  marginBottom: '20px',
                  textShadow: '0 4px 10px rgba(1, 113, 189, 0.2)'
                }}>
                  404
                </div>

                {/* Error Icon */}
                <div style={{
                  fontSize: '60px',
                  color: '#0171BD',
                  marginBottom: '30px',
                  opacity: 0.7
                }}>
                  <FontAwesomeIcon icon={faSearch} />
                </div>

                {/* Main Message */}
                <h1 style={{
                  fontSize: 'clamp(24px, 5vw, 32px)',
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  marginBottom: '15px'
                }}>
                  عذراً، الصفحة غير موجودة
                </h1>

                {/* Description */}
                <p style={{
                  fontSize: 'clamp(14px, 3vw, 18px)',
                  color: '#6c757d',
                  marginBottom: '40px',
                  lineHeight: 1.8
                }}>
                  الصفحة التي تبحث عنها قد تكون محذوفة أو تم تغيير اسمها أو غير متاحة مؤقتاً
                </p>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  {/* Home Button */}
                  <Link
                    to="/"
                    style={{
                      textDecoration: 'none',
                      background: '#0171BD',
                      color: 'white',
                      padding: '15px 35px',
                      borderRadius: '25px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: '0 4px 15px rgba(1, 113, 189, 0.3)',
                      transition: 'all 0.3s ease',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#015a9a';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(1, 113, 189, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#0171BD';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(1, 113, 189, 0.3)';
                    }}
                  >
                    <FontAwesomeIcon icon={faHome} />
                    العودة للرئيسية
                  </Link>

                  {/* Book Appointment Button */}
                  <Link
                    to="/book"
                    style={{
                      textDecoration: 'none',
                      background: 'white',
                      color: '#0171BD',
                      padding: '15px 35px',
                      borderRadius: '25px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      border: '2px solid #0171BD',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#0171BD';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.color = '#0171BD';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    حجز موعد
                  </Link>
                </div>

                {/* Popular Links */}
                <div style={{
                  marginTop: '50px',
                  paddingTop: '30px',
                  borderTop: '1px solid #e9ecef'
                }}>
                  <p style={{
                    fontSize: '14px',
                    color: '#6c757d',
                    marginBottom: '15px'
                  }}>
                    أو يمكنك زيارة:
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <Link
                      to="/products"
                      style={{
                        color: '#0171BD',
                        textDecoration: 'none',
                        fontSize: '14px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.textDecoration = 'none';
                      }}
                    >
                      المنتجات
                    </Link>
                    <Link
                      to="/national-day"
                      style={{
                        color: '#0171BD',
                        textDecoration: 'none',
                        fontSize: '14px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.textDecoration = 'none';
                      }}
                    >
                      عروض اليوم الوطني
                    </Link>
                    <Link
                      to="/payment-methods"
                      style={{
                        color: '#0171BD',
                        textDecoration: 'none',
                        fontSize: '14px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.textDecoration = 'none';
                      }}
                    >
                      طرق الدفع
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error404;


