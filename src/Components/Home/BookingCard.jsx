import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookingCard = () => {
  const navigate = useNavigate();

  const handleBookingClick = (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="container" style={{ position: 'relative', zIndex: 10 }}>
      <div 
        className="booking-card bg-white rounded-5 shadow-lg px-4 d-flex justify-content-between align-items-center" 
        style={{
          width: '100%', 
          maxWidth: '90%', 
          minHeight: '120px', 
          borderRadius: window.innerWidth < 768 ? '30px' : '50px', 
          marginTop: window.innerWidth < 768 ? '-40px' : '-70px', 
          marginLeft: 'auto', 
          marginRight: 'auto', 
          position: 'relative',
          padding: window.innerWidth < 768 ? '1.5rem 1rem' : '3rem 1.5rem'
        }}
      >
        <div className="container-fluid">
          <div 
            className="booking-content d-flex align-items-center" 
            style={{
              gap: window.innerWidth < 768 ? '0.5rem' : '1rem',
              flexDirection: window.innerWidth < 768 ? 'column' : 'row',
              textAlign: 'center'
            }}
          >
            <div className="booking-icon flex-shrink-0">
              <i className="fas fa-calendar-alt fs-1 color-main"></i>
            </div>
            
            <div className="booking-text flex-grow-1 text-end">
              <div 
                className="question-container rounded-3 p-3" 
                style={{
                  marginBottom: window.innerWidth < 768 ? '0.3rem' : '0.5rem'
                }}
              >
                <h3 
                  className="booking-question fw-bold mb-0" 
                  style={{
                    color: '#000000',
                    fontSize: window.innerWidth < 768 ? '1.5rem' : '2.2rem'
                  }}
                >
                  خدمات غيم
                </h3>
              </div>
              <p 
                className="booking-description text-muted fw-bold mb-0 text-nowrap" 
                style={{
                  fontSize: window.innerWidth < 768 ? '0.9rem' : '1.25rem'
                }}
              >
                احجز موعدك لدى <span style={{color: '#0d78c0', fontWeight: '900'}}>خدمات غيم</span> بخطوات بسيطة....
              </p>
            </div>
            
            <div className="booking-button flex-shrink-0">
              <button 
                onClick={handleBookingClick}
                className="btn rounded-pill fw-bold" 
                style={{
                  backgroundColor: '#0d78c0', 
                  borderColor: '#0d78c0', 
                  color: 'white',
                  fontSize: window.innerWidth < 768 ? '1.1rem' : '1.4rem',
                  padding: window.innerWidth < 768 ? '0.6rem 1.5rem' : '0.8rem 2.5rem',
                  fontWeight: '900',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#0d78c0';
                  e.target.style.borderColor = '#0d78c0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#0d78c0';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = '#0d78c0';
                }}
              >
                احجز الآن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;

