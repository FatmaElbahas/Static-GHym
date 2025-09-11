import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faStar, faPhone, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

const DoctorCard = React.memo(({ doc }) => {
  const [imageError, setImageError] = useState(false);
  
  // تحديد نوع البيانات (API أو افتراضية)
  const isApiData = doc.owner_name || doc.salon_name;
  
  // استخراج البيانات بناءً على النوع
  const name = isApiData ? (doc.owner_name || doc.salon_name) : doc.name;
  const specialty = isApiData ? "عيادة أسنان" : doc.specialty;
  const location = isApiData ? (doc.salon_address || "غير محدد") : doc.location;
  const rating = isApiData ? (doc.rating || 0) : doc.rating;
  const reviews = isApiData ? (doc.total_completed_bookings || 0) : doc.reviews;
  const price = isApiData ? "200 ريال" : doc.price;
  const available = isApiData ? true : doc.available;
  const image = isApiData ? 
    (doc.owner_photo ? `https://enqlygo.com/${doc.owner_photo}` : null) : 
    doc.image;
  const phone = isApiData ? (doc.salon_phone || null) : null;
  
  // معالجة خطأ الصورة
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <div
      className="card1 h-100 shadow-lg bg-white border-0"
      style={{
        borderRadius: "15px !important",
        overflow: "hidden !important",
        cursor: "pointer !important",
        transition: "all 0.3s ease !important",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.3) !important"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      }}
    >
      {/* صورة الطبيب */}
      <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
        {image && !imageError ? (
          <img
            src={image}
            alt={name}
            className="card-img-top w-100 h-100"
            style={{ objectFit: 'cover' }}
            onError={handleImageError}
          />
        ) : (
          <div 
            className="w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ 
              backgroundColor: '#f8f9fa',
              backgroundImage: 'linear-gradient(135deg, #038FAD 0%, #0366d6 100%)'
            }}
          >
            <FontAwesomeIcon 
              icon={faUser} 
              size="3x" 
              className="text-white"
            />
          </div>
        )}
        
        {/* Badge للحالة */}
        <div 
          className="position-absolute top-0 end-0 m-2"
          style={{ zIndex: 1 }}
        >
          <span 
            className={`badge ${available ? 'bg-success' : 'bg-secondary'} px-2 py-1`}
            style={{ fontSize: '0.75rem', borderRadius: '10px' }}
          >
            {available ? 'متاح' : 'غير متاح'}
          </span>
        </div>
      </div>

      {/* محتوى الكارد */}
      <div className="card-body p-3">
        {/* اسم الطبيب */}
        <h5 className="card-title mb-2" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
          {name}
        </h5>
        
        {/* التخصص */}
        <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
          {specialty}
        </p>
        
        {/* الموقع */}
        <div className="d-flex align-items-center mb-2">
          <FontAwesomeIcon 
            icon={faMapMarkerAlt} 
            className="text-muted me-2" 
            style={{ fontSize: '0.8rem' }}
          />
          <span 
            className="text-muted" 
            style={{ fontSize: '0.85rem' }}
            title={location}
          >
            {location.length > 30 ? `${location.substring(0, 30)}...` : location}
          </span>
        </div>
        
        {/* التقييم والحجوزات */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon 
              icon={faStar} 
              className="text-warning me-1" 
              style={{ fontSize: '0.8rem' }}
            />
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              {rating} ({reviews} {isApiData ? 'حجز مكتمل' : 'تقييم'})
            </span>
          </div>
          <span 
            className="text-primary fw-bold" 
            style={{ fontSize: '0.9rem' }}
          >
            {price}
          </span>
        </div>
        
        {/* رقم الهاتف (للمعطيات من API فقط) */}
        {isApiData && phone && (
          <div className="d-flex align-items-center mb-3">
            <FontAwesomeIcon 
              icon={faPhone} 
              className="text-success me-2" 
              style={{ fontSize: '0.8rem' }}
            />
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              {phone}
            </span>
          </div>
        )}
        
        {/* زر الحجز */}
        <button 
          className="btn w-100"
          style={{
            backgroundColor: '#038FAD',
            borderColor: '#038FAD',
            color: 'white',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '500',
            padding: '8px 16px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#0366d6';
            e.target.style.borderColor = '#0366d6';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#038FAD';
            e.target.style.borderColor = '#038FAD';
          }}
        >
          <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
          احجز موعد
        </button>
      </div>
    </div>
  );
});

DoctorCard.displayName = 'DoctorCard';

export default DoctorCard;