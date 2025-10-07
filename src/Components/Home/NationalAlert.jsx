import React from 'react';

const NationalAlert = ({ showAlert, onClose }) => {
  if (!showAlert) return null;

  return (
    <>
      <div 
        className="home-national-alert" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          backgroundColor: (window.innerWidth <= 768) ? '#ffffff' : '#215931',
          color: (window.innerWidth <= 768) ? '#ffffff' : 'white',
          zIndex: (window.innerWidth <= 768) ? 9999999997 : 1050,
          padding: '8px 10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          width: '100%',
          margin: 0,
          boxSizing: 'border-box'
        }}
      >
      <div className="d-flex justify-content-between align-items-center" style={{ 
        gap: '10px',
        width: '100%',
        maxWidth: '100%',
        margin: 0,
        padding: '0 0.75rem',
        boxSizing: 'border-box'
      }}>
        <span style={{ fontSize: '14px', fontWeight: '500', flex: 1, textAlign: 'center' }}>
          🎉 احتفالاً باليوم الوطني السعودي 95 - خصومات حصرية على جميع خدماتنا!
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'white',
            color: '#215931',
            border: '2px solid white',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            fontSize: '20px',
            lineHeight: '1',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#215931';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#215931';
          }}
        >
          ×
        </button>
      </div>
    </div>
    </>
  );
};

export default NationalAlert;

