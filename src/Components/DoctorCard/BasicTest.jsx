import React from 'react';

/**
 * اختبار أساسي لـ DoctorCard
 */
const BasicTest = () => {
  // بيانات تجريبية بسيطة
  const testData = {
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
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          اختبار DoctorCard
        </h1>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3>معلومات الاختبار:</h3>
          <ul>
            <li>البيانات: بيانات تجريبية</li>
            <li>المكون: DoctorCard</li>
            <li>الطريقة: salonData</li>
          </ul>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>الكارد:</h3>
          <div style={{ border: '2px dashed #ccc', padding: '20px', minHeight: '300px' }}>
            <p style={{ textAlign: 'center', color: '#666' }}>
              سيظهر DoctorCard هنا...
            </p>
            {/* سيتم إضافة الكارد هنا */}
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginTop: '20px'
        }}>
          <h3>البيانات المستخدمة:</h3>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '5px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify(testData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default BasicTest;
