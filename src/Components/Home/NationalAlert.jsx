import React from 'react';

const NationalAlert = ({ showAlert, onClose }) => {
  if (!showAlert) return null;

  return (
    <div 
      className="mb-0 text-center home-national-alert" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1050,
        borderRadius: 0,
        padding: '8px 12px',
        fontSize: '16px',
        backgroundColor: '#215931',
        color: '#ffffff'
      }}
    >
      <div className="container d-flex justify-content-center align-items-center" style={{ gap: '10px' }}>
        <span style={{ fontWeight: 'bold', color: '#ffffff', textAlign: 'center', flex: 1, fontSize: '16px' }}>
          عروض اليوم الوطني 95 بدأت لاتفوتك🇸🇦💚! ضبطناكم باقوى العروض على خدمات قسم الاسنان والجلدية والليزر
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '2px solid #ffffff',
            borderRadius: '50%',
            fontSize: '22px',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: '#ffffff',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            lineHeight: 1,
            flexShrink: 0,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.color = '#215931';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#ffffff';
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default NationalAlert;

