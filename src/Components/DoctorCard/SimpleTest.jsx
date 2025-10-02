import React from 'react';
import DoctorCard from './DoctorCard';

/**
 * مثال بسيط لاختبار DoctorCard
 */
const SimpleTest = () => {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">اختبار DoctorCard</h1>
      
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h3>اختبار مع salonId</h3>
          <DoctorCard salonId={2} />
        </div>
      </div>
      
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <h3>اختبار مع salonData</h3>
          <DoctorCard salonData={{
            id: 1,
            owner_name: "د. أحمد محمد",
            salon_name: "عيادة الأسنان الذهبية",
            salon_address: "شارع الملك فهد - الرياض",
            salon_phone: "+966 112345678",
            rating: 4.5,
            reviews_avg_rating: 4.8,
            total_completed_bookings: 150,
            salon_categories: "1,2",
            created_at: "2025-01-01T00:00:00.000000Z",
            updated_at: "2025-01-01T00:00:00.000000Z"
          }} />
        </div>
      </div>
    </div>
  );
};

export default SimpleTest;
