import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faMapMarkerAlt, faStar, faPhone, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

const SearchResultCard = React.memo(({ result }) => {
  const [imageError, setImageError] = useState(false);
  
  // تحديد نوع النتيجة
  const isDoctor = result.owner_name && !result.salon_name;
  const isClinic = result.salon_name && !result.owner_name;
  
  // استخراج البيانات من API الحقيقي
  const name = result.owner_name || result.salon_name || "غير محدد";
  const type = isDoctor ? "دكتور" : isClinic ? "عيادة" : "غير محدد";
  const specialty = "عيادة أسنان"; // من البيانات الحقيقية
  const location = result.salon_address || "غير محدد";
  const rating = result.rating || 0;
  const reviews = result.total_completed_bookings || 0;
  const price = "200 ريال"; // سعر افتراضي
  const image = result.owner_photo ? `https://enqlygo.com/${result.owner_photo}` : null;
  const phone = result.salon_phone || "غير محدد";
  const about = result.salon_about || "عيادة متخصصة في طب الأسنان";
  
  // معالجة خطأ الصورة
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <div
      className="card h-100 border-0"
      style={{
        borderRadius: '15px',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        background: 'white'
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
      {/* صورة الطبيب/العيادة */}
      <div className="position-relative d-flex justify-content-center align-items-center" style={{ height: '120px', padding: '20px' }}>
        {image && !imageError ? (
          <img
            src={image}
            alt={name}
            style={{ 
              width: '80px', 
              height: '80px', 
              objectFit: 'cover', 
              borderRadius: '50%' 
            }}
            onError={handleImageError}
          />
        ) : (
          <div 
            className="d-flex align-items-center justify-content-center"
            style={{ 
              width: '80px',
              height: '80px',
              backgroundColor: '#f8f9fa',
              backgroundImage: 'linear-gradient(135deg, #038FAD 0%, #0366d6 100%)',
              borderRadius: '50%'
            }}
          >
            <FontAwesomeIcon 
              icon={isDoctor ? faUser : faBuilding} 
              size="2x" 
              className="text-white"
            />
          </div>
        )}
        
        {/* Badge للنوع */}
        <div 
          className="position-absolute top-0 end-0 m-2"
          style={{ zIndex: 1 }}
        >
          <span 
            className={`badge ${isDoctor ? 'bg-primary' : 'bg-success'} px-2 py-1`}
            style={{ fontSize: '0.75rem', borderRadius: '10px' }}
          >
            <FontAwesomeIcon 
              icon={isDoctor ? faUser : faBuilding} 
              className="me-1" 
              style={{ fontSize: '0.7rem' }}
            />
            {type}
          </span>
        </div>
      </div>

      {/* محتوى الكارد */}
      <div className="card-body p-3">
        {/* اسم الطبيب/العيادة */}
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
              {rating} ({reviews} حجز مكتمل)
            </span>
          </div>
          <span 
            className="text-primary fw-bold" 
            style={{ fontSize: '0.9rem' }}
          >
            {price}
          </span>
        </div>
        
        {/* رقم الهاتف */}
        {phone && phone !== "غير محدد" && (
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

SearchResultCard.displayName = 'SearchResultCard';

export default SearchResultCard;